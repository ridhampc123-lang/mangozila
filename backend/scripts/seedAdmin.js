// Creates or updates the admin account
// Run: node scripts/seedAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// ── Change these credentials ──────────────────────────
const ADMIN_EMAIL = 'admin@mangozila.com';
const ADMIN_PASSWORD = 'Admin@1234';          // change before deploy!
const ADMIN_NAME = 'MangoZila Admin';
// ─────────────────────────────────────────────────────

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);

    let user = await User.findOne({ email: ADMIN_EMAIL });
    if (user) {
        user.role = 'admin';
        user.password = hashed;
        user.name = ADMIN_NAME;
        await user.save();
        console.log('✅ Admin account updated!');
    } else {
        await User.create({ name: ADMIN_NAME, email: ADMIN_EMAIL, password: hashed, role: 'admin', referralCode: 'MZADMIN' });
        console.log('✅ Admin account created!');
    }

    console.log('\n🔑 Admin Login Details:');
    console.log(`   URL      : http://localhost:5173/admin-login`);
    console.log(`   Email    : ${ADMIN_EMAIL}`);
    console.log(`   Password : ${ADMIN_PASSWORD}`);
    console.log('\n✅ After login you will be redirected to /admin panel');

    mongoose.disconnect();
}).catch(err => { console.error('❌', err.message); process.exit(1); });
