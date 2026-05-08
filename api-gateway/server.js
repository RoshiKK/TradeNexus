require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const morgan = require("morgan");
const setupProxyRoutes = require("./routes/proxyRoutes");

const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(morgan("combined"));

setupProxyRoutes(app);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>TradeNexus API Gateway is Online</h1><p>This is the backend for the TradeNexus Distributed System. Please visit the frontend on Vercel to use the application.</p>");
});

app.get("/health", (req, res) => {
  res.json({
    service: "api-gateway",
    status: "ok",
    timestamp: new Date().toISOString()
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API Gateway running on port ${port}`));
