// controllers/dashboardController.js — Dashboard data for logged-in user
const Purchase    = require('../models/Purchase');
const HireRequest = require('../models/HireRequest');

// ── GET /api/dashboard ────────────────────────────────────────────
const getDashboard = async (req, res, next) => {
  try {
    const user = req.user;

    // All guide purchases for this user
    const purchases = await Purchase.find({ user: user._id }).sort({ createdAt: -1 });

    // Hire requests sent to this student (by email match)
    const hireRequests = await HireRequest.find({ studentId: user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      user: {
        id:           user._id,
        name:         user.name,
        email:        user.email,
        role:         user.role,
        avatar:       user.avatar,
        university:   user.university,
        bio:          user.bio,
        skills:       user.skills,
        rate:         user.rate,
        rating:       user.rating,
        reviewCount:  user.reviewCount,
        projectsDone: user.projectsDone,
        isAvailable:  user.isAvailable,
        purchases:    user.purchases,
        linkedinUrl:  user.linkedinUrl,
        portfolioUrl: user.portfolioUrl,
        createdAt:    user.createdAt
      },
      stats: {
        totalPurchases: purchases.length,
        projectsDone:   user.projectsDone,
        rating:         user.rating,
        reviewCount:    user.reviewCount
      },
      purchases:    purchases,
      hireRequests: hireRequests
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard };
