const express = require("express");
const controller = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/profile", auth, controller.getProfile);
router.put("/profile", auth, controller.updateProfile);

// Admin routes
router.get("/admin/all-users",   auth, controller.getAllUsers);
router.get("/admin/all-orders",  auth, controller.getAllOrders);

module.exports = router;

