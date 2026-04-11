// controllers/guideController.js — Guides list, purchase, access check
const Guide    = require('../models/Guide');
const Purchase = require('../models/Purchase');
const User     = require('../models/User');

// ── GET /api/guides ───────────────────────────────────────────────
const getGuides = async (req, res, next) => {
  try {
    const guides = await Guide.find({ isActive: true }).sort({ isFeatured: -1, createdAt: 1 });
    res.json({ success: true, guides });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/guides/:key/purchase ───────────────────────────────
const purchaseGuide = async (req, res, next) => {
  try {
    const { key }  = req.params;
    const userId   = req.user._id;

    const guide = await Guide.findOne({ key });
    if (!guide) {
      return res.status(404).json({ success: false, message: 'Guide not found' });
    }

    // Prevent duplicate purchase
    const already = await Purchase.findOne({ user: userId, guide: key });
    if (already) {
      return res.status(400).json({ success: false, message: 'You already own this guide' });
    }

    // Create purchase record
    const purchase = await Purchase.create({ user: userId, guide: key, amount: guide.price });

    // Add key to user's purchases array
    await User.findByIdAndUpdate(userId, { $addToSet: { purchases: key } });

    // Bump purchase counter on guide
    await Guide.findByIdAndUpdate(guide._id, { $inc: { purchaseCount: 1 } });

    res.status(201).json({
      success:    true,
      message:    'Purchase successful!',
      paymentRef: purchase.paymentRef,
      guideKey:   key
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/guides/my-purchases ─────────────────────────────────
// Returns array of guide keys the logged-in user owns
const getMyPurchases = async (req, res, next) => {
  try {
    const purchases = await Purchase.find({ user: req.user._id }).sort({ createdAt: -1 });
    const keys      = purchases.map(p => p.guide);
    res.json({ success: true, purchases: keys });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/guides/:key/access ───────────────────────────────────
// Returns { hasAccess: true/false } — used by guide pages on load
const checkAccess = async (req, res, next) => {
  try {
    const purchase = await Purchase.findOne({ user: req.user._id, guide: req.params.key });
    res.json({ success: true, hasAccess: !!purchase });
  } catch (error) {
    next(error);
  }
};

module.exports = { getGuides, purchaseGuide, getMyPurchases, checkAccess };
