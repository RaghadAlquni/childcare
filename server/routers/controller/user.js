const User = require("../../DB/models/userSchema");
const bcrypt = require("bcrypt");
require('dotenv').config();
const nodemailer = require("nodemailer");

const Child = require("../../DB/models/childrenSchema.js")


// دالة لإرسال البريد للمستخدم الجديد
const sendUserEmail = async (email, tempPassword, fullName) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true إذا كان 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    }
  });

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Your new account has been created",
    text: `Hello ${fullName},\n\nYour account has been created.\nYour temporary password is: ${tempPassword}\nPlease log in and change your password immediately.\n\nThank you!`
  };

  await transporter.sendMail(mailOptions);
};


// إضافة Admin أو Director (Admin فقط)
const addUserByAdmin = async (req, res) => {
  try {
    const { fullName, email, idNumber, role, shift } = req.body;
    const requestingUser = req.user;

    // التحقق من الحقول المطلوبة
    if (!fullName || !email || !idNumber || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // التحقق من الدور
    if (!["admin", "director"].includes(role)) {
      return res.status(400).json({ message: "Invalid role for this endpoint" });
    }

    // فقط الـ Admin يمكنه إضافة Admin أو Director
    if (requestingUser.role !== "admin") {
      return res.status(403).json({ message: "Only admin can add admin or director" });
    }

    // إذا الدور Director يجب تحديد shift
    if (role === "director" && !shift) {
      return res.status(400).json({ message: "Shift is required for director" });
    }

    // التحقق إذا idNumber موجود مسبقًا
    const existingUser = await User.findOne({ idNumber });
    if (existingUser) {
      return res.status(400).json({ message: "This idNumber is already registered" });
    }

    // توليد كلمة مرور مؤقتة
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // إنشاء المستخدم الجديد
    const newUser = new User({
      fullName,
      email,
      idNumber,
      password: hashedPassword,
      role,
      shift: role === "director" ? shift : null
    });

    await newUser.save();

    // إرسال البريد
    await sendUserEmail(email, tempPassword, fullName);

    res.status(201).json({ message: `${role} added successfully`, user: newUser });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding user", error: error.message });
  }
};


// إضافة Assistant Director
const addAssistantDirector = async (req, res) => {
  try {
    const { fullName, email, idNumber, shift, directorId } = req.body;
    const requestingUser = req.user;

    // التحقق من الحقول المطلوبة
    if (!fullName || !email || !idNumber) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // فقط Admin أو Director يمكنهم إضافة مساعد مدير
    if (!["admin", "director"].includes(requestingUser.role)) {
      return res.status(403).json({ message: "Only admin or director can add assistant director" });
    }

    // التحقق إذا idNumber موجود مسبقًا
    const existingUser = await User.findOne({ idNumber });
    if (existingUser) {
      return res.status(400).json({ message: "This idNumber is already registered" });
    }

    // تحديد directorId و shift بناءً على من يضيف
    const assignedDirectorId = requestingUser.role === "admin" ? directorId : requestingUser._id;
    const assignedShift = requestingUser.role === "admin" ? shift : requestingUser.shift;

    if (!assignedDirectorId) {
      return res.status(400).json({ message: "Director ID is required" });
    }

    if (!assignedShift) {
      return res.status(400).json({ message: "Shift is required" });
    }

    // توليد كلمة مرور مؤقتة
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // إنشاء المستخدم الجديد
    const newUser = new User({
      fullName,
      email,
      idNumber,
      password: hashedPassword,
      role: "assistant_director",
      shift: assignedShift,
      directorId: assignedDirectorId
    });

    await newUser.save();

    // إرسال البريد
    await sendUserEmail(email, tempPassword, fullName);

    res.status(201).json({ message: "Assistant Director added successfully", user: newUser });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding assistant director", error: error.message });
  }
};

const addTeacher = async (req, res) => {
  try {
    const { fullName, email, idNumber, directorId, shift } = req.body;
    const requestingUser = req.user;

    // التحقق من الحقول المطلوبة
    if (!fullName || !email || !idNumber) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!["admin", "director"].includes(requestingUser.role)) {
      return res.status(403).json({ message: "You do not have permission to add teachers" });
    }

    // التحقق من idNumber
    const existingUser = await User.findOne({ idNumber });
    if (existingUser) {
      return res.status(400).json({ message: "This idNumber is already registered" });
    }

    let assignedDirectorId, assignedShift, assignedAssistantDirectorId = null;

    if (requestingUser.role === "admin") {
      assignedDirectorId = directorId;
      assignedShift = shift;

      // إيجاد أول مساعد مدير لهذا المدير (إذا موجود)
      const assistantDirector = await User.findOne({
        directorId: assignedDirectorId,
        role: "assistant_director"
      });
      if (assistantDirector) assignedAssistantDirectorId = assistantDirector._id;

    } else if (requestingUser.role === "director") {
      assignedDirectorId = requestingUser._id;
      assignedShift = requestingUser.shift;

      const assistantDirector = await User.findOne({
        directorId: requestingUser._id,
        role: "assistant_director"
      });
      if (assistantDirector) assignedAssistantDirectorId = assistantDirector._id;
    }

    if (!assignedShift) return res.status(400).json({ message: "Shift is required" });
    if (!assignedDirectorId) return res.status(400).json({ message: "Director ID is required" });

    // توليد كلمة مرور مؤقتة
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const newUser = new User({
      fullName,
      email,
      idNumber,
      password: hashedPassword,
      role: "teacher",
      shift: assignedShift,
      directorId: assignedDirectorId,
      assistantDirectorId: assignedAssistantDirectorId
    });

    await newUser.save();

    // إرسال البريد
    await sendUserEmail(email, tempPassword, fullName);

    res.status(201).json({ message: "Teacher added successfully", user: newUser });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding teacher", error: error.message });
  }
};


const getAllDirectors = async (req, res) => {
  try {
    const directors = await User.find({ role: "director" })
      .select("-password")
      .populate("shift")
      .populate("assistantDirectorId", "fullName email");

    if (!directors.length) {
      return res.status(404).json({ message: "No directors found" });
    }

    res.status(200).json({
      count: directors.length,
      directors,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching directors",
      error: error.message,
    });
  }
};

const getDirector = async (req, res) => {
  try {
    const { id, idNumber } = req.params; // أو req.query
    let director;

    if (id) director = await User.findById(id);
    else if (idNumber) director = await User.findOne({ idNumber });

    if (!director || director.role !== "director") {
      return res.status(404).json({ message: "Director not found" });
    }

    res.status(200).json(director);
  } catch (error) {
    res.status(500).json({ message: "Error fetching director", error: error.message });
  }
};

const getAllAssistantDirectors = async (req, res) => {
  try {
    const assistants = await User.find({ role: "assistant_director" });
    res.status(200).json(assistants);
  } catch (error) {
    res.status(500).json({ message: "Error fetching assistant directors", error: error.message });
  }
};

const getAssistantDirector = async (req, res) => {
  try {
    const { id } = req.params;
    const requestingUser = req.user;

    const assistant = await User.findById(id);

    if (!assistant || assistant.role !== "assistant_director") {
      return res.status(404).json({ message: "Assistant Director not found" });
    }

    // إذا المدير هو اللي يطلب، لازم يكون هذا المساعد يتبعه فعلاً
    if (
      requestingUser.role === "director" &&
      String(assistant.directorId) !== String(requestingUser._id)
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to view this assistant director" });
    }

    res.status(200).json(assistant);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching assistant director", error: error.message });
  }
};


// جلب جميع المعلمين
const getTeachers = async (req, res) => {
  try {
    // نحصل فقط على المستخدمين اللي دورهم teacher
    const teachers = await User.find({ role: "teacher" })
      .select("-password") // نستبعد الباسوورد من النتائج
      .populate("directorId", "fullName email")
      .populate("assistantDirectorId", "fullName email");

    if (!teachers.length) {
      return res.status(404).json({ message: "No teachers found" });
    }

    res.status(200).json({
      count: teachers.length,
      teachers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching teachers",
      error: error.message,
    });
  }
};

const getTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    // نجيب المعلم مع المدير والمدير العام
    const teacher = await User.findOne({ _id: id, role: "teacher" })
      .select("-password")
      .populate("directorId", "fullName email shift role")
      .populate("assistantDirectorId", "fullName email role");

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // نحسب عدد الأطفال اللي عنده
    const childrenCount = await Child.countDocuments({ teacherId: id });

    res.status(200).json({
      teacher,
      childrenCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching teacher details",
      error: error.message,
    });
  }
};

module.exports = {
addUserByAdmin,
addAssistantDirector,
addTeacher,
getAllDirectors,
getDirector,
getAllAssistantDirectors,
getAssistantDirector,
getTeachers,
getTeacher,
};