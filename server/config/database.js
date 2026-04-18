const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/freelance';
        await mongoose.connect(mongoURI);
        console.log('✅ Database connected Successfully!');
    } catch (error) {
        console.error('❌ Database connection error:', error.message);
        process.exit(1);
    }
}

module.exports = connectDb;