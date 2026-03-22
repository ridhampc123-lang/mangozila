const admin = require('firebase-admin');

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

// Only initialise when real credentials are present (not placeholders)
const hasCredentials =
    projectId && !projectId.includes('your-') &&
    clientEmail && !clientEmail.includes('xxxxx') &&
    privateKey && privateKey.includes('BEGIN PRIVATE KEY');

if (!admin.apps.length) {
    if (hasCredentials) {
        try {
            admin.initializeApp({
                credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
            });
            console.log('✅ Firebase Admin initialized');
        } catch (err) {
            console.error('❌ Firebase Admin init failed:', err.message);
            console.warn('⚠️  Firebase disabled — set credentials in backend/.env');
        }
    } else {
        console.warn('⚠️  Firebase credentials missing/placeholder — phone OTP disabled until .env is configured.');
        // Initialise with no-op so the rest of the app loads fine
        try { admin.initializeApp(); } catch (_) { }
    }
}

module.exports = admin;
