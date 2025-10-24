const jwt = require("jsonwebtoken");
require('dotenv').config();

// هذا التوكن اللي طلع لك من اللوغن
const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGZhOThkM2QwZmI2MjU5ZWQ1NzU0OWUiLCJmdWxsTmFtZSI6IlJhZ2hhZCBBbHF1bmkiLCJyb2xlIjoiYWRtaW4iLCJzaGlmdCI6bnVsbCwiaWF0IjoxNzYxMjY1ODkwLCJleHAiOjE3NjEyODc0OTB9._UalzZLNjkWNIklM3VPGi__mF8prhfCzJ8Zleam9g8s";

// الطباعة للتأكد من الـ secret
console.log("Current JWT_SECRET:", process.env.JWT_SECRET);

try {
  const decoded = jwt.verify(testToken, process.env.JWT_SECRET);
  console.log("Token is valid! Decoded payload:", decoded);
} catch (err) {
  console.error("Token verification failed:", err.message);
}