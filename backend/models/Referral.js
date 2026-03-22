const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
    referrer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    referee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    refereePhone: String,
    referralCode: { type: String, required: true },
    isUsed: { type: Boolean, default: false },
    rewardPoints: { type: Number, default: 100 },
    rewardGiven: { type: Boolean, default: false },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
}, { timestamps: true });

module.exports = mongoose.model('Referral', referralSchema);
