const Payment = require("../models/Payment");

exports.processPayment = async (req, res) => {
  const { orderId, userId, amount, forceFail = false } = req.body;
  const randomFail = false;
  const failed = forceFail || randomFail;

  const payment = await Payment.create({
    orderId,
    userId,
    amount,
    status: failed ? "failed" : "success",
    reason: failed ? "Simulated failure" : ""
  });

  return res.json({
    paymentId: payment._id,
    status: payment.status,
    reason: payment.reason
  });
};

exports.getPaymentByOrder = async (req, res) => {
  const payment = await Payment.findOne({ orderId: req.params.orderId }).sort({ createdAt: -1 });
  if (!payment) return res.status(404).json({ message: "Payment not found" });
  return res.json(payment);
};
