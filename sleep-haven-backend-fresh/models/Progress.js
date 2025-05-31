const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  babyName: {
    type: String,
    required: [true, 'Please add baby name']
  },
  date: {
    type: Date,
    required: [true, 'Please add date'],
    default: Date.now
  },
  sleepQuality: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please rate sleep quality']
  },
  sleepDuration: {
    type: Number,
    required: [true, 'Please add sleep duration in hours']
  },
  nightWakings: {
    type: Number,
    default: 0
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Progress', ProgressSchema);
