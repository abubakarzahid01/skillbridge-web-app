// models/Purchase.js — Records every guide purchase
const mongoose = require('mongoose');

const PurchaseSchema = new mongoose.Schema(
  {
    user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    guide:      { type: String, required: true },  // guide key string
    amount:     { type: Number, required: true },
    paymentRef: {
      type:    String,
      default: () => 'SB-' + Math.random().toString(36).substr(2, 7).toUpperCase()
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Purchase', PurchaseSchema);
