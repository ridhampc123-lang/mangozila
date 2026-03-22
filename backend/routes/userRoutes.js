const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const ctrl = require('../controllers/userController');

router.post('/sync', protect, ctrl.syncUser);
router.get('/profile', protect, ctrl.getProfile);
router.put('/profile', protect, ctrl.updateProfile);
router.get('/', protect, adminOnly, ctrl.getAllUsers);

module.exports = router;
