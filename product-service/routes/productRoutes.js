const express = require("express");
const controller = require("../controllers/productController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", controller.getAllProducts);
router.get("/:id", controller.getProductById);
router.post("/", auth, controller.createProduct);
router.put("/:id", auth, controller.updateProduct);
router.delete("/:id", auth, controller.deleteProduct);

module.exports = router;
