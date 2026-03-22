const Coupon = require('../models/Coupon');

exports.validateCoupon = async (req, res) => {
    try {
        const { code, orderAmount } = req.body;
        if (!code) return res.status(400).json({ message: 'Coupon code is required' });
        
        const coupon = await Coupon.findOne({ code: code.trim().toUpperCase(), isActive: true });
        if (!coupon) return res.status(404).json({ message: 'Coupon not found or inactive' });

        if (coupon.validUntil && new Date() > coupon.validUntil) {
            return res.status(400).json({ message: 'Coupon has expired' });
        }

        if (orderAmount < coupon.minOrderAmount) {
            return res.status(400).json({ message: `This coupon requires a minimum purchase of ₹${coupon.minOrderAmount}` });
        }

        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ message: 'This coupon has reached its usage limit' });
        }

        const amount = Number(orderAmount) || 0;
        const discountVal = Number(coupon.discountValue) || 0;
        const maxDiscount = (coupon.maxDiscountAmount !== undefined && coupon.maxDiscountAmount !== null)
            ? Number(coupon.maxDiscountAmount)
            : Infinity;

        let discountValue = 0;
        if (coupon.discountType === 'percentage') {
            discountValue = (amount * discountVal) / 100;
            if (maxDiscount > 0) discountValue = Math.min(discountValue, maxDiscount);
        } else {
            discountValue = discountVal;
        }

        res.json({
            valid: true,
            coupon,
            discountValue: Math.round(discountValue)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.create(req.body);
        res.status(201).json(coupon);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort('-createdAt');
        res.json(coupons);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(coupon);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteCoupon = async (req, res) => {
    try {
        await Coupon.findByIdAndDelete(req.params.id);
        res.json({ message: 'Coupon deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
