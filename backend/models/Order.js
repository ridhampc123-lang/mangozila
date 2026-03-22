const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    mango: { type: mongoose.Schema.Types.ObjectId, ref: 'Mango', required: true },
    name: String,
    image: String,
    boxSize: { type: String, enum: ['5kg', '10kg', '20kg'] },
    price: Number,
    quantity: { type: Number, default: 1 },
});

const orderSchema = new mongoose.Schema({
    orderId: { type: String, unique: true, required: true },

    // Logged user or guest
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    isGuest: { type: Boolean, default: false },

    customerInfo: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true }, // Format: 10 digits, starts with 6,7,8,9
    },

    deliveryAddress: {
        fullAddress: { type: String, required: true },
        city: { type: String, required: true },
        pincode: { type: String, required: true },
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    },

    items: [orderItemSchema],

    pricing: {
        subtotal: Number,
        discount: Number,
        deliveryCharge: Number,
        loyaltyDiscount: Number,
        total: Number,
    },

    couponCode: String,
    couponDiscount: Number,
    loyaltyPointsUsed: Number,
    loyaltyPointsEarned: Number,
    referralCode: String,

    deliverySlot: {
        date: Date,
        slot: { type: String, enum: ['morning', 'afternoon', 'evening'] },
    },

    status: {
        type: String,
        enum: ['placed', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
        default: 'placed',
    },

    statusHistory: [
        {
            status: String,
            timestamp: { type: Date, default: Date.now },
            note: String,
        },
    ],

    paymentMethod: { type: String, default: 'cod' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },

    invoicePath: String,
    notes: String,
    isPreBook: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
