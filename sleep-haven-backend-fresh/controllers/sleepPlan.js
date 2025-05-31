const SleepPlan = require('../models/SleepPlan');

// @desc    Get all sleep plans
// @route   GET /api/sleep-plan
// @access  Private
exports.getSleepPlans = async (req, res) => {
  try {
    const sleepPlans = await SleepPlan.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: sleepPlans.length,
      data: sleepPlans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single sleep plan
// @route   GET /api/sleep-plan/:id
// @access  Private
exports.getSleepPlan = async (req, res) => {
  try {
    const sleepPlan = await SleepPlan.findById(req.params.id);

    if (!sleepPlan) {
      return res.status(404).json({
        success: false,
        error: 'Sleep plan not found'
      });
    }

    // Make sure user owns the sleep plan
    if (sleepPlan.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this sleep plan'
      });
    }

    res.status(200).json({
      success: true,
      data: sleepPlan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create new sleep plan
// @route   POST /api/sleep-plan
// @access  Private
exports.createSleepPlan = async (req, res) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    const sleepPlan = await SleepPlan.create(req.body);

    res.status(201).json({
      success: true,
      data: sleepPlan
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update sleep plan
// @route   PUT /api/sleep-plan/:id
// @access  Private
exports.updateSleepPlan = async (req, res) => {
  try {
    let sleepPlan = await SleepPlan.findById(req.params.id);

    if (!sleepPlan) {
      return res.status(404).json({
        success: false,
        error: 'Sleep plan not found'
      });
    }

    // Make sure user owns the sleep plan
    if (sleepPlan.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this sleep plan'
      });
    }

    sleepPlan = await SleepPlan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: sleepPlan
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete sleep plan
// @route   DELETE /api/sleep-plan/:id
// @access  Private
exports.deleteSleepPlan = async (req, res) => {
  try {
    const sleepPlan = await SleepPlan.findById(req.params.id);

    if (!sleepPlan) {
      return res.status(404).json({
        success: false,
        error: 'Sleep plan not found'
      });
    }

    // Make sure user owns the sleep plan
    if (sleepPlan.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this sleep plan'
      });
    }

    await sleepPlan.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
