const express = require("express");

const router = express.Router();
const userController = require("../controllers/userController");
const protect = require("../middlewares/isAuth");

router.get("/me", protect, userController.getMyProfile);
router.get("/:id", userController.getUserProfile);
router.put("/me", protect, userController.updateProfile);
router.post("/become-freelancer", protect, userController.becomeFreelancer);

module.exports = router;
