// --- START OF FILE activityModel.js ---
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activitySchema = new Schema({
  activityName: { // Renamed from 'activityName' to 'title' in UI for consistency, but model keeps 'activityName'
    type: String,
    required: true,
  },
  activityPhoto: { // Renamed from 'activityPhoto' to 'image' in UI, but model keeps 'activityPhoto'
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  // Removed parentId field as it was ambiguous for enrollment tracking.
  enrolledParents: [{ // New field to track parents enrolled in this activity
    _id: false, // Prevents Mongoose from creating a new _id for each subdocument
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'parent', // Reference to the 'parent' model
      required: true,
    },
    status: { // Status specific to this parent's enrollment in this activity
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Activity', activitySchema);
// --- END OF FILE activityModel.js ---