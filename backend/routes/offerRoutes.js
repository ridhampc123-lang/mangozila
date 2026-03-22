const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const multer = require('multer');
const path = require('path');
const ctrl = require('../controllers/offerController');

// Configure multer for offer image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/offers'),
    filename: (req, file, cb) => {
        const uniqueName = `offer-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) return cb(null, true);
        cb(new Error('Only image files are allowed'));
    },
});

// Public routes
router.get('/active', ctrl.getActiveOffers);
router.get('/slug/:slug', ctrl.getOfferBySlug);

// Admin routes
router.get('/', protect, adminOnly, ctrl.getAllOffers);
router.get('/:id', protect, adminOnly, ctrl.getOfferById);
router.post('/', protect, adminOnly, upload.single('image'), ctrl.createOffer);
router.put('/:id', protect, adminOnly, upload.single('image'), ctrl.updateOffer);
router.delete('/:id', protect, adminOnly, ctrl.deleteOffer);

module.exports = router;
