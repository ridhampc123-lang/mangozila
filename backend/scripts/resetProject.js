require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const uploadsRoot = path.join(__dirname, '..', 'uploads');
const uploadSubDirs = ['mangoes', 'blogs', 'banners', 'offers', 'settings'];

const clearDirectory = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        return;
    }

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
            fs.rmSync(fullPath, { recursive: true, force: true });
            continue;
        }

        if (entry.isFile() && entry.name !== '.gitkeep') {
            fs.unlinkSync(fullPath);
        }
    }
};

const resetProject = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is missing in environment.');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB. Resetting database...');

    await mongoose.connection.db.dropDatabase();
    console.log('Database dropped successfully.');

    clearDirectory(uploadsRoot);
    for (const subDir of uploadSubDirs) {
        clearDirectory(path.join(uploadsRoot, subDir));
    }
    console.log('Upload directories cleared successfully.');

    await mongoose.disconnect();
    console.log('Project reset complete.');
};

resetProject().catch(async (error) => {
    console.error('Reset failed:', error.message);
    try {
        await mongoose.disconnect();
    } catch (_error) {
        // Ignore disconnect failures on error path.
    }
    process.exit(1);
});
