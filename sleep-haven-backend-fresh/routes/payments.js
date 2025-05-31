const express = require('express');
const router = express.Router();

// Import controllers
const { processPayment, getPaymentStatus } = require('../controllers/payments');
const { protect } = require('../middleware/auth');

// Define routes
router.post('/process', protect, processPayment);
router.get('/status/:id', protect, getPaymentStatus);

module.exports = router;
