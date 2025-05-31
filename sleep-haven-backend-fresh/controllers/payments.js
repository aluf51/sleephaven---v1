const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');

// @desc    Process payment
// @route   POST /api/payments/process
// @access  Private
exports.processPayment = async (req, res) => {
  try {
    const { amount, paymentMethodId, description } = req.body;

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      description
    });

    // Create payment record
    const payment = await Payment.create({
      user: req.user.id,
      amount,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
      description
    });

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get payment status
// @route   GET /api/payments/status/:id
// @access  Private
exports.getPaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }

    // Make sure user owns the payment
    if (payment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this payment'
      });
    }

    // Get latest status from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(payment.paymentIntentId);
    
    // Update payment status
    payment.status = paymentIntent.status;
    await payment.save();

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
