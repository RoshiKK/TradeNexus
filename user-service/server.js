require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => res.json({ service: "user-service", status: "ok" }));
app.use("/", authRoutes);

connectDB()
  .then(() => {
    const port = process.env.PORT || 4001;
    app.listen(port, () => console.log(`User service running on port ${port}`));
  })
  .catch((error) => {
    console.error("User service failed to start", error.message);
    process.exit(1);
  });
