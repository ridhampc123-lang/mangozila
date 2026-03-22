const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const multer = require('multer');
const path = require('path');
const ctrl = require('../controllers/blogController');

// Configure multer for blog image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/blogs'),
    filename: (req, file, cb) => {
        const uniqueName = `blog-${Date.now()}${path.extname(file.originalname)}`;
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
router.get('/', ctrl.getBlogs);
router.get('/slug/:slug', ctrl.getBlogBySlug);

// Admin routes
router.post('/', protect, adminOnly, upload.single('image'), ctrl.createBlog);
router.get('/:id', protect, adminOnly, ctrl.getBlogById);
router.put('/:id', protect, adminOnly, upload.single('image'), ctrl.updateBlog);
router.delete('/:id', protect, adminOnly, ctrl.deleteBlog);

module.exports = router;
