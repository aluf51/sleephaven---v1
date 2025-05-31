const User = require('../models/User');
const Progress = require('../models/Progress');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get Margaret AI assistant response
// @route   POST /api/margaret/chat
// @access  Private
exports.getMargaretResponse = async (req, res) => {
  try {
    const { message, babyName, babyAge } = req.body;

    // Simple response logic - in production this would connect to an AI service
    let response = '';
    
    if (message.toLowerCase().includes('sleep training')) {
      response = `Based on your ${babyAge} month old baby's needs, I recommend a gentle sleep training approach. Start with a consistent bedtime routine and gradually reduce assistance over time.`;
    } else if (message.toLowerCase().includes('night waking')) {
      response = `Night wakings are common for ${babyAge} month olds. Try to keep interactions minimal during night wakings to encourage self-soothing.`;
    } else if (message.toLowerCase().includes('nap')) {
      response = `At ${babyAge} months, ${babyName} should be taking about ${babyAge < 6 ? '3-4' : babyAge < 12 ? '2-3' : '1-2'} naps per day. Keep the sleep environment consistent for all sleep periods.`;
    } else {
      response = `Thank you for your question about ${babyName}. For ${babyAge} month olds, establishing consistent sleep routines is key to better sleep. How else can I help you today?`;
    }

    res.status(200).json({
      success: true,
      data: {
        response,
        timestamp: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get sleep insights
// @route   GET /api/margaret/insights
// @access  Private
exports.getSleepInsights = async (req, res) => {
  try {
    const { babyName } = req.query;
    
    // Get user's progress data
    const progressData = await Progress.find({ 
      user: req.user.id,
      babyName
    }).sort({ date: -1 }).limit(14);
    
    // Get activity logs
    const activityLogs = await ActivityLog.find({
      user: req.user.id,
      babyName,
      activityType: 'sleep'
    }).sort({ startTime: -1 }).limit(20);
    
    // Generate insights based on data
    let insights = [];
    
    if (progressData.length > 0) {
      // Calculate average sleep quality
      const avgQuality = progressData.reduce((sum, item) => sum + item.sleepQuality, 0) / progressData.length;
      
      // Calculate average sleep duration
      const avgDuration = progressData.reduce((sum, item) => sum + item.sleepDuration, 0) / progressData.length;
      
      // Generate insights
      insights.push(`${babyName}'s average sleep quality is ${avgQuality.toFixed(1)}/5 over the past ${progressData.length} days.`);
      insights.push(`${babyName} is sleeping an average of ${avgDuration.toFixed(1)} hours per night.`);
      
      if (progressData.length >= 7) {
        const recentAvg = progressData.slice(0, 7).reduce((sum, item) => sum + item.sleepQuality, 0) / 7;
        const prevAvg = progressData.slice(7, 14).reduce((sum, item) => sum + item.sleepQuality, 0) / Math.min(7, progressData.length - 7);
        
        if (recentAvg > prevAvg) {
          insights.push(`Great progress! ${babyName}'s sleep quality has improved in the past week.`);
        }
      }
    }
    
    if (activityLogs.length > 0) {
      insights.push(`${babyName} has had ${activityLogs.length} recorded sleep sessions recently.`);
    }
    
    if (insights.length === 0) {
      insights.push(`Start logging ${babyName}'s sleep to receive personalized insights.`);
    }

    res.status(200).json({
      success: true,
      data: {
        insights,
        timestamp: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
