const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    label: String,
    title: String,
    subtitle: String,
    image: { type: String, required: true },
    link: String,
    buttonText: { type: String, default: 'Shop Now' },
    position: { type: String, enum: ['hero', 'middle', 'bottom'], default: 'hero' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);
