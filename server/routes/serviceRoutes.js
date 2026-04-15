const express = require("express");
const router = express.Router();

const serviceController = require("../controllers/serviceController");

const protect = require("../middlewares/isAuth");
const isFreelancer = require("../middlewares/isFreelancer");
const isOwner = require("../middlewares/isOwner");

router.get("/services/search", serviceController.searchServices);
router.get(
  "/services/my-services",
  protect,
  isFreelancer,
  serviceController.getMyServices
);
router.post(
  "/services/create-service",
  protect,
  isFreelancer,
  serviceController.createService
);
router.get("/services", serviceController.getAllServices);
router.get("/services/:serviceId", serviceController.getSingleService);
router.put(
  "/services/:serviceId/edit",
  protect,
  isFreelancer,
  isOwner,
  serviceController.updateService
);
router.delete(
  "/services/:serviceId",
  protect,
  isFreelancer,
  isOwner,
  serviceController.deleteService
);

module.exports = router;
