const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const ctrl = require('../controllers/subscriptionController');

router.post('/', protect, ctrl.createSubscription);
router.get('/my', protect, ctrl.getMySubscriptions);
router.put('/:id/status', protect, ctrl.updateSubscriptionStatus);
router.get('/', protect, adminOnly, ctrl.getAllSubscriptions);

module.exports = router;
