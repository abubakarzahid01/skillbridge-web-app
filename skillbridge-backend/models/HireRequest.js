// models/HireRequest.js — Hire form submissions from companies
const mongoose = require('mongoose');

const HireRequestSchema = new mongoose.Schema(
  {
    // ── Who is hiring ─────────────────────────────────────────────
    companyName:  { type: String, required: true, trim: true },
    contactName:  { type: String, required: true, trim: true },
    contactEmail: { type: String, required: true, lowercase: true, trim: true },
    companySize:  { type: String, default: '' },

    // ── What they need ────────────────────────────────────────────
    projectTitle: { type: String, required: true, trim: true },
    description:  { type: String, required: true },
    skills:       [{ type: String }],
    budget:       { type: String, default: '' },
    timeline:     { type: String, default: '' },
    workType:     { type: String, default: 'remote' },

    // ── Which student (optional) ──────────────────────────────────
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    // ── Status ────────────────────────────────────────────────────
    status: {
      type:    String,
      enum:    ['pending', 'reviewed', 'accepted', 'rejected'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('HireRequest', HireRequestSchema);
