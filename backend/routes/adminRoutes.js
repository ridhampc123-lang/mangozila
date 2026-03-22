const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const { upload } = require('../config/cloudinary');
const ctrl = require('../controllers/adminController');

// Dashboard
router.get('/dashboard', protect, adminOnly, ctrl.getDashboardStats);

// Banners
router.get('/banners', ctrl.getBanners);
router.get('/banners/all', protect, adminOnly, ctrl.getAllBanners);
router.post('/banners', protect, adminOnly, upload.single('image'), ctrl.createBanner);
router.put('/banners/:id', protect, adminOnly, upload.single('image'), ctrl.updateBanner);
router.delete('/banners/:id', protect, adminOnly, ctrl.deleteBanner);

module.exports = router;
