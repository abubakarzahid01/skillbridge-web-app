// routes/dashboard.js — Dashboard data (protected)
const express = require('express');
const router  = express.Router();

const { getDashboard } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getDashboard);    // GET /api/dashboard

module.exports = router;
