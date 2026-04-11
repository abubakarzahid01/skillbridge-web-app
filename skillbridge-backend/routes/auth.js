// routes/auth.js — Authentication routes
const express  = require('express');
const passport = require('passport');
const { body } = require('express-validator');
const router   = express.Router();

const { signup, login, getMe, googleCallback } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// ── Validation rules ──────────────────────────────────────────────
const signupRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginRules = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// ── Routes ────────────────────────────────────────────────────────
router.post('/signup', signupRules, signup);   // POST /api/auth/signup
router.post('/login',  loginRules,  login);    // POST /api/auth/login
router.get('/me',      protect,     getMe);    // GET  /api/auth/me  (protected)

// Google OAuth — step 1: redirect user to Google
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// Google OAuth — step 2: Google redirects back here with profile
router.get('/google/callback',
  passport.authenticate('google', {
    session:         false,
    failureRedirect: `${process.env.FRONTEND_URL}/login.html?error=google_failed`
  }),
  googleCallback
);

module.exports = router;
