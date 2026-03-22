const Settings = require('../models/Settings');

// GET site settings (public)
exports.getSettings = async (req, res) => {
    try {
        const settings = await Settings.getSiteSettings();
        
        // Remove sensitive data for public endpoint
        const publicSettings = {
            siteName: settings.siteName,
            tagline: settings.tagline,
            logo: settings.logo,
            favicon: settings.favicon,
            supportEmail: settings.supportEmail,
            supportPhone: settings.supportPhone,
            whatsappNumber: settings.whatsappNumber,
            businessHours: settings.businessHours,
            deliveryCharge: settings.deliveryCharge,
            freeDeliveryAmount: settings.freeDeliveryAmount,
            estimatedDeliveryDays: settings.estimatedDeliveryDays,
            socialMedia: settings.socialMedia,
            address: settings.address,
            metaTitle: settings.metaTitle,
            metaDescription: settings.metaDescription,
            metaKeywords: settings.metaKeywords,
            enableCOD: settings.enableCOD,
            enableOnlinePayment: settings.enableOnlinePayment,
            maintenanceMode: settings.maintenanceMode,
            maintenanceMessage: settings.maintenanceMessage,
            aboutUs: settings.aboutUs,
            termsAndConditions: settings.termsAndConditions,
            privacyPolicy: settings.privacyPolicy,
            returnPolicy: settings.returnPolicy,
        };

        res.json(publicSettings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET full settings (admin)
exports.getFullSettings = async (req, res) => {
    try {
        const settings = await Settings.getSiteSettings();
        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT update settings (admin)
exports.updateSettings = async (req, res) => {
    try {
        let settings = await Settings.getSiteSettings();
        
        // Update all provided fields
        Object.keys(req.body).forEach(key => {
            if (req.body[key] !== undefined) {
                settings[key] = req.body[key];
            }
        });

        // Handle file uploads
        if (req.files) {
            if (req.files.logo) {
                const baseUrl = process.env.API_URL || `http://localhost:${process.env.PORT || 5000}`;
                settings.logo = `${baseUrl}/${req.files.logo[0].path.replace(/\\/g, '/')}`;
            }
            if (req.files.favicon) {
                const baseUrl = process.env.API_URL || `http://localhost:${process.env.PORT || 5000}`;
                settings.favicon = `${baseUrl}/${req.files.favicon[0].path.replace(/\\/g, '/')}`;
            }
        }

        await settings.save();

        res.json({ message: 'Settings updated successfully', settings });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// POST reset settings to default (admin)
exports.resetSettings = async (req, res) => {
    try {
        await Settings.deleteMany({});
        const settings = await Settings.getSiteSettings();
        
        res.json({ message: 'Settings reset to default', settings });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
