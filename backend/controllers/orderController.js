const Order = require('../models/Order');
const Mango = require('../models/Mango');
const User = require('../models/User');
const Coupon = require('../models/Coupon');
const LoyaltyPoint = require('../models/LoyaltyPoint');
const Referral = require('../models/Referral');
const { sendOrderConfirmation } = require('../utils/emailService');
const { v4: uuidv4 } = require('uuid');

// Generate short unique order ID
const generateOrderId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = 'MZ';
    for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
    return id;
};

const AHMEDABAD_CENTER = [23.0225, 72.5714];
const GANDHINAGAR_CENTER = [23.2156, 72.6369];
const MAX_DISTANCE_KM = 70;

const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const validateOrderData = (customerInfo, deliveryAddress) => {
    const { phone } = customerInfo;
    const { pincode, fullAddress, latitude, longitude } = deliveryAddress;

    // Phone validation: 10 digits starting with 6,7,8,9
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
        return 'Please enter a valid 10-digit Indian mobile number.';
    }

    // Coordinates existence
    if (!latitude || !longitude) {
        return 'Invalid location coordinates. Please select address from the map.';
    }

    // Distance validation (70km radius)
    const distAmd = getDistance(latitude, longitude, AHMEDABAD_CENTER[0], AHMEDABAD_CENTER[1]);
    const distGnr = getDistance(latitude, longitude, GANDHINAGAR_CENTER[0], GANDHINAGAR_CENTER[1]);
    
    if (distAmd > MAX_DISTANCE_KM && distGnr > MAX_DISTANCE_KM) {
        return 'Delivery currently available only within 70km of Ahmedabad and Gandhinagar.';
    }

    // Pincode validation (ensure it exists)
    if (!pincode) {
        return 'Please select a valid delivery location with a pincode on the map.';
    }

    // Address length validation
    if (!fullAddress || fullAddress.length < 15) {
        return 'Please enter a complete delivery address (minimum 15 characters).';
    }

    return null;
};

// POST - Create order (guest or logged user)
exports.createOrder = async (req, res) => {
    try {
        const {
            customerInfo, deliveryAddress, items, deliverySlot,
            couponCode, loyaltyPointsToRedeem, referralCode, notes, isPreBook,
        } = req.body;

        // Strict Delivery Validation
        const validationError = validateOrderData(customerInfo, deliveryAddress);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        // Look up mango prices and validate stock
        let subtotal = 0;
        const orderItems = [];
        for (const item of items) {
            const mango = await Mango.findById(item.mangoId);
            if (!mango) return res.status(404).json({ message: `Mango not found: ${item.mangoId}` });
            const boxOpt = mango.boxOptions.find((b) => b.size === item.boxSize);
            if (!boxOpt) return res.status(400).json({ message: `Box size ${item.boxSize} not available` });
            if (boxOpt.stock < item.quantity) return res.status(400).json({ message: `Insufficient stock for ${mango.name} ${item.boxSize}` });
            subtotal += boxOpt.price * item.quantity;
            orderItems.push({ mango: mango._id, name: mango.name, image: mango.images[0], boxSize: item.boxSize, price: boxOpt.price, quantity: item.quantity });
        }

        let couponDiscount = 0;
        let couponObj = null;
        if (couponCode) {
            couponObj = await Coupon.findOne({ code: couponCode.trim().toUpperCase(), isActive: true });
            if (!couponObj) return res.status(400).json({ message: 'Invalid or inactive coupon code' });
            if (couponObj.validUntil && new Date() > couponObj.validUntil) {
                return res.status(400).json({ message: 'Coupon has expired' });
            }
            if (subtotal < couponObj.minOrderAmount) {
                return res.status(400).json({ message: `Coupon requires a minimum order of ₹${couponObj.minOrderAmount}` });
            }
            const discVal = Number(couponObj.discountValue) || 0;
            const maxDisc = (couponObj.maxDiscountAmount !== undefined && couponObj.maxDiscountAmount !== null)
                ? Number(couponObj.maxDiscountAmount)
                : Infinity;

            if (couponObj.discountType === 'percentage') {
                couponDiscount = (subtotal * discVal) / 100;
                if (maxDisc > 0) couponDiscount = Math.min(couponDiscount, maxDisc);
            } else {
                couponDiscount = discVal;
            }
            couponDiscount = Math.round(couponDiscount);
        }

        // Loyalty points (10 points = ₹1)
        let loyaltyDiscount = 0;
        let loyaltyPointsUsed = 0;
        let dbUser = null;
        if (req.user) {
            dbUser = await User.findById(req.user._id);
        }
        if (dbUser && loyaltyPointsToRedeem && loyaltyPointsToRedeem > 0) {
            loyaltyPointsUsed = Math.min(loyaltyPointsToRedeem, dbUser.loyaltyPoints);
            loyaltyDiscount = Math.floor(loyaltyPointsUsed / 10);
        }

        const deliveryCharge = subtotal >= 500 ? 0 : 49;
        const total = Math.max(0, subtotal - couponDiscount - loyaltyDiscount + deliveryCharge);

        const orderId = generateOrderId();
        const order = await Order.create({
            orderId,
            user: dbUser?._id || null,
            isGuest: !dbUser,
            customerInfo,
            deliveryAddress,
            items: orderItems,
            pricing: { subtotal, discount: couponDiscount + loyaltyDiscount, deliveryCharge, loyaltyDiscount, total },
            couponCode,
            couponDiscount,
            loyaltyPointsUsed,
            loyaltyPointsEarned: 0,
            referralCode,
            deliverySlot,
            notes,
            isPreBook: isPreBook || false,
            statusHistory: [{ status: 'placed', note: 'Order placed successfully' }],
        });

        // Deduct stock
        for (const item of items) {
            await Mango.updateOne(
                { _id: item.mangoId, 'boxOptions.size': item.boxSize },
                { $inc: { 'boxOptions.$.stock': -item.quantity } }
            );
        }

        // Apply coupon usage
        if (couponObj) {
            await Coupon.findByIdAndUpdate(couponObj._id, {
                $inc: { usedCount: 1 },
                ...(dbUser ? { $push: { usedBy: dbUser._id } } : {}),
            });
        }

        // Loyalty points: deduct used, credit earned
        if (dbUser) {
            const pointsEarned = Math.floor(total / 10);
            order.loyaltyPointsEarned = pointsEarned;
            await order.save();

            const newBalance = dbUser.loyaltyPoints - loyaltyPointsUsed + pointsEarned;
            await User.findByIdAndUpdate(dbUser._id, { loyaltyPoints: newBalance });

            if (loyaltyPointsUsed > 0) {
                await LoyaltyPoint.create({ user: dbUser._id, order: order._id, type: 'redeemed', points: -loyaltyPointsUsed, description: 'Redeemed for order discount', balance: newBalance + pointsEarned });
            }
            if (pointsEarned > 0) {
                await LoyaltyPoint.create({ user: dbUser._id, order: order._id, type: 'earned', points: pointsEarned, description: `Earned for order #${orderId}`, balance: newBalance });
            }

            // Referral reward
            if (referralCode) {
                const referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });
                if (referrer) {
                    await Referral.create({ referrer: referrer._id, referee: dbUser._id, referralCode, isUsed: true, rewardPoints: 100, rewardGiven: true, orderId: order._id });
                    await User.findByIdAndUpdate(referrer._id, { $inc: { loyaltyPoints: 100 } });
                    await LoyaltyPoint.create({ user: referrer._id, order: order._id, type: 'bonus', points: 100, description: `Referral reward – ${dbUser.name} joined` });
                }
            }
        }

        // Send confirmation email
        sendOrderConfirmation(order).catch((e) => console.error('Email error:', e.message));

        res.status(201).json({ message: 'Order placed successfully', order });
    } catch (err) {
        console.error('Create order error:', err);
        res.status(500).json({ message: err.message });
    }
};

// GET track order by orderId
exports.trackOrder = async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId }).populate('items.mango', 'name images');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET my orders (logged user)
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET all orders (admin)
exports.getAllOrders = async (req, res) => {
    try {
        const { status, page = 1, limit = 20, search } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (search) filter.$or = [
            { orderId: { $regex: search, $options: 'i' } },
            { 'customerInfo.name': { $regex: search, $options: 'i' } },
            { 'customerInfo.phone': { $regex: search, $options: 'i' } },
        ];
        const skip = (Number(page) - 1) * Number(limit);
        const [orders, total] = await Promise.all([
            Order.find(filter).sort('-createdAt').skip(skip).limit(Number(limit)).populate('user', 'name email'),
            Order.countDocuments(filter),
        ]);
        res.json({ orders, total, pages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT cancel order by customer (guest or logged-in)
exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId });
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (!['placed', 'confirmed'].includes(order.status)) {
            return res.status(400).json({ message: 'Order cannot be cancelled at this stage. Only placed or confirmed orders can be cancelled.' });
        }

        // If the order belongs to a logged-in user, verify ownership
        if (order.user && req.user && order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to cancel this order' });
        }

        order.status = 'cancelled';
        order.statusHistory.push({ status: 'cancelled', note: 'Cancelled by customer' });
        await order.save();

        // Restore stock for each item
        for (const item of order.items) {
            await Mango.updateOne(
                { _id: item.mango, 'boxOptions.size': item.boxSize },
                { $inc: { 'boxOptions.$.stock': item.quantity } }
            );
        }

        res.json({ message: 'Order cancelled successfully', order });
    } catch (err) {
        console.error('Cancel order error:', err);
        res.status(500).json({ message: err.message });
    }
};

// PUT update order status (admin)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status, note } = req.body;
        const validStatuses = ['placed', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status' });

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                status,
                $push: { statusHistory: { status, note: note || '' } },
                ...(status === 'delivered' ? { paymentStatus: 'paid' } : {}),
            },
            { new: true }
        );
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
