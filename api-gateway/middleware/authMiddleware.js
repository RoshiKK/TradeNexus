const jwt = require("jsonwebtoken");

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return next();

  const token = authHeader.split(" ")[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ message: "Invalid token at gateway" });
  }
  return next();
};

const requireAuth = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Authentication required" });
  return next();
};

module.exports = { optionalAuth, requireAuth };
