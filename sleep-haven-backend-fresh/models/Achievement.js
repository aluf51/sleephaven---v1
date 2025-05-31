const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  babyName: {
    type: String,
    required: [true, 'Please add baby name']
  },
  title: {
    type: String,
    required: [true, 'Please add achievement title']
  },
  description: {
    type: String,
    required: [true, 'Please add achievement description']
  },
  icon: {
    type: String,
    default: 'trophy'
  },
  dateEarned: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Achievement', AchievementSchema);
