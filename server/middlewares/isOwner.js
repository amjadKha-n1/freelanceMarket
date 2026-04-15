const Service = require('../models/Service');

module.exports = async (req, res, next) => {
    try {
        const serviceId = req.params.serviceId || req.params.id;
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: 'Service not found!' });
        }

        if (service.freelancer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You can only modify your own Services!' })
        };
        req.service = service;
        next();
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};
