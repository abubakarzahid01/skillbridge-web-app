// controllers/studentController.js — Explore page: list + single student
const User = require('../models/User');

// ── GET /api/students ─────────────────────────────────────────────
// Supports query params: category, university, workType, budget, search
const getStudents = async (req, res, next) => {
  try {
    const { category, university, workType, budget, search } = req.query;

    const filter = { role: 'student', isAvailable: true };

    if (category)   filter.category   = category;
    if (workType)   filter.workType   = workType;
    if (university) filter.university = new RegExp(university, 'i');

    if (search) {
      filter.$or = [
        { name:   new RegExp(search, 'i') },
        { bio:    new RegExp(search, 'i') },
        { skills: { $elemMatch: { $regex: search, $options: 'i' } } }
      ];
    }

    // Budget maps to rateValue ranges
    if (budget === 'low')  filter.rateValue = { $lte: 30 };
    if (budget === 'mid')  filter.rateValue = { $gte: 31, $lte: 45 };
    if (budget === 'high') filter.rateValue = { $gte: 46 };

    const students = await User.find(filter)
      .select('name bio avatar skills rate rating reviewCount university category workType isAvailable projectsDone')
      .sort({ rating: -1 })
      .limit(50);

    res.json({ success: true, count: students.length, students });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/students/:id ─────────────────────────────────────────
const getStudentById = async (req, res, next) => {
  try {
    const student = await User.findOne({ _id: req.params.id, role: 'student' })
      .select('-password -googleId -purchases');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.json({ success: true, student });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStudents, getStudentById };
