const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const protect = require("../middlewares/isAuth");

router.post("/register", authController.register);
router.post("/login", authController.login);

router.get("/me", protect, (req, res) => {
  res.status(200).json({ user: req.user });
});
module.exports = router;
