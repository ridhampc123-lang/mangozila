const mongoose = require('mongoose');

const mangoSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    variety: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    farmLocation: { type: String, required: true },
    harvestDetails: {
        harvestDate: Date,
        season: String,
        harvestYear: Number,
    },
    boxOptions: [
        {
            size: { type: String, enum: ['5kg', '10kg', '20kg'] },
            price: { type: Number, required: true },
            originalPrice: Number,
            stock: { type: Number, default: 0 },
            sku: String,
        },
    ],
    tags: [String],
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isPreBookable: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    category: { type: String, default: 'mango' },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Mango', mangoSchema);
