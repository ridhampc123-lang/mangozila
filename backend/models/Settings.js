const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    // Site Information
    siteName: { 
        type: String, 
        default: 'MangoZila' 
    },
    tagline: { 
        type: String, 
        default: 'Premium Farm-Fresh Mangoes Delivered' 
    },
    logo: { 
        type: String 
    },
    favicon: { 
        type: String 
    },
    
    // Contact Information
    supportEmail: { 
        type: String, 
        default: 'support@mangozila.com' 
    },
    supportPhone: { 
        type: String 
    },
    whatsappNumber: { 
        type: String 
    },
    
    // Business Hours
    businessHours: { 
        type: String,
        default: 'Mon-Sat: 9 AM - 6 PM' 
    },
    
    // Delivery Settings
    deliveryCharge: { 
        type: Number, 
        default: 49 
    },
    freeDeliveryAmount: { 
        type: Number, 
        default: 500 
    },
    estimatedDeliveryDays: { 
        type: String,
        default: '2-3 days' 
    },
    
    // Social Media
    socialMedia: {
        facebook: String,
        instagram: String,
        twitter: String,
        youtube: String,
        linkedin: String,
    },
    
    // Address
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: { type: String, default: 'India' },
    },
    
    // SEO
    metaTitle: { 
        type: String 
    },
    metaDescription: { 
        type: String 
    },
    metaKeywords: [String],
    
    // Features
    enableCOD: { 
        type: Boolean, 
        default: true 
    },
    enableOnlinePayment: { 
        type: Boolean, 
        default: true 
    },
    enableLoyaltyPoints: { 
        type: Boolean, 
        default: true 
    },
    enableReferrals: { 
        type: Boolean, 
        default: true 
    },
    
    // Payment Gateway
    razorpayEnabled: { 
        type: Boolean, 
        default: false 
    },
    razorpayKeyId: { 
        type: String 
    },
    
    // Notifications
    emailNotifications: { 
        type: Boolean, 
        default: true 
    },
    smsNotifications: { 
        type: Boolean, 
        default: false 
    },
    
    // Maintenance
    maintenanceMode: { 
        type: Boolean, 
        default: false 
    },
    maintenanceMessage: { 
        type: String,
        default: 'We are currently under maintenance. Please check back soon.' 
    },
    
    // Custom Sections
    aboutUs: { 
        type: String 
    },
    termsAndConditions: { 
        type: String 
    },
    privacyPolicy: { 
        type: String 
    },
    returnPolicy: { 
        type: String 
    },
}, { timestamps: true });

// Ensure only one settings document exists
settingsSchema.statics.getSiteSettings = async function() {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({});
    }
    return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);
