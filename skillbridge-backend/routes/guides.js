// routes/guides.js — Guide listing, purchase, access
const express = require('express');
const router  = express.Router();

const { getGuides, purchaseGuide, getMyPurchases, checkAccess } = require('../controllers/guideController');
const { protect } = require('../middleware/auth');

router.get('/',                   getGuides);                   // GET  /api/guides
router.get('/my-purchases',       protect, getMyPurchases);     // GET  /api/guides/my-purchases
router.get('/:key/access',        protect, checkAccess);        // GET  /api/guides/:key/access
router.post('/:key/purchase',     protect, purchaseGuide);      // POST /api/guides/:key/purchase

module.exports = router;
