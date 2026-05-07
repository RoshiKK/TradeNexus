const axios = require("axios");
const Order = require("../models/Order");

const progressOrderStatus = (orderId) => {
  setTimeout(async () => {
    await Order.findByIdAndUpdate(orderId, { status: "Shipped" });
  }, 15000);

  setTimeout(async () => {
    await Order.findByIdAndUpdate(orderId, { status: "Delivered" });
  }, 30000);
};

exports.createOrder = async (req, res) => {
  try {
    const { productId, quantity = 1, forcePaymentFail = false } = req.body;
    const userId = req.user.id;

    const productRes = await axios.get(`${process.env.PRODUCT_SERVICE_URL}/${productId}`);
    const product = productRes.data;

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    const order = await Order.create({
      userId,
      productId,
      quantity,
      unitPrice: product.price,
      totalPrice: product.price * quantity
    });

    let paymentStatus = "failed";
    let paymentId = "";
    try {
      const paymentRes = await axios.post(`${process.env.PAYMENT_SERVICE_URL}/process`, {
        orderId: order._id.toString(),
        userId,
        amount: order.totalPrice,
        forceFail: forcePaymentFail
      });
      paymentStatus = paymentRes.data.status;
      paymentId = paymentRes.data.paymentId;
    } catch (error) {
      paymentStatus = "failed";
    }

    order.paymentStatus = paymentStatus;
    order.paymentId = paymentId;
    if (paymentStatus === "failed") order.status = "Cancelled";
    await order.save();

    if (paymentStatus === "success") progressOrderStatus(order._id);

    return res.status(201).json(order);
  } catch (error) {
    return res.status(500).json({ message: "Order creation failed", error: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
  return res.json(orders);
};

exports.getOrderById = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
  if (!order) return res.status(404).json({ message: "Order not found" });
  return res.json(order);
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch all orders", error: error.message });
  }
};
