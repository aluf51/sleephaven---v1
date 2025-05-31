const express = require('express');
const router = express.Router();

// Import controllers
const { getMargaretResponse, getSleepInsights } = require('../controllers/margaret');
const { protect } = require('../middleware/auth');

// Define routes
router.post('/chat', protect, getMargaretResponse);
router.get('/insights', protect, getSleepInsights);

module.exports = router;
