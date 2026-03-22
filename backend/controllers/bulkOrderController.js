const BulkOrder = require('../models/BulkOrder');

// POST - Submit bulk order inquiry (public)
exports.createBulkOrder = async (req, res) => {
    try {
        const { name, email, phone, location, productType, company, quantity, variety, apartment, address, message } = req.body;

        // Validation
        if (!name || !email || !phone || !quantity || !location || !productType) {
            return res.status(400).json({ 
                message: 'Name, email, phone, location, product type, and quantity are required' 
            });
        }

        const bulkOrder = await BulkOrder.create({
            name,
            email,
            phone,
            location,
            productType,
            company,
            quantity,
            variety,
            apartment,
            address,
            message,
        });

        res.status(201).json({ 
            message: 'Bulk order inquiry submitted successfully. We will contact you soon!',
            bulkOrder 
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// GET all bulk orders (admin)
exports.getAllBulkOrders = async (req, res) => {
    try {
        const { status, page = 1, limit = 20, search } = req.query;
        
        const filter = {};
        if (status) filter.status = status;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } },
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);
        const [bulkOrders, total] = await Promise.all([
            BulkOrder.find(filter)
                .sort('-createdAt')
                .skip(skip)
                .limit(Number(limit)),
            BulkOrder.countDocuments(filter),
        ]);

        res.json({ 
            bulkOrders, 
            total, 
            pages: Math.ceil(total / limit),
            currentPage: Number(page)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET single bulk order by ID (admin)
exports.getBulkOrderById = async (req, res) => {
    try {
        const bulkOrder = await BulkOrder.findById(req.params.id);
        
        if (!bulkOrder) {
            return res.status(404).json({ message: 'Bulk order not found' });
        }

        res.json(bulkOrder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT update bulk order (admin)
exports.updateBulkOrder = async (req, res) => {
    try {
        const { status, adminNotes, quotedPrice, contactedAt } = req.body;
        
        const update = {};
        if (status) update.status = status;
        if (adminNotes !== undefined) update.adminNotes = adminNotes;
        if (quotedPrice) update.quotedPrice = quotedPrice;
        if (contactedAt) update.contactedAt = contactedAt;

        const bulkOrder = await BulkOrder.findByIdAndUpdate(
            req.params.id, 
            update, 
            { new: true }
        );

        if (!bulkOrder) {
            return res.status(404).json({ message: 'Bulk order not found' });
        }

        res.json({ message: 'Bulk order updated successfully', bulkOrder });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE bulk order (admin)
exports.deleteBulkOrder = async (req, res) => {
    try {
        const bulkOrder = await BulkOrder.findByIdAndDelete(req.params.id);
        
        if (!bulkOrder) {
            return res.status(404).json({ message: 'Bulk order not found' });
        }

        res.json({ message: 'Bulk order deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
