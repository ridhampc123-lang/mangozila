const Review = require('../models/Review');
const Mango = require('../models/Mango');
const User = require('../models/User');

exports.createReview = async (req, res) => {
    try {
        const { mangoId, rating, title, comment, guestName } = req.body;
        let userId = null;
        if (req.user) {
            const user = await User.findOne({ firebaseUid: req.user.uid });
            userId = user?._id;
        }
        const review = await Review.create({
            mango: mangoId, user: userId, guestName, rating, title, comment, isApproved: false,
        });
        res.status(201).json(review);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getMangoReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ mango: req.params.mangoId, isApproved: true })
            .populate('user', 'name avatar').sort('-createdAt');
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllReviews = async (req, res) => {
    try {
        const { approved } = req.query;
        const filter = {};
        if (approved !== undefined) filter.isApproved = approved === 'true';
        const reviews = await Review.find(filter).populate('mango', 'name').populate('user', 'name').sort('-createdAt');
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.approveReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
        if (!review) return res.status(404).json({ message: 'Review not found' });

        // Update mango rating
        const allReviews = await Review.find({ mango: review.mango, isApproved: true });
        const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
        await Mango.findByIdAndUpdate(review.mango, { rating: parseFloat(avg.toFixed(1)), totalReviews: allReviews.length });

        res.json(review);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.json({ message: 'Review deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
