const Mango = require('../models/Mango');
const slugify = require('slugify');
const { cloudinary } = require('../config/cloudinary');
const fs = require('fs');

const formatImagePath = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const baseUrl = process.env.API_URL || `http://localhost:${process.env.PORT || 5000}`;
    return `${baseUrl}/${path.replace(/\\/g, '/')}`;
};

// GET all mangoes with filters
exports.getMangoes = async (req, res) => {
    try {
        const { variety, minPrice, maxPrice, boxSize, featured, bestSeller, page = 1, limit = 12, sort = '-createdAt' } = req.query;
        const filter = { isActive: true };
        if (variety) filter.variety = { $regex: variety, $options: 'i' };
        if (featured === 'true') filter.isFeatured = true;
        if (bestSeller === 'true') filter.isBestSeller = true;
        if (boxSize) filter['boxOptions.size'] = boxSize;
        if (minPrice || maxPrice) {
            filter['boxOptions.price'] = {};
            if (minPrice) filter['boxOptions.price'].$gte = Number(minPrice);
            if (maxPrice) filter['boxOptions.price'].$lte = Number(maxPrice);
        }

        const skip = (Number(page) - 1) * Number(limit);
        const [mangoes, total] = await Promise.all([
            Mango.find(filter).sort(sort).skip(skip).limit(Number(limit)),
            Mango.countDocuments(filter),
        ]);

        const formattedMangoes = mangoes.map(m => ({
            ...m.toObject(),
            images: m.images.map(img => formatImagePath(img))
        }));

        res.json({ mangoes: formattedMangoes, total, pages: Math.ceil(total / limit), currentPage: Number(page) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET single mango by slug
exports.getMangoBySlug = async (req, res) => {
    try {
        const mango = await Mango.findOne({ slug: req.params.slug, isActive: true });
        if (!mango) return res.status(404).json({ message: 'Mango not found' });
        const formattedMango = {
            ...mango.toObject(),
            images: mango.images.map(img => formatImagePath(img))
        };
        res.json(formattedMango);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST create mango (admin)
exports.createMango = async (req, res) => {
    try {
        const { name, variety, description, farmLocation, harvestDetails, boxOptions, tags, isFeatured, isBestSeller, isPreBookable } = req.body;
        const slug = slugify(name, { lower: true, strict: true }) + '-' + Date.now();

        const images = req.files ? req.files.map((f) => formatImagePath(f.path)) : [];

        const mango = await Mango.create({
            name, slug, variety, description, farmLocation,
            harvestDetails: JSON.parse(harvestDetails || '{}'),
            boxOptions: JSON.parse(boxOptions || '[]'),
            tags: tags ? JSON.parse(tags) : [],
            isFeatured, isBestSeller, isPreBookable,
            images,
        });
        res.status(201).json(mango);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// PUT update mango (admin)
exports.updateMango = async (req, res) => {
    try {
        const { name, ...rest } = req.body;
        const update = { ...rest };
        if (name) {
            update.name = name;
            update.slug = slugify(name, { lower: true, strict: true });
        }
        if (req.files?.length) {
            update.$push = { images: { $each: req.files.map((f) => formatImagePath(f.path)) } };
        }
        if (rest.boxOptions) update.boxOptions = JSON.parse(rest.boxOptions);
        if (rest.harvestDetails) update.harvestDetails = JSON.parse(rest.harvestDetails);
        if (rest.tags) update.tags = JSON.parse(rest.tags);

        const mango = await Mango.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!mango) return res.status(404).json({ message: 'Not found' });
        res.json(mango);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE mango (admin - soft delete)
exports.deleteMango = async (req, res) => {
    try {
        await Mango.findByIdAndUpdate(req.params.id, { isActive: false });
        res.json({ message: 'Mango deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE specific image from mango
exports.deleteMangoImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { imageUrl } = req.body;

        if (imageUrl.includes('cloudinary.com')) {
            const parts = imageUrl.split('/');
            const publicId = 'mangozila/' + parts[parts.length - 1].split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        } else if (imageUrl.includes('/uploads/')) {
            // Local file
            const localPath = imageUrl.split('/uploads/')[1];
            const fullPath = `uploads/${localPath}`;
            if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        }

        await Mango.findByIdAndUpdate(id, { $pull: { images: imageUrl } });
        res.json({ message: 'Image removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
