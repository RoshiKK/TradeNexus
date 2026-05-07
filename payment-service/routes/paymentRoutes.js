const express = require("express");
const controller = require("../controllers/paymentController");

const router = express.Router();

router.post("/process", controller.processPayment);
router.get("/order/:orderId", controller.getPaymentByOrder);

module.exports = router;
