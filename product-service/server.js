require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => res.json({ service: "product-service", status: "ok" }));
app.use("/", productRoutes);

connectDB()
  .then(() => {
    const port = process.env.PORT || 4002;
    app.listen(port, () => console.log(`Product service running on port ${port}`));
  })
  .catch((error) => {
    console.error("Product service failed to start", error.message);
    process.exit(1);
  });
