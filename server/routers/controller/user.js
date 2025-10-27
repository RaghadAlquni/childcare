const User = require("../../DB/models/userSchema");
const bcrypt = require("bcrypt");
require("dotenv").config();
const nodemailer = require("nodemailer");
const Child = require("../../DB/models/childrenSchema.js");
const Branch = require("../../DB/models/branchSchema.js");
const mongoose = require("mongoose");


// 📧 إرسال الإيميل للمستخدم الجديد
const sendUserEmail = async (email, tempPassword, fullName) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Childcare System" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "بيانات تسجيل الدخول الخاصة بك",
      html: `
        <div style="direction: rtl; text-align: right; font-family: sans-serif;">
          <h3>مرحبًا ${fullName} 👋</h3>
          <p>تم إنشاء حسابك في نظام الحضانة.</p>
          <p><strong>كلمة المرور المؤقتة:</strong> ${tempPassword}</p>
          <p>الرجاء تسجيل الدخول وتغيير كلمة المرور في أقرب وقت.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("❌ فشل إرسال الإيميل:", error);
  }
};


// ➕ إضافة مستخدم جديد (Admin / Director / Assistant Director)
const addUser = async (req, res) => {
  try {
    const { fullName, email, idNumber, role, branch, shift, phone, gender } = req.body;
    const requestingUser = req.user;

    // تحقق من الحقول الأساسية
    if (!fullName || !email || !idNumber || !role) {
      return res.status(400).json({ message: "❌ الحقول الأساسية مطلوبة" });
    }

    // الأدوار المسموحة
    const validRoles = [
      "admin",
      "director",
      "assistant_director",
      "teacher",
      "assistant_teacher",
      "parent",
    ];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "❌ دور المستخدم غير صالح" });
    }

    // تحقق من عدم تكرار الهوية أو الإيميل
    const existingUser = await User.findOne({
      $or: [{ idNumber }, { email }],
    });
    if (existingUser) {
      return res.status(400).json({ message: "❌ رقم الهوية أو البريد الإلكتروني مستخدم مسبقًا" });
    }

    // السماح فقط لـ admin / director / assistant_director بالإضافة
    if (!["admin", "director", "assistant_director"].includes(requestingUser.role)) {
      return res.status(403).json({ message: "🚫 غير مصرح لك بإضافة مستخدمين" });
    }

    let assignedBranch = null;
    let assignedShift = null;

    // الأدمن يحدد الفرع والشفت يدويًا
    if (requestingUser.role === "admin") {
      if (role !== "admin") {
        if (!branch || !shift) {
          return res.status(400).json({ message: "❌ يجب تحديد الفرع والشفت" });
        }
        assignedBranch = branch;
        assignedShift = shift;
      }
    }

    // المدير والمدير المساعد يتم التوريث منهم
    if (requestingUser.role === "director" || requestingUser.role === "assistant_director") {
      assignedBranch = requestingUser.branch;
      assignedShift = requestingUser.shift;
    }

    // توليد كلمة مرور مؤقتة
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const newUser = new User({
      fullName,
      email,
      idNumber,
      phone,
      gender,
      password: hashedPassword,
      role,
      branch: assignedBranch,
      shift: assignedShift,
      directorId: requestingUser.role === "director" ? requestingUser._id : null,
      assistantDirectorId: requestingUser.role === "assistant_director" ? requestingUser._id : null,
    });

    await newUser.save();

    await sendUserEmail(email, tempPassword, fullName);

    res.status(201).json({
      message: `${role} تمت إضافته بنجاح ✅`,
      user: newUser,
    });
  } catch (error) {
    console.error("❌ Error adding user:", error);
    res.status(500).json({ message: "❌ حدث خطأ أثناء إضافة المستخدم", error: error.message });
  }
};


//  جلب جميع المعلمين الرئيسيين
const getTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" })
      .select("-password")
      .populate("directorId", "fullName email")
      .populate("assistantDirectorId", "fullName email");

    if (!teachers.length)
      return res.status(404).json({ message: "⚠️ لا يوجد معلمين" });

    res.status(200).json({ count: teachers.length, teachers });
  } catch (error) {
    res.status(500).json({ message: "❌ خطأ في جلب المعلمين", error: error.message });
  }
};


// جلب معلم رئيسي واحد
const getTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await User.findOne({ _id: id, role: "teacher" })
      .select("-password")
      .populate("directorId", "fullName email shift role")
      .populate("assistantDirectorId", "fullName email role");

    if (!teacher) return res.status(404).json({ message: "⚠️ المعلم غير موجود" });

    const childrenCount = await Child.countDocuments({ teacherMain: id });

    res.status(200).json({ teacher, childrenCount });
  } catch (error) {
    res.status(500).json({ message: "❌ خطأ في جلب بيانات المعلم", error: error.message });
  }
};


// جلب جميع المعلمين المساعدين
const getAssistantTeachers = async (req, res) => {
  try {
    const assistants = await User.find({ role: "assistant_teacher" })
      .select("-password")
      .populate("directorId", "fullName email")
      .populate("assistantDirectorId", "fullName email")
      .populate("assistantClasses", "className branch shift");

    if (!assistants.length)
      return res.status(404).json({ message: "⚠️ لا يوجد معلمين مساعدين" });

    res.status(200).json({ count: assistants.length, assistants });
  } catch (error) {
    res.status(500).json({ message: "❌ خطأ في جلب المعلمين المساعدين", error: error.message });
  }
};


// جلب معلم مساعد واحد
const getAssistantTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const assistant = await User.findOne({ _id: id, role: "assistant_teacher" })
      .select("-password")
      .populate("assistantClasses", "className branch shift");

    if (!assistant)
      return res.status(404).json({ message: "⚠️ المعلم المساعد غير موجود" });

    res.status(200).json(assistant);
  } catch (error) {
    res.status(500).json({ message: "❌ خطأ في جلب المعلم المساعد", error: error.message });
  }
};


// جلب كل المدراء
const getAllDirectors = async (req, res) => {
  try {
    const directors = await User.find({ role: "director" })
      .select("-password")
      .populate("assistantDirectorId", "fullName email");

    if (!directors.length)
      return res.status(404).json({ message: "⚠️ لا يوجد مديرين" });

    res.status(200).json({ count: directors.length, directors });
  } catch (error) {
    res.status(500).json({ message: "❌ خطأ في جلب المديرين", error: error.message });
  }
};


// جلب مدير واحد
const getDirector = async (req, res) => {
  try {
    const { id } = req.params;
    const director = await User.findOne({ _id: id, role: "director" }).select("-password");

    if (!director)
      return res.status(404).json({ message: "⚠️ المدير غير موجود" });

    res.status(200).json(director);
  } catch (error) {
    res.status(500).json({ message: "❌ خطأ في جلب بيانات المدير", error: error.message });
  }
};


// جلب كل المديرين المساعدين
const getAllAssistantDirectors = async (req, res) => {
  try {
    const assistants = await User.find({ role: "assistant_director" })
      .select("-password")
      .populate("directorId", "fullName email");

    if (!assistants.length)
      return res.status(404).json({ message: "⚠️ لا يوجد مديرين مساعدين" });

    res.status(200).json({ count: assistants.length, assistants });
  } catch (error) {
    res.status(500).json({ message: "❌ خطأ في جلب المديرين المساعدين", error: error.message });
  }
};


// جلب مدير مساعد واحد
const getAssistantDirector = async (req, res) => {
  try {
    const { id } = req.params;
    const assistant = await User.findOne({ _id: id, role: "assistant_director" })
      .select("-password")
      .populate("directorId", "fullName email");

    if (!assistant)
      return res.status(404).json({ message: "⚠️ المدير المساعد غير موجود" });

    res.status(200).json(assistant);
  } catch (error) {
    res.status(500).json({ message: "❌ خطأ في جلب بيانات المدير المساعد", error: error.message });
  }
};


module.exports = {
  addUser,
  getTeachers,
  getTeacher,
  getAssistantTeachers,
  getAssistantTeacher,
  getAllDirectors,
  getDirector,
  getAllAssistantDirectors,
  getAssistantDirector,
};