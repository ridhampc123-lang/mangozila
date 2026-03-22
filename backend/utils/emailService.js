const transporter = require('../config/mailer');
const { generateInvoicePDF } = require('./invoicePDF');

const sendOrderConfirmation = async (order) => {
    try {
        const invoiceBuffer = await generateInvoicePDF(order);

        const slotMap = { morning: '9AM – 12PM', afternoon: '12PM – 4PM', evening: '4PM – 8PM' };
        const deliveryDate = order.deliverySlot?.date
            ? new Date(order.deliverySlot.date).toLocaleDateString('en-IN')
            : 'N/A';

        const itemsHtml = order.items
            .map(
                (item) => `
      <tr style="border-bottom:1px solid #e5e7eb;">
        <td style="padding:10px;">${item.name}</td>
        <td style="padding:10px;text-align:center;">${item.boxSize}</td>
        <td style="padding:10px;text-align:center;">${item.quantity}</td>
        <td style="padding:10px;text-align:right;">₹${item.price * item.quantity}</td>
      </tr>`
            )
            .join('');

        const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family:Arial,sans-serif;background:#fffbeb;margin:0;padding:0;">
        <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
          <div style="background:linear-gradient(135deg,#f59e0b,#d97706);padding:36px;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:28px;">🥭 MangoZila</h1>
            <p style="color:#fef3c7;margin:8px 0 0;">Order Confirmed!</p>
          </div>
          <div style="padding:32px;">
            <h2 style="color:#1f2937;">Hi ${order.customerInfo.name}, your mango box is on its way! 🎉</h2>
            <p style="color:#6b7280;">Order ID: <strong>#${order.orderId}</strong></p>

            <div style="background:#fffbeb;border-radius:8px;padding:16px;margin:20px 0;">
              <p style="margin:0 0 8px;color:#92400e;font-weight:bold;">📦 Delivery Details</p>
              <p style="margin:4px 0;color:#374151;">Date: <strong>${deliveryDate}</strong></p>
              <p style="margin:4px 0;color:#374151;">Slot: <strong>${slotMap[order.deliverySlot?.slot] || 'N/A'}</strong></p>
              <p style="margin:4px 0;color:#374151;">Address: ${order.deliveryAddress.street}, ${order.deliveryAddress.city || ''}</p>
            </div>

            <table style="width:100%;border-collapse:collapse;margin:20px 0;">
              <thead>
                <tr style="background:#f59e0b;">
                  <th style="padding:10px;text-align:left;color:#fff;">Item</th>
                  <th style="padding:10px;color:#fff;">Box</th>
                  <th style="padding:10px;color:#fff;">Qty</th>
                  <th style="padding:10px;text-align:right;color:#fff;">Amount</th>
                </tr>
              </thead>
              <tbody>${itemsHtml}</tbody>
            </table>

            <div style="text-align:right;border-top:2px solid #f59e0b;padding-top:16px;">
              <p style="color:#1f2937;font-size:18px;font-weight:bold;">Total: ₹${order.pricing?.total || 0}</p>
            </div>

            <p style="color:#6b7280;margin-top:24px;">Find your invoice PDF attached below. Track your order at <a href="${process.env.FRONTEND_URL}/track/${order.orderId}" style="color:#f59e0b;">MangoZila</a></p>
          </div>
          <div style="background:#1f2937;padding:16px;text-align:center;">
            <p style="color:#9ca3af;margin:0;font-size:12px;">© ${new Date().getFullYear()} MangoZila. Fresh from the farm. 🥭</p>
          </div>
        </div>
      </body>
      </html>`;

        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: order.customerInfo.email,
            subject: `✅ Order Confirmed - #${order.orderId} | MangoZila`,
            html,
            attachments: [
                {
                    filename: `invoice-${order.orderId}.pdf`,
                    content: invoiceBuffer,
                    contentType: 'application/pdf',
                },
            ],
        });
    } catch (err) {
        console.error('Email send error:', err.message);
    }
};

module.exports = { sendOrderConfirmation };
