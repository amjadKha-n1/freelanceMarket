const User = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== 'freelancer') {
            return res.status(400).json({ message: 'Not Authorized!' });
        }
        const freelancer = await User.findOne({ _id: req.user._id });
        if (!freelancer) {
            return res.status(404).json({ message: 'User not found!' });
        }
        req.freelancer = freelancer;
        next()
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

