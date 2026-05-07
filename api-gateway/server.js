require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const setupProxyRoutes = require("./routes/proxyRoutes");

const app = express();
app.use(cors());
app.use(morgan("combined"));

// Setup proxy routes BEFORE body parser
setupProxyRoutes(app);

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    service: "api-gateway",
    status: "ok",
    timestamp: new Date().toISOString()
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API Gateway running on port ${port}`));
