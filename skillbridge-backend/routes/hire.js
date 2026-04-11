// routes/hire.js — Hire form submission
const express = require('express');
const router  = express.Router();
const { body } = require('express-validator');

const { submitHireRequest, getHireRequests } = require('../controllers/hireController');
const { protect, authorize } = require('../middleware/auth');

const hireRules = [
  body('companyName').trim().notEmpty().withMessage('Company name is required'),
  body('contactName').trim().notEmpty().withMessage('Contact name is required'),
  body('contactEmail').isEmail().normalizeEmail().withMessage('Valid contact email is required'),
  body('projectTitle').trim().notEmpty().withMessage('Project title is required'),
  body('description').trim().isLength({ min: 20 }).withMessage('Description must be at least 20 characters')
];

router.post('/', hireRules, submitHireRequest);                        // POST /api/hire
router.get('/',  protect, authorize('admin'), getHireRequests);        // GET  /api/hire (admin)

module.exports = router;
