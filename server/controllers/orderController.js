const User = require("../models/User");
const Service = require("../models/Service");
const Order = require("../models/Order");

const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.createOrder = async (req, res) => {
  try {
    const { serviceId } = req.body;
    const loggedInUser = req.user;

    if (!loggedInUser) {
      return res.status(400).json({ message: "User not logged in!" });
    }

    const user = await User.findById(loggedInUser._id);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found!" });
    }

    const deadlineDate = new Date();
    deadlineDate.setDate(deadlineDate.getDate() + service.deliveryTime);

    const order = new Order({
      service: serviceId,
      client: user._id,
      freelancer: service.freelancer,
      price: service.price,
      deadline: deadlineDate,
      status: "pending",
      paymentStatus: "unpaid",
    });
    await order.save();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: service.title,
            },
            unit_amount: service.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",

      metadata: {
        orderId: order._id.toString(),
      },
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    order.stripeSessionId = session.id;
    await order.save();

    res.status(200).json({
      message: "order created, process to payment",

      checkoutUrl: session.url,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const loggedInUser = req.user;
    if (!loggedInUser) {
      return res.status(400).json({ message: "User not logged in!" });
    }
    const orders = await Order.find({ client: loggedInUser._id })
      .populate("service")
      .populate("freelancer", "email name");
    if (orders.length === 0) {
      return res.status(404).json({ message: "User don't have any orders! " });
    }
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found!" });
    }
    res.status(200).json({
      order,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getFreelancerOrders = async (req, res) => {
  try {
    const loggedInFreelancer = req.user;
    if (!loggedInFreelancer) {
      return res.status(400).json({ message: "User not logged in!" });
    }
    const orders = await Order.find({
      freelancer: loggedInFreelancer._id,
    }).populate("service");
    if (orders.length === 0) {
      return res
        .status(404)
        .json({ message: "Freelancer don't have any orders yet!" });
    }
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.orderStatus = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { status } = req.body;
    const loggedInUser = req.user;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found! " });
    }
    if (order.freelancer.toString() !== loggedInUser._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only update your own orders!" });
    }
    const validTransitions = {
      pending: ["in-progress", "cancelled"],
      "in-progress": ["delivered", "cancelled"],
      delivered: ["completed"],
      completed: [],
      cancelled: [],
    };

    if (!validTransitions[order.status].includes(status)) {
      return res
        .status(400)
        .json({
          message: `Cannot Transition from ${order.status} to ${status}`,
        });
    }
    order.status = status;

    if (status === "delivered" && req.file) {
      order.deliveryFile = req.file.path;
    }
    await order.save();
    res.status(200).json({
      message: `Order Status updated to ${status}`,
      order: {
        _id: order._id,
        status: order.status,
        deliveryFile: order.deliveryFile,
        updatedAt: order.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.clientOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { status } = req.body;
    const loggedInUser = req.user;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found!" });
    }

    if (order.client.toString() !== loggedInUser._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only update your own orders!" });
    }

    const validClientTransitions = {
      delivered: ["completed"],
      pending: ["cancelled"],
      "in-progress": ["cancelled"],
    };
    if (!validClientTransitions[order.status].includes(status)) {
      return res
        .status(400)
        .json({
          message: `Cannot Transition from ${order.status} to ${status}`,
        });
    }
    order.status = status;
    await order.save();

    res.status(200).json({
      message: `Order status updated to ${status}`,
      order: {
        _id: order._id,
        status: order.status,
        updatedAt: order.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.calculateEarnings = async (req, res) => {
  try {
    const loggedInFreelancer = req.user;
    if (!loggedInFreelancer) {
      return res.status(400).json({ message: "User not logged in!" });
    }
    const freelancer = await User.findById(loggedInFreelancer._id);
    if (!freelancer) {
      return res.status(404).json({ message: "Freelancer not found!" });
    }
    const orders = await Order.find({
      freelancer: loggedInFreelancer._id,
      paymentStatus: "paid",
    });
    if (orders.length === 0) {
      return res.status(200).json({
        totalEarnings: 0,
        pendingEarnings: 0,
        availableEarnings: 0,
        withdrawnEarnings: 0,
      });
    }
    const COMMISSION_RATE = 0.2;
    let totalEarnings = 0;
    let pendingEarnings = 0;
    let availableEarnings = 0;
    orders.forEach((order) => {
      const netAmount = order.price * (1 - COMMISSION_RATE);
      totalEarnings += netAmount;

      if (order.status === "in-progress" || order.status === "delivered") {
        pendingEarnings += netAmount;
      }
      if (order.status === "completed") {
        availableEarnings += netAmount;
      }
    });
    const withdrawnEarnings = 0;
    res.status(200).json({
      totalEarnings,
      pendingEarnings,
      availableEarnings,
      withdrawnEarnings,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
