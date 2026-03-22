const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/cartController');

// All cart routes require authentication
router.get('/', protect, ctrl.getCart);
router.post('/add', protect, ctrl.addToCart);
router.put('/update', protect, ctrl.updateCartItem);
router.delete('/remove', protect, ctrl.removeFromCart);
router.delete('/clear', protect, ctrl.clearCart);

module.exports = router;
