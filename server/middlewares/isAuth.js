const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token || !token.startsWith("Bearer")) {
      return res.status(401).json({ message: "Not Authorized" });
    }

    token = token.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: "Not Authorized!" });
  }
};

module.exports = protect;