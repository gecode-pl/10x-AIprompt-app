const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    req.user = decoded;
    console.log('req.user after assignment:', req.user);
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(403).json({ message: "Invalid token" });
  }
}

module.exports = authMiddleware;
