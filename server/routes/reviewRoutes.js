const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/reviewController");

const protect = require("../middlewares/isAuth");
const isFreelancer = require("../middlewares/isFreelancer");
router.get("/client", protect, reviewController.getClientReviews);
router.get(
  "/freelancer",
  protect,
  isFreelancer,
  reviewController.getFreelancerReviews
);
router.get("/latest", reviewController.getLatestReviews);
router.post(
  "/create-review/:serviceId",
  protect,
  reviewController.serviceReview
);
router.get("/service/:serviceId", reviewController.getServiceReviews);
module.exports = router;
