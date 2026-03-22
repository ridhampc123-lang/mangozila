const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const ctrl = require('../controllers/reviewController');

router.post('/', optionalAuth, ctrl.createReview);
router.get('/mango/:mangoId', ctrl.getMangoReviews);
router.get('/', protect, adminOnly, ctrl.getAllReviews);
router.put('/:id/approve', protect, adminOnly, ctrl.approveReview);
router.delete('/:id', protect, adminOnly, ctrl.deleteReview);

module.exports = router;
