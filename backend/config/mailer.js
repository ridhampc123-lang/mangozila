const nodemailer = require('nodemailer');

const isPlaceholder = (val) => !val || val.includes('your_') || val.includes('enter_') || val.includes('ridhampc123');

const hasSmtpConfig = !isPlaceholder(process.env.EMAIL_USER) && !isPlaceholder(process.env.EMAIL_PASS);

if (!hasSmtpConfig) {
    console.warn('⚠️ SMTP Email credentials are not configured or using placeholders. Email sending will be skipped.');
}

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
        user: hasSmtpConfig ? process.env.EMAIL_USER : 'placeholder@mangozila.com',
        pass: hasSmtpConfig ? process.env.EMAIL_PASS : 'placeholder',
    },
});

// Mock sendMail if not configured to prevent crashes
if (!hasSmtpConfig) {
    transporter.sendMail = async (options) => {
        console.log('📧 Mock Email sent (SMTP not configured):', options.subject, 'to', options.to);
        return { messageId: 'mock-id' };
    };
}

module.exports = transporter;
