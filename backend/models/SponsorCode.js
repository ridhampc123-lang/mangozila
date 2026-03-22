const mongoose = require('mongoose');

const sponsorCodeSchema = new mongoose.Schema({
    code: { 
        type: String, 
        required: true, 
        unique: true, 
        uppercase: true,
        trim: true 
    },
    owner: { 
        type: String, 
        required: true,
        trim: true 
    },
    ownerEmail: { 
        type: String, 
        lowercase: true 
    },
    ownerPhone: { 
        type: String 
    },
    commission: { 
        type: Number, 
        required: true,
        min: 0,
        max: 100,
        default: 5 
    }, // Commission percentage
    commissionType: {
        type: String,
        enum: ['percentage', 'fixed'],
        default: 'percentage'
    },
    totalUsage: { 
        type: Number, 
        default: 0 
    },
    totalRevenue: { 
        type: Number, 
        default: 0 
    },
    usageLimit: { 
        type: Number 
    }, // Optional max usage
    isActive: { 
        type: Boolean, 
        default: true 
    },
    validFrom: { 
        type: Date 
    },
    validUntil: { 
        type: Date 
    },
    description: { 
        type: String 
    },
    usedBy: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],
}, { timestamps: true });

module.exports = mongoose.model('SponsorCode', sponsorCodeSchema);
