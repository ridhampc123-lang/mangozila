const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const ctrl = require('../controllers/bulkOrderController');

// Public route - Submit bulk order inquiry
router.post('/', ctrl.createBulkOrder);

// Admin routes
router.get('/', protect, adminOnly, ctrl.getAllBulkOrders);
router.get('/:id', protect, adminOnly, ctrl.getBulkOrderById);
router.put('/:id', protect, adminOnly, ctrl.updateBulkOrder);
router.delete('/:id', protect, adminOnly, ctrl.deleteBulkOrder);

module.exports = router;
