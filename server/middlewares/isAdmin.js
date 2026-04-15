module.exports = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(400).json({ message: 'Not authorized!' });
    }
    next();}