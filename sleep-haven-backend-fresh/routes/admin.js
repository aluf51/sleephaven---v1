const express = require('express');
const router = express.Router();

// Import controllers
const { getUsers, getUser, getPayments, getAnalytics } = require('../controllers/admin');
const { protect, authorize } = require('../middleware/auth');

// Define routes - all routes require admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.get('/payments', getPayments);
router.get('/analytics', getAnalytics);

module.exports = router;
