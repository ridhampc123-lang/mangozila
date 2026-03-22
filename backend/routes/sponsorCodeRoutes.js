const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const ctrl = require('../controllers/sponsorCodeController');

// Public route - Validate sponsor code
router.post('/validate', ctrl.validateSponsorCode);

// Admin routes
router.get('/', protect, adminOnly, ctrl.getAllSponsorCodes);
router.get('/:id', protect, adminOnly, ctrl.getSponsorCodeById);
router.get('/:id/stats', protect, adminOnly, ctrl.getSponsorCodeStats);
router.post('/', protect, adminOnly, ctrl.createSponsorCode);
router.put('/:id', protect, adminOnly, ctrl.updateSponsorCode);
router.delete('/:id', protect, adminOnly, ctrl.deleteSponsorCode);

module.exports = router;
