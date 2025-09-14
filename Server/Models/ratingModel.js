const mongoose = require("mongoose");

const ratingSchema = mongoose.Schema({
    professionalId: { // ID of the Educator or Therapist
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    professionalType: { // To distinguish between 'educator' and 'therapist'
        type: String,
        required: true,
        enum: ['educator', 'theraphist']
    },
    childId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'child', // Assuming your child model is named 'child'
        required: true
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'parent', // Assuming your parent model is named 'parent'
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0.5, // MUI Rating component can handle half ratings
        max: 5
    },
}, { timestamps: true });

// Ensure a parent can rate a specific professional for a specific child only once
// This combination makes a unique rating instance
// CORRECTED LINE:
ratingSchema.index({
    professionalId: 1,
    professionalType: 1,
    childId: 1,
    parentId: 1
}, { unique: true });

module.exports = mongoose.model("rating", ratingSchema);