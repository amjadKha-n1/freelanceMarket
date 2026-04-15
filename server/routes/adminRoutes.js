const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");

const protect = require("../middlewares/isAuth");
const isAdmin = require("../middlewares/isAdmin");

router.get("/public-stats", adminController.getPublicStats);

router.get("/users", protect, isAdmin, adminController.getAllUsers);
router.get("/stats", protect, isAdmin, adminController.getAllStats);
router.get(
  "/admin-earnings",
  protect,
  isAdmin,
  adminController.getPlatformEarnings
);
router.get("/services", protect, isAdmin, adminController.getAllServices);
router.get("/orders", protect, isAdmin, adminController.getAllOrders);
router.post(
  "/:freelancerId",
  protect,
  isAdmin,
  adminController.approveFreelancer
);
router.put(
  "/services/:serviceId/approve",
  protect,
  isAdmin,
  adminController.approveService
);
router.delete(
  "/services/:serviceId",
  protect,
  isAdmin,
  adminController.adminDeleteService
);
module.exports = router;
