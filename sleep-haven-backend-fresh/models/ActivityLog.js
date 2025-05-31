const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  babyName: {
    type: String,
    required: [true, 'Please add baby name']
  },
  activityType: {
    type: String,
    enum: ['sleep', 'feed', 'diaper', 'milestone', 'other'],
    required: [true, 'Please add activity type']
  },
  startTime: {
    type: Date,
    required: [true, 'Please add start time']
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
