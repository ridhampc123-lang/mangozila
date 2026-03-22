const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const ctrl = require('../controllers/couponController');

router.post('/validate', ctrl.validateCoupon);
router.get('/', protect, adminOnly, ctrl.getCoupons);
router.post('/', protect, adminOnly, ctrl.createCoupon);
router.put('/:id', protect, adminOnly, ctrl.updateCoupon);
router.delete('/:id', protect, adminOnly, ctrl.deleteCoupon);

module.exports = router;
