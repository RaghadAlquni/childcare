// DB/models/childrenSchema.js
const mongoose = require("mongoose");

const childrenSchema = new mongoose.Schema({
  childName: { type: String, required: true, trim: true }, 
  idNumber: { type: Number, required: true, unique: true }, // خلي الهوية فريدة بدل الاسم
  dateOfBirth: { type: Date, required: true },

  gender: {
    type: String,
    enum: ["بنت", "ولد"],
    required: true
  },

  guardian: [{
    guardianName: { type: String, required: true },
    relationship: { type: String, required: true },
    phoneNumber: { type: String, required: true },
  }],

  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true
  },

  status: {
    type: String,
    enum: ["مضاف", "مؤكد", "غير مفعل"],
    default: "مضاف" // ✅ تصحيح spelling
  },

  classroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Classroom",
    default: null,   // لازم يصير اختياري عشان إضافة وليّ الأمر بدون فصل/معلم
  },

  teacherMain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,   // نفس السبب
  },
  subscription: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Subscription",
  required: false,
},
subscriptionEnd: { type: Date },

  shift: { type: String, enum: ["صباح", "مساء"], required: true },
}, {
  timestamps: { createdAt: "submittedAt", updatedAt: "updatedAt" } // ✅ تصحيح updatedAt
});



module.exports = mongoose.model("Children", childrenSchema);