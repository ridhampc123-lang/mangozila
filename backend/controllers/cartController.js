const Cart = require('../models/Cart');
const Mango = require('../models/Mango');

// GET user's cart
exports.getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate('items.mango', 'name images variety boxOptions');
        
        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }

        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST add item to cart
exports.addToCart = async (req, res) => {
    try {
        const { mangoId, boxSize, quantity = 1 } = req.body;

        if (!mangoId || !boxSize) {
            return res.status(400).json({ message: 'Mango ID and box size are required' });
        }

        // Verify mango exists and get price
        const mango = await Mango.findById(mangoId);
        if (!mango || !mango.isActive) {
            return res.status(404).json({ message: 'Mango not found' });
        }

        const boxOption = mango.boxOptions.find(b => b.size === boxSize);
        if (!boxOption) {
            return res.status(400).json({ message: 'Box size not available' });
        }

        // Find or create cart
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }

        // Check if item already exists in cart
        const existingItemIndex = cart.items.findIndex(
            item => item.mango.toString() === mangoId && item.boxSize === boxSize
        );

        if (existingItemIndex > -1) {
            // Update quantity
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            cart.items.push({
                mango: mangoId,
                name: mango.name,
                image: mango.images[0],
                variety: mango.variety,
                boxSize,
                price: boxOption.price,
                quantity,
            });
        }

        await cart.save();
        await cart.populate('items.mango', 'name images variety boxOptions');

        res.json({ message: 'Item added to cart', cart });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// PUT update cart item quantity
exports.updateCartItem = async (req, res) => {
    try {
        const { mangoId, boxSize, quantity } = req.body;

        if (!mangoId || !boxSize || quantity === undefined) {
            return res.status(400).json({ message: 'Mango ID, box size, and quantity are required' });
        }

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(
            item => item.mango.toString() === mangoId && item.boxSize === boxSize
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        if (quantity <= 0) {
            // Remove item if quantity is 0 or less
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }

        await cart.save();
        await cart.populate('items.mango', 'name images variety boxOptions');

        res.json({ message: 'Cart updated', cart });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE remove item from cart
exports.removeFromCart = async (req, res) => {
    try {
        const { mangoId, boxSize } = req.body;

        if (!mangoId || !boxSize) {
            return res.status(400).json({ message: 'Mango ID and box size are required' });
        }

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(
            item => !(item.mango.toString() === mangoId && item.boxSize === boxSize)
        );

        await cart.save();
        await cart.populate('items.mango', 'name images variety boxOptions');

        res.json({ message: 'Item removed from cart', cart });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE clear entire cart
exports.clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = [];
        await cart.save();

        res.json({ message: 'Cart cleared', cart });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
