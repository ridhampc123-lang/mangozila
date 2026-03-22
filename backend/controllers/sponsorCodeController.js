const SponsorCode = require('../models/SponsorCode');
const Order = require('../models/Order');

// GET all sponsor codes (admin)
exports.getAllSponsorCodes = async (req, res) => {
    try {
        const { page = 1, limit = 20, search, active } = req.query;
        
        const filter = {};
        if (active === 'true') filter.isActive = true;
        if (active === 'false') filter.isActive = false;
        if (search) {
            filter.$or = [
                { code: { $regex: search, $options: 'i' } },
                { owner: { $regex: search, $options: 'i' } },
                { ownerEmail: { $regex: search, $options: 'i' } },
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);
        const [sponsorCodes, total] = await Promise.all([
            SponsorCode.find(filter)
                .sort('-createdAt')
                .skip(skip)
                .limit(Number(limit)),
            SponsorCode.countDocuments(filter),
        ]);

        res.json({ 
            sponsorCodes, 
            total, 
            pages: Math.ceil(total / limit),
            currentPage: Number(page)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET single sponsor code by ID (admin)
exports.getSponsorCodeById = async (req, res) => {
    try {
        const sponsorCode = await SponsorCode.findById(req.params.id);
        
        if (!sponsorCode) {
            return res.status(404).json({ message: 'Sponsor code not found' });
        }

        res.json(sponsorCode);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST validate sponsor code (public - for checkout)
exports.validateSponsorCode = async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({ message: 'Sponsor code is required' });
        }

        const sponsorCode = await SponsorCode.findOne({ 
            code: code.toUpperCase(),
            isActive: true 
        });

        if (!sponsorCode) {
            return res.status(404).json({ message: 'Invalid sponsor code' });
        }

        // Check validity period
        const now = new Date();
        if (sponsorCode.validFrom && now < sponsorCode.validFrom) {
            return res.status(400).json({ message: 'Sponsor code not yet active' });
        }
        if (sponsorCode.validUntil && now > sponsorCode.validUntil) {
            return res.status(400).json({ message: 'Sponsor code has expired' });
        }

        // Check usage limit
        if (sponsorCode.usageLimit && sponsorCode.totalUsage >= sponsorCode.usageLimit) {
            return res.status(400).json({ message: 'Sponsor code usage limit reached' });
        }

        res.json({ 
            valid: true, 
            code: sponsorCode.code,
            owner: sponsorCode.owner,
            commission: sponsorCode.commission,
            commissionType: sponsorCode.commissionType,
            message: `Sponsor code applied: ${sponsorCode.owner} will receive commission` 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST create sponsor code (admin)
exports.createSponsorCode = async (req, res) => {
    try {
        const { code, owner, ownerEmail, ownerPhone, commission, commissionType, usageLimit, validFrom, validUntil, description } = req.body;

        if (!code || !owner) {
            return res.status(400).json({ message: 'Code and owner are required' });
        }

        // Check if code already exists
        const existingCode = await SponsorCode.findOne({ code: code.toUpperCase() });
        if (existingCode) {
            return res.status(400).json({ message: 'Sponsor code already exists' });
        }

        const sponsorCode = await SponsorCode.create({
            code: code.toUpperCase(),
            owner,
            ownerEmail,
            ownerPhone,
            commission: commission || 5,
            commissionType: commissionType || 'percentage',
            usageLimit,
            validFrom,
            validUntil,
            description,
        });

        res.status(201).json({ 
            message: 'Sponsor code created successfully', 
            sponsorCode 
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// PUT update sponsor code (admin)
exports.updateSponsorCode = async (req, res) => {
    try {
        const { owner, ownerEmail, ownerPhone, commission, commissionType, usageLimit, validFrom, validUntil, description, isActive } = req.body;
        
        const update = {};
        if (owner !== undefined) update.owner = owner;
        if (ownerEmail !== undefined) update.ownerEmail = ownerEmail;
        if (ownerPhone !== undefined) update.ownerPhone = ownerPhone;
        if (commission !== undefined) update.commission = commission;
        if (commissionType !== undefined) update.commissionType = commissionType;
        if (usageLimit !== undefined) update.usageLimit = usageLimit;
        if (validFrom !== undefined) update.validFrom = validFrom;
        if (validUntil !== undefined) update.validUntil = validUntil;
        if (description !== undefined) update.description = description;
        if (isActive !== undefined) update.isActive = isActive;

        const sponsorCode = await SponsorCode.findByIdAndUpdate(
            req.params.id, 
            update, 
            { new: true }
        );

        if (!sponsorCode) {
            return res.status(404).json({ message: 'Sponsor code not found' });
        }

        res.json({ message: 'Sponsor code updated successfully', sponsorCode });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE sponsor code (admin)
exports.deleteSponsorCode = async (req, res) => {
    try {
        const sponsorCode = await SponsorCode.findByIdAndDelete(req.params.id);
        
        if (!sponsorCode) {
            return res.status(404).json({ message: 'Sponsor code not found' });
        }

        res.json({ message: 'Sponsor code deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET sponsor code statistics (admin)
exports.getSponsorCodeStats = async (req, res) => {
    try {
        const { id } = req.params;
        
        const sponsorCode = await SponsorCode.findById(id);
        if (!sponsorCode) {
            return res.status(404).json({ message: 'Sponsor code not found' });
        }

        // Get all orders using this sponsor code
        const orders = await Order.find({ 
            sponsorCode: sponsorCode.code 
        }).select('pricing.total createdAt status');

        const totalRevenue = orders.reduce((sum, order) => {
            if (order.status !== 'cancelled') {
                return sum + (order.pricing?.total || 0);
            }
            return sum;
        }, 0);

        const totalCommission = sponsorCode.commissionType === 'percentage'
            ? (totalRevenue * sponsorCode.commission) / 100
            : sponsorCode.commission * orders.length;

        res.json({
            code: sponsorCode.code,
            owner: sponsorCode.owner,
            totalUsage: sponsorCode.totalUsage,
            totalOrders: orders.length,
            totalRevenue,
            totalCommission,
            orders: orders.slice(0, 10), // Last 10 orders
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
