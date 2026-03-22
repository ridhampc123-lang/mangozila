const express = require('express');
const router = express.Router();
const { register, login, adminLogin, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Customer auth
router.post('/register', register);
router.post('/login', login);

// Admin auth
router.post('/admin-login', adminLogin);

// Profile
router.get('/me', protect, getMe);

module.exports = router;
