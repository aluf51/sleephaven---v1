const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Please add payment amount']
  },
  paymentIntentId: {
    type: String,
    required: [true, 'Please add payment intent ID']
  },
  status: {
    type: String,
    enum: ['succeeded', 'processing', 'requires_payment_method', 'requires_confirmation', 'requires_action', 'canceled'],
    default: 'processing'
  },
  description: {
    type: String,
    required: [true, 'Please add payment description']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Payment', PaymentSchema);
