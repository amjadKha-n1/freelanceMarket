const Message = require("../models/Message");
const Order = require("../models/Order");
const Conversation = require("../models/Conversation");

exports.startConversation = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found!" });
    }
    const isClient = order.client.toString() === loggedInUser._id.toString();
    const isFreelancer =
      order.freelancer.toString() === loggedInUser._id.toString();

    if (!isClient && !isFreelancer) {
      return res
        .status(403)
        .json({ message: "You are not allowed in this order!" });
    }

    let conversation = await Conversation.findOne({ order: orderId });
    if (!conversation) {
      conversation = await Conversation.create({
        members: [order.client, order.freelancer],
        order: orderId,
      });
    }
    res.status(200).json({
      message: conversation.isNew
        ? "Conversation started"
        : "Conversation retrieved",
      conversation: {
        _id: conversation._id,
        members: conversation.members,
        order: conversation.order,
        lastMessage: conversation.lastMessage,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getMyConversations = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const conversations = await Conversation.find({
      members: { $in: [loggedInUser._id] },
    })
      .populate("members", "name email avatar")
      .populate("order", "service title price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: conversations.length,
      conversations,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { conversationId, text, attachments, orderId } = req.body;

    let conversation;

    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
    }

    if (!conversation && orderId) {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found!" });
      }

      const isClient = order.client.toString() === loggedInUser._id.toString();
      const isFreelancer =
        order.freelancer.toString() === loggedInUser._id.toString();

      if (!isClient && !isFreelancer) {
        return res.status(403).json({ message: "Not authorized!" });
      }

      conversation = await Conversation.create({
        members: [order.client, order.freelancer],
        order: orderId,
      });
    }

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found!" });
    }

    if (
      !conversation.members
        .map((m) => m.toString())
        .includes(loggedInUser._id.toString())
    ) {
      return res
        .status(403)
        .json({ message: "Not allowed in this conversation!" });
    }

    const message = await Message.create({
      conversation: conversation._id,
      sender: loggedInUser._id,
      text: text || "",
      attachments: attachments || [],
    });

    conversation.lastMessage = text || "";
    await conversation.save();

    res.status(201).json({
      message: "Message sent successfully!",
      data: message,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getMessage = async (req, res) => {
  try {
    const loggedInUser = req.user;
    if (!loggedInUser) {
      return res.status(401).json({ message: "User not logged In!" });
    }
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found! " });
    }
    if (
      !conversation.members
        .map((member) => member.toString())
        .includes(loggedInUser._id.toString())
    ) {
      return res
        .status(403)
        .json({ message: "Not allowed in this conversation!" });
    }

    const messages = await Message.find({ conversation: conversationId })
      .sort({ createdAt: 1 })
      .populate("sender", "name email");
    res.status(200).json({
      count: messages.length,
      messages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
