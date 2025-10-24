const User = require("../../DB/models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();

// Login for all Users
const loginUser = async (req, res) => {
  try {
    const { idNumber, password } = req.body;

    if (!idNumber || !password) {
      return res.status(400).json({ message: "Please provide idNumber and password" });
    }

    // البحث عن المستخدم حسب idNumber
    const user = await User.findOne({ idNumber });
    if (!user) {
      return res.status(401).json({ message: "Invalid idNumber or password" });
    }

    // التحقق من كلمة المرور
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid idNumber or password" });
    }

    // إنشاء JWT
    const token = jwt.sign(
      {
        _id: user._id,
        fullName: user.fullName,
        role: user.role,
        shift: user.shift
      },
      process.env.JWT_SECRET, // يجب أن تكون موجودة في .env
      { expiresIn: "6h" } // مدة صلاحية التوكن
    );

    res.status(200).json({ message: "Login successful", token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
}


module.exports = { loginUser }