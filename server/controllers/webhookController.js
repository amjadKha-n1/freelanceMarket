const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const Order = require("../models/Order");

exports.handleWebhook = async (req, res) => {
  try {
    const event = req.body;

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const orderId = session.metadata.orderId;
      const order = await Order.findById(orderId);
      if (!order) {
        console.log("Order not found! ");
        return res.status(404).json({ message: "Order not found!" });
      }

      order.paymentStatus = "paid";
      (order.status = "in-progress"), console.log("✅ Order marked as paid");
      await order.save();
    }

    res.status(200).json({
      recived: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Webhook error");
  }
};
