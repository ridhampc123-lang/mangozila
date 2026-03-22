const mongoose = require('mongoose');

const bulkOrderSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    location: { 
        type: String, 
        enum: ['Ahmedabad', 'Gandhinagar', 'Rajkot'],
        required: true 
    },
    company: { type: String, trim: true },
    quantity: { type: String, required: true }, // e.g., "500 kg", "100 boxes"
    productType: { 
        type: String, 
        enum: ['Kesar 5kg', 'Kesar 10kg', 'Kachchh Kesar 5kg', 'Kachchh Kesar 10kg'],
        required: true 
    },
    variety: { type: String }, // Mango variety preference
    apartment: { type: String, trim: true },
    address: { type: String, trim: true },
    message: { type: String, maxlength: 1000 },
    status: {
        type: String,
        enum: ['pending', 'contacted', 'quoted', 'confirmed', 'rejected'],
        default: 'pending',
    },
    adminNotes: { type: String },
    quotedPrice: { type: Number },
    contactedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('BulkOrder', bulkOrderSchema);
