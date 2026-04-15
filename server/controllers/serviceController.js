const Service = require("../models/Service");
const User = require("../models/User");

exports.getMyServices = async (req, res) => {
  try {
    const freelancerId = req.user._id;
    const services = await Service.find({ freelancer: freelancerId });
    if (services.length === 0) {
      return res.status(200).json({
        message: "You haven't created any services yet",
        services: [],
      });
    }
    res.status(200).json({
      count: services.length,
      services,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.createService = async (req, res) => {
  try {
    const loggedInUser = req.user;
    if (!loggedInUser) {
      return res.status(400).json({ message: "User not logged in! " });
    }
    const user = await User.findById(loggedInUser._id);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    const service = await Service.create({
      freelancer: loggedInUser._id,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      deliveryTime: req.body.deliveryTime,
    });
    res.status(201).json({
      service,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find().populate(
      "freelancer",
      "name email skills"
    );
    if (services.length === 0) {
      return res.status(400).json({ message: "Couldn't find Services!" });
    }

    res.status(200).json({
      services,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSingleService = async (req, res) => {
  try {
    const serviceId = req.params.serviceId;
    const service = await Service.findById(serviceId).populate("freelancer");
    if (!service) {
      return res.status(404).json({ message: "Service not found!" });
    }
    res.status(200).json({
      service,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const serviceId = req.params.serviceId;
    const updateService = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      deliveryTime: req.body.deliveryTime,
    };
    const service = await Service.findByIdAndUpdate(
      serviceId,
      { $set: updateService },
      { returnDocument: "after" }
    );
    if (!service) {
      return res.status(404).json({ message: "Service not found!" });
    }

    res.status(200).json({
      service,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const serviceId = req.params.serviceId;
    const service = await Service.findByIdAndDelete(serviceId);
    res.status(200).json({
      message: "Service deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchServices = async (req, res) => {
  try {
    const {
      q,
      category,
      minPrice,
      maxPrice,
      sortBy,
      page = 1,
      limit = 10,
    } = req.query;

    let searchQuery = {};

    if (q && q.trim() !== "") {
      searchQuery.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ];
    }

    if (category && category !== "all") {
      searchQuery.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    if (minPrice || maxPrice) {
      searchQuery.price = {};
      if (minPrice) searchQuery.price.$gte = Number(minPrice);
      if (maxPrice) searchQuery.price.$lte = Number(maxPrice);
    }

    searchQuery.status = "approved";

    let sortOptions = {};
    switch (sortBy) {
      case "price_asc":
        sortOptions = { price: 1 };
        break;
      case "price_desc":
        sortOptions = { price: -1 };
        break;
      case "rating":
        sortOptions = { rating: -1 };
        break;
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const services = await Service.find(searchQuery)
      .populate("freelancer", "name email avatar rating")
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Service.countDocuments(searchQuery);

    res.status(200).json({
      success: true,
      count: services.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      services,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
