require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => res.json({ service: "payment-service", status: "ok" }));
app.use("/", paymentRoutes);

connectDB()
  .then(() => {
    const port = process.env.PORT || 4004;
    app.listen(port, () => console.log(`Payment service running on port ${port}`));
  })
  .catch((error) => {
    console.error("Payment service failed to start", error.message);
    process.exit(1);
  });
