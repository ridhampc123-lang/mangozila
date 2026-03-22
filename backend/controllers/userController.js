const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

// Note: syncUser is no longer needed as customers shop as guests.
// Only Admin uses accounts now.
exports.syncUser = async (req, res) => {
    res.status(410).json({ message: 'Sync no longer supported. Customers are guests.' });
};

// GET profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT update profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, address, newsletterSubscribed } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, address, newsletterSubscribed },
            { new: true }
        );
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET all users (admin)
exports.getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 20, search } = req.query;
        const filter = {};
        if (search) filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } },
        ];
        const skip = (Number(page) - 1) * Number(limit);
        const [users, total] = await Promise.all([
            User.find(filter).sort('-createdAt').skip(skip).limit(Number(limit)),
            User.countDocuments(filter),
        ]);
        res.json({ users, total, pages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
