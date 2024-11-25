// middleware/auth.js

const jwt = require("jsonwebtoken");

// Authentication middleware to verify the token
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(403).send({ message: "Access denied" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
