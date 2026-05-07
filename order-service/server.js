require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => res.json({ service: "order-service", status: "ok" }));
app.use("/", orderRoutes);

connectDB()
  .then(() => {
    const port = process.env.PORT || 4003;
    app.listen(port, () => console.log(`Order service running on port ${port}`));
  })
  .catch((error) => {
    console.error("Order service failed to start", error.message);
    process.exit(1);
  });
