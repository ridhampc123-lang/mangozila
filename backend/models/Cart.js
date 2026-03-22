const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    mango: { type: mongoose.Schema.Types.ObjectId, ref: 'Mango', required: true },
    name: String,
    image: String,
    variety: String,
    boxSize: { type: String, enum: ['5kg', '10kg', '20kg'], required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
});

const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [cartItemSchema],
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Auto-update timestamp on item changes
cartSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Cart', cartSchema);
