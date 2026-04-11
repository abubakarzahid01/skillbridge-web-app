// controllers/hireController.js — Hire form submission
const { validationResult } = require('express-validator');
const HireRequest = require('../models/HireRequest');

// ── POST /api/hire ────────────────────────────────────────────────
const submitHireRequest = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const hire = await HireRequest.create({
      companyName:  req.body.companyName,
      contactName:  req.body.contactName,
      contactEmail: req.body.contactEmail,
      companySize:  req.body.companySize  || '',
      projectTitle: req.body.projectTitle,
      description:  req.body.description,
      skills:       req.body.skills       || [],
      budget:       req.body.budget       || '',
      timeline:     req.body.timeline     || '',
      workType:     req.body.workType     || 'remote',
      studentId:    req.body.studentId    || null
    });

    res.status(201).json({
      success:   true,
      message:   "Hire request submitted! We'll be in touch within 24 hours.",
      requestId: hire._id
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/hire — admin only ────────────────────────────────────
const getHireRequests = async (req, res, next) => {
  try {
    const requests = await HireRequest.find()
      .populate('studentId', 'name email avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: requests.length, requests });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitHireRequest, getHireRequests };
