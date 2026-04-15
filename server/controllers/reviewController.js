const Review = require("../models/Review");
const Order = require("../models/Order");
const Service = require("../models/Service");

exports.serviceReview = async (req, res) => {
  try {
    const loggedInUser = req.user;
    if (!loggedInUser) {
      return res.status(400).json({ message: "User not logged in!" });
    }

    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const serviceId = req.params.serviceId;
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found!" });
    }

    const order = await Order.findOne({
      service: serviceId,
      client: loggedInUser._id,
    });
    if (!order) {
      return res.status(404).json({ message: "Order not found!" });
    }

    if (order.client.toString() !== loggedInUser._id.toString()) {
      return res.status(400).json({ message: "ONot your order!" });
    }
    if (order.status !== "completed") {
      return res.status(400).json({ message: "Order is not completed yet!" });
    }

    const existingReview = await Review.findOne({ order: order._id });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You aleady reviewed this order" });
    }

    const review = await Review.create({
      order: order._id,
      service: service._id,
      client: loggedInUser._id,
      freelancer: order.freelancer,
      rating,
      comment,
    });

    const reviews = await Review.find({ service: serviceId });
    const totalRatings = reviews.reduce((sum, r) => sum + r.rating, 0);
    service.rating = totalRatings / reviews.length;

    await service.save();
    res.status(201).json({
      message: "Review added Successfully",
      review,
      newRating: service.rating,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getServiceReviews = async (req, res) => {
  try {
    const serviceId = req.params.serviceId;
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found!" });
    }
    const reviews = await Review.find({ service: service._id });
    if (!reviews) {
      return res
        .status(400)
        .json({ message: "No reviews found for this service!" });
    }

    const distribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };
    let totalRating = 0;
    reviews.forEach((review) => {
      distribution[review.rating]++;
      totalRating += review.rating;
    });

    const ratingDistribution = {};
    for (let i = 5; i >= 1; i--) {
      ratingDistribution[i] =
        reviews.length > 0 ? (distribution[i] / reviews.length) * 100 : 0;
    }

    const serviceWithStats = {
      ...service.toObject(),
      rating:
        reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0,
      totalReviews: reviews.length,
      ratingDistribution,
    };
    res.status(200).json({
      reviews,
      service: serviceWithStats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getClientReviews = async (req, res) => {
  try {
    const loggedInUser = req.user;
    if (!loggedInUser) {
      return res.status(400).json({ message: "User not logged in!" });
    }
    const reviews = await Review.find({ client: loggedInUser._id });
    if (reviews.length === 0) {
      return res.status(404).json({ message: "User do not have any reviews" });
    }
    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFreelancerReviews = async (req, res) => {
  try {
    const loggedInUser = req.user;
    if (!loggedInUser) {
      return res.status(400).json({ message: "User not logged in! " });
    }
    const reviews = await Review.find({
      freelancer: loggedInUser._id,
    }).populate("service", "title");
    if (reviews.length === 0) {
      return res
        .status(404)
        .json({ message: "Freelancer do not have any reviews" });
    }
    res.status(200).json({ reviews });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getLatestReviews = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3;
    const reviews = await Review.find()
      .populate("client", "name avatar")
      .populate("service", "title")
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      reviews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
