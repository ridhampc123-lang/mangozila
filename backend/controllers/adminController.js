const Order = require('../models/Order');
const User = require('../models/User');
const Mango = require('../models/Mango');
const Banner = require('../models/Banner');
const { cloudinary } = require('../config/cloudinary');

const formatImagePath = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    // Serve local uploads from backend root
    const baseUrl = process.env.API_URL || `http://localhost:${process.env.PORT || 5000}`;
    return `${baseUrl}/${path.replace(/\\/g, '/')}`;
};

exports.getDashboardStats = async (req, res) => {
    try {
        const [totalOrders, totalUsers, totalMangoes, recentOrders, revenueAgg] = await Promise.all([
            Order.countDocuments(),
            User.countDocuments({ role: 'customer' }),
            Mango.countDocuments({ isActive: true }),
            Order.find().sort('-createdAt').limit(5).populate('user', 'name email'),
            Order.aggregate([
                { $match: { status: { $ne: 'cancelled' } } },
                { $group: { _id: null, total: { $sum: '$pricing.total' } } },
            ]),
        ]);

        // Revenue by last 7 days
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const dailyRevenue = await Order.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo }, status: { $ne: 'cancelled' } } },
            { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$pricing.total' }, orders: { $sum: 1 } } },
            { $sort: { _id: 1 } },
        ]);

        // Order status breakdown
        const statusBreakdown = await Order.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]);

        // Popular mangoes
        const popularMangoes = await Order.aggregate([
            { $unwind: '$items' },
            { $group: { _id: '$items.mango', name: { $first: '$items.name' }, totalSold: { $sum: '$items.quantity' } } },
            { $sort: { totalSold: -1 } },
            { $limit: 5 },
        ]);

        res.json({
            totalOrders, totalUsers, totalMangoes,
            totalRevenue: revenueAgg[0]?.total || 0,
            recentOrders, dailyRevenue, statusBreakdown, popularMangoes,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Banner management
exports.getBanners = async (req, res) => {
    try {
        const banners = await Banner.find({ isActive: true }).sort('order');
        const formattedBanners = banners.map(b => ({
            ...b.toObject(),
            image: formatImagePath(b.image)
        }));
        res.json(formattedBanners);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getAllBanners = async (req, res) => {
    try {
        const banners = await Banner.find().sort('order');
        const formattedBanners = banners.map(b => ({
            ...b.toObject(),
            image: formatImagePath(b.image)
        }));
        res.json(formattedBanners);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createBanner = async (req, res) => {
    try {
        const image = formatImagePath(req.file?.path);
        if (!image) return res.status(400).json({ message: 'Image required' });
        const banner = await Banner.create({ ...req.body, image });
        res.status(201).json(banner);
    } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.updateBanner = async (req, res) => {
    try {
        const update = { ...req.body };
        if (req.file) update.image = formatImagePath(req.file.path);
        const banner = await Banner.findByIdAndUpdate(req.params.id, update, { new: true });
        res.json(banner);
    } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deleteBanner = async (req, res) => {
    try {
        await Banner.findByIdAndDelete(req.params.id);
        res.json({ message: 'Banner deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
};
