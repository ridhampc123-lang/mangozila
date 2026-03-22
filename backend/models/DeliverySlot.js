const mongoose = require('mongoose');

const deliverySlotSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    slot: { type: String, enum: ['morning', 'afternoon', 'evening'], required: true },
    label: String,
    timeRange: String,
    maxOrders: { type: Number, default: 50 },
    currentOrders: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
});

module.exports = mongoose.model('DeliverySlot', deliverySlotSchema);
