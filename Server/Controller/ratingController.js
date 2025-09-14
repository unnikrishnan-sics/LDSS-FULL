// ratingController.js

const RatingModel = require("../Models/ratingModel");
const mongoose = require("mongoose");

// Helper function to validate and convert string to ObjectId
const toObjectId = (id, fieldName) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const err = new Error(`Invalid ObjectId format for ${fieldName}: ${id}`);
        err.name = 'InvalidObjectIdError'; // Custom error name for specific handling
        err.status = 400; // HTTP status for this type of error
        throw err;
    }
    return new mongoose.Types.ObjectId(id); // <--- FIXED: Added 'new' keyword
};
// Add this new function to ratingController.js
const getRatingsByProfessionalType = async (req, res) => {
    try {
        const { professionalType } = req.params;

        if (!professionalType) {
            return res.status(400).json({
                success: false,
                message: "Professional type is required."
            });
        }

        const trimmedType = professionalType.trim().toLowerCase();
        if (!['educator', 'theraphist'].includes(trimmedType)) {
            return res.status(400).json({
                success: false,
                message: "Professional type must be either 'educator' or 'therapist'."
            });
        }

        // Determine which model to populate based on professionalType
        const populateOptions = {
            path: 'professionalId',
            model: trimmedType,
            select: 'name email profilePic yearsOfExperience educationalQualification' + 
                   (trimmedType === 'theraphist' ? ' specialities' : '')
        };

        const ratings = await RatingModel.find({ professionalType: trimmedType })
            .populate(populateOptions)
            .populate({
                path: 'childId',
                model: 'child',
                select: 'name age'
            })
            .populate({
                path: 'parentId',
                model: 'parent',
                select: 'name email'
            });

        if (!ratings || ratings.length === 0) {
            return res.status(200).json({
                success: true,
                message: `No ratings found for ${trimmedType}s.`,
                data: []
            });
        }

        return res.status(200).json({
            success: true,
            message: `Ratings for ${trimmedType}s retrieved successfully.`,
            data: ratings
        });

    } catch (error) {
        console.error(`Error in getRatingsByProfessionalType:`, error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Add or Update a rating
const addOrUpdateRating = async (req, res) => {
    try {
        let { professionalId, professionalType, childId, parentId, rating } = req.body;

        if (!professionalId || !professionalType || !childId || !parentId || rating === undefined) {
            return res.status(400).json({
                success: false,
                message: "Professional ID, type, child ID, parent ID, and rating are required."
            });
        }

        // Trim professionalType if it's a string
        if (typeof professionalType === 'string') {
            professionalType = professionalType.trim();
        } else {
             // Ensure professionalType is a string or handle error
            return res.status(400).json({
                success: false,
                message: "Professional type must be a string."
            });
        }

        if (isNaN(rating) || rating < 0.5 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be a number between 0.5 and 5."
            });
        }

        // Validate and convert to ObjectId objects
        let professionalIdObj, childIdObj, parentIdObj;
        try {
            professionalIdObj = toObjectId(professionalId, 'professionalId');
            childIdObj = toObjectId(childId, 'childId');
            parentIdObj = toObjectId(parentId, 'parentId');
        } catch (err) {
            if (err.name === 'InvalidObjectIdError') {
                return res.status(err.status).json({ success: false, message: err.message });
            }
            throw err; // Re-throw other unexpected errors
        }

        // Use the ObjectId objects in the query and update
        const updatedRating = await RatingModel.findOneAndUpdate(
            { professionalId: professionalIdObj, professionalType, childId: childIdObj, parentId: parentIdObj },
            { rating, professionalId: professionalIdObj, professionalType, childId: childIdObj, parentId: parentIdObj },
            { new: true, upsert: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: "Rating submitted successfully.",
            data: updatedRating
        });

    } catch (error) {
        console.error("Error in addOrUpdateRating:", error);
        if (res.headersSent) return; // Avoid sending response if one already sent (e.g. by InvalidObjectIdError catch)

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "A rating conflict occurred. This combination of professional, child, and parent likely already has a rating (unique constraint violation).",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: "Validation failed.",
                errors: error.errors,
                _fullError: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
        if (error.name === 'CastError') {
             return res.status(400).json({
                success: false,
                message: `Invalid data format for field ${error.path}. Expected ${error.kind}.`,
                error: process.env.NODE_ENV === 'development' ? error.message : undefined,
                _fullError: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get a specific rating given by a parent for a professional and child
const getSpecificRating = async (req, res) => {
    try {
        let { professionalId, professionalType, childId, parentId } = req.query;

        if (!professionalId || !professionalType || !childId || !parentId) {
            return res.status(400).json({
                success: false,
                message: "Professional ID, type, child ID, and parent ID are required in query parameters."
            });
        }

        if (typeof professionalType === 'string') {
            professionalType = professionalType.trim();
        } else {
            return res.status(400).json({
                success: false,
                message: "Professional type must be a string."
            });
        }

        let pIdObj, cIdObj, paIdObj;
        try {
            pIdObj = toObjectId(professionalId, 'professionalId');
            cIdObj = toObjectId(childId, 'childId');
            paIdObj = toObjectId(parentId, 'parentId');
        } catch (err) {
            if (err.name === 'InvalidObjectIdError') {
                return res.status(err.status).json({ success: false, message: err.message });
            }
            throw err; // Re-throw other unexpected errors
        }

        const specificRating = await RatingModel.findOne({
            professionalId: pIdObj,
            professionalType,
            childId: cIdObj,
            parentId: paIdObj
        });

        if (!specificRating) {
            return res.status(404).json({ // This is expected if no data matches
                success: false,
                message: "No rating found for the specified criteria."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Rating retrieved successfully.",
            rating: specificRating
        });

    } catch (error) {
        console.error("Error in getSpecificRating:", error);
        if (res.headersSent) return;

        if (error.name === 'CastError') { // Should be caught by toObjectId, but as a fallback from Mongoose
             return res.status(400).json({
                success: false,
                message: `Invalid ID format during database query for field ${error.path}.`,
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get average rating for a professional
const getAverageRatingForProfessional = async (req, res) => {
    try {
        let { professionalId, professionalType } = req.params;

        if (!professionalId || !professionalType) {
            return res.status(400).json({
                success: false,
                message: "Professional ID and type are required."
            });
        }

        if (typeof professionalType === 'string') {
            professionalType = professionalType.trim();
        } else {
             return res.status(400).json({
                success: false,
                message: "Professional type must be a string."
            });
        }
        
        let pIdObj;
        try {
            pIdObj = toObjectId(professionalId, 'professionalId');
        } catch (err) {
            if (err.name === 'InvalidObjectIdError') {
                return res.status(err.status).json({ success: false, message: err.message });
            }
            throw err;
        }

        const result = await RatingModel.aggregate([
            {
                $match: {
                    professionalId: pIdObj,
                    professionalType: professionalType
                }
            },
            {
                $group: {
                    _id: "$professionalId",
                    averageRating: { $avg: "$rating" },
                    totalRatings: { $sum: 1 }
                }
            }
        ]);

        if (result.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No ratings found for this professional yet.",
                data: {
                    professionalId: professionalId, // Return original string ID from params
                    professionalType,
                    averageRating: 0,
                    totalRatings: 0
                }
            });
        }

        return res.status(200).json({
            success: true,
            message: "Average rating retrieved successfully.",
            data: {
                professionalId: result[0]._id.toString(), // Convert ObjectId back to string
                professionalType,
                averageRating: parseFloat(result[0].averageRating.toFixed(2)),
                totalRatings: result[0].totalRatings
            }
        });

    } catch (error) {
        console.error("Error in getAverageRatingForProfessional:", error);
        if (res.headersSent) return;

        if (error.name === 'CastError') { // Should be caught by toObjectId, but as a fallback
             return res.status(400).json({
                success: false,
                message: `Invalid ID format during database query for field ${error.path}.`,
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    addOrUpdateRating,
    getSpecificRating,
    getAverageRatingForProfessional,
    getRatingsByProfessionalType 
};