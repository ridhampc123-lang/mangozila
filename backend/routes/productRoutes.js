// Product routes - Alias for Mango routes
// This provides /api/products endpoint as an alternative to /api/mangoes
// Maintains compatibility with generic e-commerce terminology

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const multer = require('multer');
const path = require('path');
const ctrl = require('../controllers/mangoController');

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/mangoes'),
    filename: (req, file, cb) => {
        const uniqueName = `mango-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) return cb(null, true);
        cb(new Error('Only image files (JPEG, PNG, WebP) are allowed'));
    },
});

// Public routes
router.get('/', ctrl.getMangoes);
router.get('/:slug', ctrl.getMangoBySlug);

// Admin routes
router.post('/', protect, adminOnly, upload.array('images', 5), ctrl.createMango);
router.put('/:id', protect, adminOnly, upload.array('images', 5), ctrl.updateMango);
router.delete('/:id', protect, adminOnly, ctrl.deleteMango);
router.delete('/:id/image', protect, adminOnly, ctrl.deleteMangoImage);

module.exports = router;
