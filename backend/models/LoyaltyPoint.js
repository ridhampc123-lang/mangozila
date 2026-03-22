const mongoose = require('mongoose');

const loyaltyPointSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    type: { type: String, enum: ['earned', 'redeemed', 'bonus'], required: true },
    points: { type: Number, required: true },
    description: String,
    balance: Number,
}, { timestamps: true });

module.exports = mongoose.model('LoyaltyPoint', loyaltyPointSchema);
