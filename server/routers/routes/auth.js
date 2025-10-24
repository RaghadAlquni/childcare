const express = require("express");
const { loginUser } = require("../controller/auth.js")

const router = express.Router();

// تسجيل الدخول
router.post("/login", loginUser);

module.exports = router;