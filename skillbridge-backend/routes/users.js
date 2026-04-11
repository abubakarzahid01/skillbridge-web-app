// routes/users.js — Profile management
const express = require('express');
const router  = express.Router();

const { getProfile, updateProfile, updatePassword } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { body } = require('express-validator');

const updatePasswordRules = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];

router.get('/profile',  protect, getProfile);           // GET  /api/users/profile
router.put('/profile',  protect, updateProfile);        // PUT  /api/users/profile
router.put('/password', protect, updatePasswordRules, updatePassword); // PUT /api/users/password

module.exports = router;
