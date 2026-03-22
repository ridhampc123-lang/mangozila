const Contact = require('../models/Contact');

// POST - Submit contact form (public)
exports.createContact = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        // Validation
        if (!name || !email || !phone || !subject || !message) {
            return res.status(400).json({ 
                message: 'All fields are required' 
            });
        }

        // Phone validation (10 digits)
        if (!/^\d{10}$/.test(phone)) {
            return res.status(400).json({ 
                message: 'Please enter a valid 10-digit phone number' 
            });
        }

        const contact = await Contact.create({
            name,
            email,
            phone,
            subject,
            message,
        });

        res.status(201).json({ 
            message: 'Thank you for contacting us! We will get back to you soon.',
            contact 
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// GET all contact messages (admin)
exports.getAllContacts = async (req, res) => {
    try {
        const { status, page = 1, limit = 20, search } = req.query;
        
        const filter = {};
        if (status) filter.status = status;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
                { subject: { $regex: search, $options: 'i' } },
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);
        const [contacts, total] = await Promise.all([
            Contact.find(filter)
                .sort('-createdAt')
                .skip(skip)
                .limit(Number(limit)),
            Contact.countDocuments(filter),
        ]);

        res.json({ 
            contacts, 
            total, 
            pages: Math.ceil(total / limit),
            currentPage: Number(page)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET single contact by ID (admin)
exports.getContactById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        
        if (!contact) {
            return res.status(404).json({ message: 'Contact message not found' });
        }

        // Mark as read if status is new
        if (contact.status === 'new') {
            contact.status = 'read';
            await contact.save();
        }

        res.json(contact);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT update contact (admin)
exports.updateContact = async (req, res) => {
    try {
        const { status, adminNotes, repliedAt } = req.body;
        
        const update = {};
        if (status) update.status = status;
        if (adminNotes !== undefined) update.adminNotes = adminNotes;
        if (repliedAt) update.repliedAt = repliedAt;

        const contact = await Contact.findByIdAndUpdate(
            req.params.id, 
            update, 
            { new: true }
        );

        if (!contact) {
            return res.status(404).json({ message: 'Contact message not found' });
        }

        res.json({ message: 'Contact updated successfully', contact });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE contact (admin)
exports.deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        
        if (!contact) {
            return res.status(404).json({ message: 'Contact message not found' });
        }

        res.json({ message: 'Contact message deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
