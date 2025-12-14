const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  used: {
    type: Number,
    default: 0
  },
  usagePercentage: {
    type: Number,
    default: 0
  },
  period: {
    type: String,
    required: true,
    enum: ['monthly']
  },
  type: {
    type: String,
    required: true,
    enum: ['expense']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Budget', BudgetSchema);
