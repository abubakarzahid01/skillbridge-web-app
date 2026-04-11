// routes/students.js — Explore page student listings
const express = require('express');
const router  = express.Router();

const { getStudents, getStudentById } = require('../controllers/studentController');

router.get('/',    getStudents);       // GET /api/students
router.get('/:id', getStudentById);    // GET /api/students/:id

module.exports = router;
