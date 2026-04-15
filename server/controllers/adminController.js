const User = require("../models/User");
const Service = require("../models/Service");
const Order = require("../models/Order");
const Review = require("../models/Review");
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    if (!users) {
      return res.status(404).json({ message: "Users not found" });
    }
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalFreelancers = await User.countDocuments({ role: "freelancer" });
    const totalClients = await User.countDocuments({ role: "client" });
    const totalServices = await Service.countDocuments({});
    const totalOrders = await Order.countDocuments({});

    res.status(200).json({
      totalUsers,
      totalFreelancers,
      totalClients,
      totalServices,
      totalOrders,
      totalRevenue: 0,
      pendingApprovals: 0,
      reportedItems: 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find().populate("freelancer");
    if (!services) {
      return res.status(400).json({ message: "Services not found!" });
    }
    res.status(200).json({
      services,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("service")
      .populate("client")
      .populate("freelancer");
    if (!orders) {
      return res.status(400).json({ message: "Orders not found" });
    }
    res.status(200).json({
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.approveFreelancer = async (req, res) => {
  try {
    const freelancerId = req.params.freelancerId;
    const adminUser = req.user;
    const user = await User.findById(freelancerId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    if (user.freelancerRequest?.status !== "pending") {
      return res.status(400).json({ message: "No pending request found" });
    }
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          role: "freelancer",
          "freelancerRequest.status": "approved",
          "freelancerRequest.reviewedAt": new Date(),
          "freelancerRequest.reviewedBy": req.user._id,
        },
      }
    );
    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        skills: user.skills,
        bio: user.bio,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.approveService = async (req, res) => {
  try {
    const serviceId = req.params.serviceId;
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found!" });
    }
    if (service.status !== "pending") {
      return res.status(400).json({ message: "No pending Services" });
    }
    await Service.updateOne(
      { _id: service._id },
      {
        $set: { status: "approved" },
      }
    );
    res.status(200).json({
      service,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPlatformEarnings = async (req, res) => {
  try {
    const orders = await Order.find({ paymentStatus: "paid" });

    const COMMISION_RATE = 0.2;

    let totalPlatformRevenue = 0;
    let totalFreelancerEarnings = 0;
    let pendingPayouts = 0;

    orders.forEach((order) => {
      const commission = order.price * COMMISION_RATE;
      const freelancerEarnings = order.price * (1 - COMMISION_RATE);

      totalPlatformRevenue += commission;
      totalFreelancerEarnings += freelancerEarnings;

      if (order.status === "completed") {
        pendingPayouts += freelancerEarnings;
      }
    });
    res.status(200).json({
      totalPlatformRevenue,
      totalFreelancerEarnings,
      pendingPayouts,
      totalOrders: orders.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.adminDeleteService = async (req, res) => {
  try {
    const serviceId = req.params.serviceId;
    const service = await Service.findByIdAndDelete(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found!" });
    }
    res.status(200).json({
      message: "Service deleted Successfully!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPublicStats = async (req, res) => {
  try {
    const totalFreelancers = await User.countDocuments({ role: "freelancer" });
    const totalProjects = await Order.countDocuments({ status: "completed" });

    const reviews = await Review.find();
    let averageRating = 0;
    if (reviews.length > 0) {
      const totalRating = reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      averageRating = totalRating / reviews.length;
    }

    const satisfactionRate = Math.round((averageRating / 5) * 100);
    const totalReviews = reviews.length;

    res.status(200).json({
      totalFreelancers,
      totalProjects,
      satisfactionRate,
      totalReviews,
      averageRating: averageRating.toFixed(1),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
