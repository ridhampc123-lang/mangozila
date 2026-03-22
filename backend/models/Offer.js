const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true,
        trim: true 
    },
    slug: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true 
    },
    description: { 
        type: String,
        required: true 
    },
    discount: { 
        type: Number,
        required: true,
        min: 0 
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        default: 'percentage'
    },
    product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Mango'
    }, // Optional - specific product offer
    category: { 
        type: String 
    }, // Optional - category-wide offer
    image: { 
        type: String 
    },
    badge: { 
        type: String,
        default: 'Special Offer' 
    }, // e.g., "Limited Time", "Hot Deal"
    startDate: { 
        type: Date,
        required: true 
    },
    endDate: { 
        type: Date,
        required: true 
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
    isFeatured: { 
        type: Boolean, 
        default: false 
    },
    order: { 
        type: Number, 
        default: 0 
    }, // For display ordering
    terms: { 
        type: String 
    },
}, { timestamps: true });

// Virtual to check if offer is currently valid
offerSchema.virtual('isValid').get(function() {
    const now = new Date();
    return this.isActive && 
           this.startDate <= now && 
           this.endDate >= now;
});

// Ensure virtuals are included in JSON
offerSchema.set('toJSON', { virtuals: true });
offerSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Offer', offerSchema);
