const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

/**
 * Generate order invoice PDF and return buffer
 */
const generateInvoicePDF = (order) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        const buffers = [];

        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);

        // Header
        doc
            .fillColor('#f59e0b')
            .fontSize(24)
            .font('Helvetica-Bold')
            .text('🥭 MangoZila', 50, 50);

        doc
            .fillColor('#374151')
            .fontSize(10)
            .font('Helvetica')
            .text('Fresh Mango Delivery Service', 50, 78)
            .text('support@mangozila.com | www.mangozila.com', 50, 90);

        // Invoice title
        doc
            .fillColor('#1f2937')
            .fontSize(18)
            .font('Helvetica-Bold')
            .text('ORDER INVOICE', 350, 50);

        doc
            .fontSize(10)
            .font('Helvetica')
            .fillColor('#6b7280')
            .text(`Order ID: #${order.orderId}`, 350, 78)
            .text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`, 350, 90);

        // Divider
        doc.strokeColor('#f59e0b').lineWidth(2).moveTo(50, 115).lineTo(550, 115).stroke();

        // Customer Info
        doc
            .fillColor('#1f2937')
            .fontSize(12)
            .font('Helvetica-Bold')
            .text('Bill To:', 50, 130);

        doc
            .fontSize(10)
            .font('Helvetica')
            .fillColor('#374151')
            .text(order.customerInfo.name, 50, 148)
            .text(order.customerInfo.phone, 50, 162)
            .text(order.customerInfo.email, 50, 176)
            .text(
                `${order.deliveryAddress.street}, ${order.deliveryAddress.city || ''} - ${order.deliveryAddress.pincode || ''}`,
                50,
                190
            );

        // Delivery Info
        doc
            .fillColor('#1f2937')
            .fontSize(12)
            .font('Helvetica-Bold')
            .text('Delivery Details:', 320, 130);

        const deliveryDate = order.deliverySlot?.date
            ? new Date(order.deliverySlot.date).toLocaleDateString('en-IN')
            : 'N/A';
        const slotMap = { morning: '9AM – 12PM', afternoon: '12PM – 4PM', evening: '4PM – 8PM' };

        doc
            .fontSize(10)
            .font('Helvetica')
            .fillColor('#374151')
            .text(`Date: ${deliveryDate}`, 320, 148)
            .text(`Slot: ${slotMap[order.deliverySlot?.slot] || 'N/A'}`, 320, 162)
            .text(`Status: ${order.status.toUpperCase()}`, 320, 176);

        // Items Table Header
        const tableTop = 230;
        doc
            .fillColor('#f59e0b')
            .rect(50, tableTop, 500, 22)
            .fill();

        doc
            .fillColor('#ffffff')
            .fontSize(10)
            .font('Helvetica-Bold')
            .text('Item', 60, tableTop + 6)
            .text('Box Size', 290, tableTop + 6)
            .text('Qty', 370, tableTop + 6)
            .text('Price', 420, tableTop + 6)
            .text('Total', 480, tableTop + 6);

        // Items
        let y = tableTop + 30;
        order.items.forEach((item, idx) => {
            if (idx % 2 === 0) {
                doc.fillColor('#fef9ee').rect(50, y - 4, 500, 20).fill();
            }
            doc
                .fillColor('#1f2937')
                .fontSize(9)
                .font('Helvetica')
                .text(item.name || 'Mango Box', 60, y)
                .text(item.boxSize, 290, y)
                .text(item.quantity.toString(), 370, y)
                .text(`₹${item.price}`, 420, y)
                .text(`₹${item.price * item.quantity}`, 480, y);
            y += 22;
        });

        // Totals
        doc.strokeColor('#e5e7eb').lineWidth(1).moveTo(350, y + 5).lineTo(550, y + 5).stroke();
        y += 15;

        const addrow = (label, value, bold = false) => {
            doc
                .fillColor(bold ? '#1f2937' : '#6b7280')
                .fontSize(10)
                .font(bold ? 'Helvetica-Bold' : 'Helvetica')
                .text(label, 350, y)
                .text(value, 480, y);
            y += 18;
        };

        addrow('Subtotal:', `₹${order.pricing?.subtotal || 0}`);
        if (order.couponDiscount) addrow('Coupon Discount:', `-₹${order.couponDiscount}`);
        if (order.loyaltyPointsUsed) addrow('Loyalty Discount:', `-₹${order.loyaltyPointsUsed}`);
        addrow('Delivery Charge:', `₹${order.pricing?.deliveryCharge || 0}`);
        addrow('Total Amount:', `₹${order.pricing?.total || 0}`, true);

        // Footer
        doc
            .strokeColor('#f59e0b')
            .lineWidth(2)
            .moveTo(50, y + 20)
            .lineTo(550, y + 20)
            .stroke();

        doc
            .fillColor('#6b7280')
            .fontSize(9)
            .font('Helvetica')
            .text('Thank you for choosing MangoZila! Fresh from the farm to your doorstep. 🥭', 50, y + 35, {
                align: 'center',
                width: 500,
            });

        doc.end();
    });
};

module.exports = { generateInvoicePDF };
