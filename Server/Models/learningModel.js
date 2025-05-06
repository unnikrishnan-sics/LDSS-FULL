const mongoose = require('mongoose');

const learningSchema = mongoose.Schema({
  goal: {
    type: String,
    required: true
  },
  planDuration: {
    type: String,
    required: true
  },
  weeks: [
    {
      activities: [
        {
          title: {
            type: String,
            required: true
          },
          description: {
            type: String,
            required: true
          }
        }
      ]
    }
  ],
  educatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'educator',
    default: null
  },
  therapistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'therapist',
    default: null
  },
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'child',
    unique: true,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("learning plans", learningSchema);
