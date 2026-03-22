const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const { upload } = require('../config/cloudinary');
const ctrl = require('../controllers/mangoController');

router.get('/', ctrl.getMangoes);
router.get('/:slug', ctrl.getMangoBySlug);
router.post('/', protect, adminOnly, upload.array('images', 6), ctrl.createMango);
router.put('/:id', protect, adminOnly, upload.array('images', 6), ctrl.updateMango);
router.delete('/:id', protect, adminOnly, ctrl.deleteMango);
router.delete('/:id/image', protect, adminOnly, ctrl.deleteMangoImage);

module.exports = router;
