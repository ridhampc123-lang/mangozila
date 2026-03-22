const User = require('../models/User');

const adminOnly = async (req, res, next) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
        const user = await User.findOne({ firebaseUid: req.user.uid });
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        req.dbUser = user;
        next();
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { adminOnly };
