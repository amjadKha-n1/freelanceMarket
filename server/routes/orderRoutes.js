const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");
const protect = require("../middlewares/isAuth");
const isFreelancer = require("../middlewares/isFreelancer");
const isOwner = require("../middlewares/isOwner");

router.post("/create-order", protect, orderController.createOrder);
router.get(
  "/freelancer-orders",
  protect,
  isFreelancer,
  orderController.getFreelancerOrders
);
router.get(
  "/earnings",
  protect,
  isFreelancer,
  orderController.calculateEarnings
);
router.get("/my-orders", protect, orderController.getMyOrders);

router.put(
  "/:orderId/client-status",
  protect,
  orderController.clientOrderStatus
);
router.put(
  "/:orderId/status",
  protect,
  isFreelancer,
  orderController.orderStatus
);
router.get("/:orderId", protect, orderController.getAllOrders);

module.exports = router;
