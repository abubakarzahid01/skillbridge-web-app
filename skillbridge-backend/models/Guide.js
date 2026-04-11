// models/Guide.js — Premium guide schema
const mongoose = require('mongoose');

const GuideSchema = new mongoose.Schema(
  {
    key:           { type: String, required: true, unique: true }, // 'guide-cv-optimization'
    title:         { type: String, required: true },
    emoji:         { type: String, default: '📄' },
    description:   { type: String, required: true },
    price:         { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    features:      [{ type: String }],
    isFeatured:    { type: Boolean, default: false },
    isActive:      { type: Boolean, default: true },
    purchaseCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Guide', GuideSchema);
