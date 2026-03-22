const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const ctrl = require('../controllers/orderController');

router.post('/', optionalAuth, ctrl.createOrder);
router.get('/track/:orderId', ctrl.trackOrder);
router.put('/cancel/:orderId', optionalAuth, ctrl.cancelOrder);
router.get('/my', protect, ctrl.getMyOrders);
router.get('/', protect, adminOnly, ctrl.getAllOrders);
router.put('/:id/status', protect, adminOnly, ctrl.updateOrderStatus);

module.exports = router;
