// Run once: node scripts/makeAdmin.js <phone_number>
// Example:  node scripts/makeAdmin.js 9876543210
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const phone = process.argv[2];
if (!phone) { console.error('Usage: node scripts/makeAdmin.js <phone>'); process.exit(1); }

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const user = await User.findOneAndUpdate({ phone }, { role: 'admin' }, { new: true });
    if (!user) {
        console.error(`❌ No user found with phone ${phone}. Login first at http://localhost:5173/login`);
    } else {
        console.log(`✅ ${user.name} (${user.phone}) is now ADMIN!`);
    }
    mongoose.disconnect();
}).catch(err => { console.error(err); process.exit(1); });
