const mongoose = require('mongoose');

const SleepPlanSchema = new mongoose.Schema({
  babyName: {
    type: String,
    required: [true, 'Please add baby name']
  },
  babyAge: {
    type: Number,
    required: [true, 'Please add baby age in months']
  },
  sleepChallenges: {
    type: [String],
    required: [true, 'Please add sleep challenges']
  },
  parentingApproach: {
    type: String,
    required: [true, 'Please add parenting approach']
  },
  recommendations: {
    type: [String],
    required: [true, 'Please add recommendations']
  },
  routines: {
    morning: {
      type: [String],
      default: []
    },
    daytime: {
      type: [String],
      default: []
    },
    evening: {
      type: [String],
      default: []
    },
    bedtime: {
      type: [String],
      default: []
    }
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SleepPlan', SleepPlanSchema);
