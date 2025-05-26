// controllers/activityController.js
const Activity = require('../Models/activityModel');
const multer = require('multer');
const path = require('path');

// Multer setup inside the controller
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
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

// Main controller object
const activityController = {
  upload, // 👈 export this multer middleware here

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
        activityPhoto, // No parentId; it will be added later
      });

      await newActivity.save();
      res.status(201).json(newActivity);
    } catch (error) {
      console.error('Error in addActivity:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async getAllActivities(req, res) {
    const activities = await Activity.find();
    res.json(activities);
  },

  async getActivitiesByParent(req, res) {
    const { parentId } = req.params;
    const activities = await Activity.find({ parentId });
    res.json(activities);
  },

  async markActivityComplete(req, res) {
    const { activityId } = req.params;
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    activity.status = 'completed';
    await activity.save();
    res.json({ message: 'Marked as completed', activity });
  },
};

module.exports = activityController;
