// يتحقق من هوية الي مسجل دخول
const jwt = require("jsonwebtoken");
const User = require("../../DB/models/userSchema.js")
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const authentication = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token", error: error.message });
  }
};

module.exports = authentication;