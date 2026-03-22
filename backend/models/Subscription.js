const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mango: { type: mongoose.Schema.Types.ObjectId, ref: 'Mango', required: true },
    boxSize: { type: String, enum: ['5kg', '10kg', '20kg'] },
    frequency: { type: String, enum: ['weekly', 'biweekly', 'monthly'], default: 'weekly' },
    deliveryAddress: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        coordinates: { lat: Number, lng: Number },
    },
    deliverySlot: { type: String, enum: ['morning', 'afternoon', 'evening'] },
    startDate: { type: Date, required: true },
    endDate: Date,
    nextDeliveryDate: Date,
    status: { type: String, enum: ['active', 'paused', 'cancelled'], default: 'active' },
    pricePerDelivery: Number,
    totalDeliveries: { type: Number, default: 0 },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
