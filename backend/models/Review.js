const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    mango: { type: mongoose.Schema.Types.ObjectId, ref: 'Mango', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    guestName: String,
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true },
    comment: { type: String, required: true },
    images: [String],
    isApproved: { type: Boolean, default: false },
    isVerifiedPurchase: { type: Boolean, default: false },
    helpfulCount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
