const Subscription = require('../models/Subscription');
const User = require('../models/User');
const Mango = require('../models/Mango');

exports.createSubscription = async (req, res) => {
    try {
        const user = await User.findOne({ firebaseUid: req.user.uid });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { mangoId, boxSize, frequency, deliveryAddress, deliverySlot, startDate } = req.body;
        const mango = await Mango.findById(mangoId);
        if (!mango) return res.status(404).json({ message: 'Mango not found' });
        const boxOpt = mango.boxOptions.find((b) => b.size === boxSize);
        if (!boxOpt) return res.status(400).json({ message: 'Box size not available' });

        const subscription = await Subscription.create({
            user: user._id, mango: mangoId, boxSize, frequency, deliveryAddress, deliverySlot,
            startDate: new Date(startDate), nextDeliveryDate: new Date(startDate),
            pricePerDelivery: boxOpt.price,
        });
        res.status(201).json(subscription);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getMySubscriptions = async (req, res) => {
    try {
        const user = await User.findOne({ firebaseUid: req.user.uid });
        const subs = await Subscription.find({ user: user._id }).populate('mango', 'name images variety');
        res.json(subs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateSubscriptionStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const user = await User.findOne({ firebaseUid: req.user.uid });
        const sub = await Subscription.findOneAndUpdate(
            { _id: req.params.id, user: user._id },
            { status }, { new: true }
        );
        if (!sub) return res.status(404).json({ message: 'Subscription not found' });
        res.json(sub);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getAllSubscriptions = async (req, res) => {
    try {
        const subs = await Subscription.find().populate('user', 'name email phone').populate('mango', 'name variety').sort('-createdAt');
        res.json(subs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
