const express = require("express");
const controller = require("../controllers/orderController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", auth, controller.createOrder);
router.get("/", auth, controller.getMyOrders);
router.get("/admin/all", auth, controller.getAllOrders);
router.get("/:id", auth, controller.getOrderById);

module.exports = router;
