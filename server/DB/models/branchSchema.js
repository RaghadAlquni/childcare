const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
  branchName: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  district: { type: String, required: true, trim: true },
  locationLink: { type: String, required: true },
  branchImg: {type: String,   default: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-05/aK9FMXdUq7.png" },
  images: [{ type: String }],

  workingHours: [
    {
      days: { type: String, required: true },
      from: { type: String, required: true },
      to: { type: String, required: true },
    },
  ],

  contactNumber: { type: String, required: true },

  ageRange: {
    from: { type: String, required: true },
    to: { type: String, required: true },
  }, // الفئة العمرية

  services: [
    {
      type: String,
      enum: [
        "مركز تنموي لتطوير مهارات الطفل",
        "بيئة مهيئة للعب والتعلم",
        "الدراسة وفق منهج القاعدة النورانية",
        "يشمل المنهج برنامج اللغة الانجليزية",
        "استقبال الأطفال"
      ],
    },
  ],

  status: {
    type: String,
    enum: ["نشط", "غير نشط"],
    default: "نشط"
  },
  
  directors: [
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    shift: { type: String, enum: ["صباح", "مساء"], required: false }
  }
],
  assistant_directors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: null}],
  teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: null}],
  assistant_teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: null}],

}, 
{ timestamps: true });

module.exports = mongoose.model("Branch", branchSchema);