const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, sparse: true, lowercase: true, default: '' },
    phone: { type: String, default: '' },
    password: { type: String, select: false }, // admin only
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
    },
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    loyaltyPoints: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
