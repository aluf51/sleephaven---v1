const express = require('express');
const router = express.Router();

// Import controllers
const {
  getSleepPlans,
  getSleepPlan,
  createSleepPlan,
  updateSleepPlan,
  deleteSleepPlan
} = require('../controllers/sleepPlan');

// Import middleware
const { protect } = require('../middleware/auth');

// Define routes
router.route('/')
  .get(protect, getSleepPlans)
  .post(protect, createSleepPlan);

router.route('/:id')
  .get(protect, getSleepPlan)
  .put(protect, updateSleepPlan)
  .delete(protect, deleteSleepPlan);

module.exports = router;
