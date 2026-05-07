const { createProxyMiddleware } = require("http-proxy-middleware");
const services = require("../config/services");
const { optionalAuth, requireAuth } = require("../middleware/authMiddleware");

const withProxy = (target, prefix) =>
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: { [`^${prefix}`]: "" },
    on: {
      proxyReq(proxyReq, req) {
        if (req.headers.authorization) {
          proxyReq.setHeader("Authorization", req.headers.authorization);
        }
      }
    }
  });

module.exports = (app) => {
  app.use(optionalAuth);

  app.use("/api/users", withProxy(services.user, "/api/users"));
  app.use("/api/products", withProxy(services.product, "/api/products"));
  app.use("/api/payments", requireAuth, withProxy(services.payment, "/api/payments"));
  app.use("/api/orders", requireAuth, withProxy(services.order, "/api/orders"));
};
