const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const ctrl = require('../controllers/contactController');

// Public route - Submit contact form
router.post('/', ctrl.createContact);

// Admin routes
router.get('/', protect, adminOnly, ctrl.getAllContacts);
router.get('/:id', protect, adminOnly, ctrl.getContactById);
router.put('/:id', protect, adminOnly, ctrl.updateContact);
router.delete('/:id', protect, adminOnly, ctrl.deleteContact);

module.exports = router;
