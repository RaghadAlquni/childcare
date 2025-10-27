const mongoose = require("mongoose");

const classroomSchema = new mongoose.Schema({
  className: { type: String, required: true }, // مثال: فصل التمهيدي أو KG1
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
  },
  shift: {
    type: String,
    enum: ["صباح", "مساء"],
    required: true,
  },
  teacherMain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // عشان كل معلم له فصل واحد فقط
  },
  teacherAssistants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}],
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Child",
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("Classroom", classroomSchema);