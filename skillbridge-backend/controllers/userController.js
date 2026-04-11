// controllers/userController.js — Profile read + update
const { validationResult } = require('express-validator');
const User = require('../models/User');

// ── GET /api/users/profile ────────────────────────────────────────
const getProfile = (req, res) => {
  res.json({ success: true, user: req.user });
};

// ── PUT /api/users/profile ────────────────────────────────────────
const updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    // Only allow these fields to be updated
    const allowed = [
      'name', 'bio', 'university', 'skills', 'rate', 'rateValue',
      'category', 'workType', 'isAvailable', 'linkedinUrl', 'portfolioUrl', 'avatar'
    ];

    const updates = {};
    allowed.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({ success: true, message: 'Profile updated', user });
  } catch (error) {
    next(error);
  }
};

// ── PUT /api/users/password ───────────────────────────────────────
const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user._id).select('+password');

    // If user has a password (not Google-only account), verify current one
    if (user.password) {
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Current password is incorrect' });
      }
    }

    user.password = newPassword;
    await user.save(); // pre-save hook will hash it

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, updatePassword };
