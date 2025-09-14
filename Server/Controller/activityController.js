// --- START OF FILE activityController.js ---
const Activity = require('../Models/activityModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer setup (already present)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this folder exists on your server
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only .jpeg, .jpg, .png formats allowed!'), false);
};

const upload = multer({ storage, fileFilter });

const activityController = {
  upload, // Export multer middleware

  // Add a new activity (already present)
  async addActivity(req, res) {
    try {
      const { activityName, description, category } = req.body;
      const activityPhoto = req.file ? req.file.filename : null;

      if (!activityName || !description || !category) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const newActivity = new Activity({
        activityName,
        description,
        category,
        activityPhoto, // Image filename
      });

      await newActivity.save();
      res.status(201).json(newActivity);
    } catch (error) {
      console.error('Error in addActivity:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Get all activities (already present)
  async getAllActivities(req, res) {
    try {
      const activities = await Activity.find();
      res.status(200).json({ success: true, activities });
    } catch (error) {
      console.error('Error fetching activities:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },

  // Get activities enrolled by a specific parent (already present)
  async getEnrolledActivitiesByParent(req, res) {
    try {
      const { parentId } = req.params;
      const activities = await Activity.find({
        'enrolledParents.parentId': parentId
      });

      const transformedActivities = activities.map(activity => {
        const parentEnrollment = activity.enrolledParents.find(
          (enrollment) => enrollment.parentId.toString() === parentId
        );
        return {
          _id: activity._id,
          activityName: activity.activityName,
          activityPhoto: activity.activityPhoto,
          description: activity.description,
          category: activity.category,
          status: parentEnrollment ? parentEnrollment.status : 'unknown',
          createdAt: activity.createdAt
        };
      });

      res.status(200).json({ success: true, data: transformedActivities });
    } catch (error) {
      console.error('Error fetching enrolled activities by parent:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  },

  // Get activity by ID (already present)
  async getActivityById(req, res) {
    try {
      const { id } = req.params;
      const activity = await Activity.findById(id);

      if (!activity) {
        return res.status(404).json({ message: 'Activity not found' });
      }
      res.status(200).json({ success: true, activity });
    } catch (error) {
      console.error('Error fetching activity by ID:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },

  // Edit an existing activity (already present)
  async editActivity(req, res) {
    try {
      const { id } = req.params;
      const { activityName, description, category } = req.body;
      const activityPhoto = req.file ? req.file.filename : null;

      const existingActivity = await Activity.findById(id);
      if (!existingActivity) {
        return res.status(404).json({ message: 'Activity not found' });
      }

      if (activityName) existingActivity.activityName = activityName;
      if (description) existingActivity.description = description;
      if (category) existingActivity.category = category;
      if (activityPhoto) existingActivity.activityPhoto = activityPhoto;

      await existingActivity.save();
      res.status(200).json({ success: true, message: 'Activity updated successfully', activity: existingActivity });
    } catch (error) {
      console.error('Error updating activity:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },

  // NEW FUNCTION: Enroll a parent in an activity
  async enrollActivity(req, res) {
    try {
      const { activityId, parentId } = req.params; // Extract from URL parameters

      const activity = await Activity.findById(activityId);
      if (!activity) {
        return res.status(404).json({ success: false, message: 'Activity not found.' });
      }

      // Check if the parent is already enrolled to prevent duplicates
      const isAlreadyEnrolled = activity.enrolledParents.some(
        (enrollment) => enrollment.parentId.toString() === parentId
      );

      if (isAlreadyEnrolled) {
        return res.status(409).json({ success: false, message: 'Parent is already enrolled in this activity.' });
      }

      // Add the new parent enrollment to the array
      activity.enrolledParents.push({
        parentId: parentId,
        status: 'pending', // Default status for new enrollments
        enrolledAt: new Date(),
      });

      await activity.save();

      res.status(200).json({ success: true, message: 'Successfully enrolled in activity!', data: activity });
    } catch (error) {
      console.error('Error enrolling parent in activity:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  },

  // Mark activity as completed for a specific parent enrollment (already present)
  async markActivityComplete(req, res) {
    try {
      const { activityId } = req.params;
      const { parentId } = req.body;

      if (!parentId) {
        return res.status(400).json({ success: false, message: 'Parent ID is required to mark activity complete.' });
      }

      const activity = await Activity.findById(activityId);
      if (!activity) {
        return res.status(404).json({ success: false, message: 'Activity not found.' });
      }

      const enrollment = activity.enrolledParents.find(
        (e) => e.parentId.toString() === parentId
      );

      if (!enrollment) {
        return res.status(404).json({ success: false, message: 'Parent not enrolled in this activity.' });
      }

      enrollment.status = 'completed';
      await activity.save();

      res.status(200).json({ success: true, message: 'Activity marked as completed!', data: activity });
    } catch (error) {
      console.error('Error marking activity complete:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  },

  // Delete an activity (already present)
  async deleteActivity(req, res) {
    try {
      const { id } = req.params;
      const activity = await Activity.findById(id);

      if (!activity) {
        return res.status(404).json({ message: 'Activity not found' });
      }

      if (activity.activityPhoto) {
        const filePath = path.join('uploads', activity.activityPhoto);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.warn('Image not deleted:', err.message);
          }
        });
      }

      await Activity.findByIdAndDelete(id);
      res.status(200).json({ success: true, message: 'Activity deleted successfully' });
    } catch (error) {
      console.error('Error deleting activity:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
};

module.exports = activityController;
// --- END OF FILE activityController.js ---