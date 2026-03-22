const Offer = require('../models/Offer');
const slugify = require('slugify');
const fs = require('fs');

const formatImagePath = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const baseUrl = process.env.API_URL || `http://localhost:${process.env.PORT || 5000}`;
    return `${baseUrl}/${path.replace(/\\/g, '/')}`;
};

// GET all offers (public - only active and valid)
exports.getActiveOffers = async (req, res) => {
    try {
        const now = new Date();
        
        const offers = await Offer.find({
            isActive: true,
            startDate: { $lte: now },
            endDate: { $gte: now },
        })
        .populate('product', 'name slug images')
        .sort({ isFeatured: -1, order: 1, startDate: -1 });

        const formattedOffers = offers.map(offer => ({
            ...offer.toObject(),
            image: formatImagePath(offer.image),
        }));

        res.json(formattedOffers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET all offers (admin - including inactive)
exports.getAllOffers = async (req, res) => {
    try {
        const { page = 1, limit = 20, active, featured } = req.query;
        
        const filter = {};
        if (active === 'true') filter.isActive = true;
        if (active === 'false') filter.isActive = false;
        if (featured === 'true') filter.isFeatured = true;

        const skip = (Number(page) - 1) * Number(limit);
        const [offers, total] = await Promise.all([
            Offer.find(filter)
                .populate('product', 'name slug images')
                .sort('-createdAt')
                .skip(skip)
                .limit(Number(limit)),
            Offer.countDocuments(filter),
        ]);

        const formattedOffers = offers.map(offer => ({
            ...offer.toObject(),
            image: formatImagePath(offer.image),
        }));

        res.json({ 
            offers: formattedOffers, 
            total, 
            pages: Math.ceil(total / limit),
            currentPage: Number(page)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET single offer by slug (public)
exports.getOfferBySlug = async (req, res) => {
    try {
        const offer = await Offer.findOne({ slug: req.params.slug })
            .populate('product', 'name slug images boxOptions');
        
        if (!offer) {
            return res.status(404).json({ message: 'Offer not found' });
        }

        const formattedOffer = {
            ...offer.toObject(),
            image: formatImagePath(offer.image),
        };

        res.json(formattedOffer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET single offer by ID (admin)
exports.getOfferById = async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id)
            .populate('product', 'name slug images');
        
        if (!offer) {
            return res.status(404).json({ message: 'Offer not found' });
        }

        const formattedOffer = {
            ...offer.toObject(),
            image: formatImagePath(offer.image),
        };

        res.json(formattedOffer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST create offer (admin)
exports.createOffer = async (req, res) => {
    try {
        const { title, description, discount, discountType, product, category, badge, startDate, endDate, isFeatured, order, terms } = req.body;

        if (!title || !description || !discount || !startDate || !endDate) {
            return res.status(400).json({ message: 'Title, description, discount, start date, and end date are required' });
        }

        // Generate slug
        const slug = slugify(title, { lower: true, strict: true }) + '-' + Date.now();

        // Handle image upload
        const image = req.file ? formatImagePath(req.file.path) : null;

        const offer = await Offer.create({
            title,
            slug,
            description,
            discount,
            discountType: discountType || 'percentage',
            product: product || null,
            category,
            badge,
            image,
            startDate,
            endDate,
            isFeatured: isFeatured === 'true',
            order: order || 0,
            terms,
        });

        res.status(201).json({ message: 'Offer created successfully', offer });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// PUT update offer (admin)
exports.updateOffer = async (req, res) => {
    try {
        const { title, description, discount, discountType, product, category, badge, startDate, endDate, isFeatured, order, terms, isActive } = req.body;
        
        const update = {};
        if (title) {
            update.title = title;
            update.slug = slugify(title, { lower: true, strict: true });
        }
        if (description !== undefined) update.description = description;
        if (discount !== undefined) update.discount = discount;
        if (discountType !== undefined) update.discountType = discountType;
        if (product !== undefined) update.product = product;
        if (category !== undefined) update.category = category;
        if (badge !== undefined) update.badge = badge;
        if (startDate !== undefined) update.startDate = startDate;
        if (endDate !== undefined) update.endDate = endDate;
        if (isFeatured !== undefined) update.isFeatured = isFeatured === 'true';
        if (order !== undefined) update.order = order;
        if (terms !== undefined) update.terms = terms;
        if (isActive !== undefined) update.isActive = isActive === 'true';
        if (req.file) update.image = formatImagePath(req.file.path);

        const offer = await Offer.findByIdAndUpdate(req.params.id, update, { new: true });
        
        if (!offer) {
            return res.status(404).json({ message: 'Offer not found' });
        }

        res.json({ message: 'Offer updated successfully', offer });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE offer (admin)
exports.deleteOffer = async (req, res) => {
    try {
        const offer = await Offer.findByIdAndDelete(req.params.id);
        
        if (!offer) {
            return res.status(404).json({ message: 'Offer not found' });
        }

        // Delete image file if it exists locally
        if (offer.image && offer.image.includes('/uploads/')) {
            const localPath = offer.image.split('/uploads/')[1];
            const fullPath = `uploads/${localPath}`;
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
        }

        res.json({ message: 'Offer deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
