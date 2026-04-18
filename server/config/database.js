const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/freelance';
        await mongoose.connect(mongoURI);
        console.log('Database connected Successfully!');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports = connectDb;