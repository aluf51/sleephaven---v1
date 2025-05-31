const User = require('../models/User');
const Payment = require('../models/Payment');
const Progress = require('../models/Progress');
const SleepPlan = require('../models/SleepPlan');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get all payments
// @route   GET /api/admin/payments
// @access  Private/Admin
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate({
      path: 'user',
      select: 'name email'
    });

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get analytics data
// @route   GET /api/admin/analytics
// @access  Private/Admin
exports.getAnalytics = async (req, res) => {
  try {
    // Get total users
    const totalUsers = await User.countDocuments();
    
    // Get total payments
    const payments = await Payment.find();
    const totalPayments = payments.length;
    
    // Calculate total revenue
    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
    
    // Get total sleep plans
    const totalSleepPlans = await SleepPlan.countDocuments();
    
    // Get user growth (new users in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    // Get average sleep quality from progress data
    const progressData = await Progress.find();
    const avgSleepQuality = progressData.length > 0 
      ? progressData.reduce((sum, item) => sum + item.sleepQuality, 0) / progressData.length 
      : 0;

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalPayments,
        totalRevenue,
        totalSleepPlans,
        newUsers,
        avgSleepQuality: avgSleepQuality.toFixed(1)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
