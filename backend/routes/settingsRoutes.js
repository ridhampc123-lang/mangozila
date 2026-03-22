const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const multer = require('multer');
const path = require('path');
const ctrl = require('../controllers/settingsController');

// Configure multer for settings file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/settings'),
    filename: (req, file, cb) => {
        const uniqueName = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp|ico|svg/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) return cb(null, true);
        cb(new Error('Only image files are allowed'));
    },
});

// Public route
router.get('/', ctrl.getSettings);

// Admin routes
router.get('/full', protect, adminOnly, ctrl.getFullSettings);
router.put('/', protect, adminOnly, upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'favicon', maxCount: 1 }
]), ctrl.updateSettings);
router.post('/reset', protect, adminOnly, ctrl.resetSettings);

module.exports = router;
