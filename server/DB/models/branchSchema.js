const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
  branchName: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  district: { type: String, required: true, trim: true },
  locationLink: { type: String, required: true },
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
}, 
{ timestamps: true });

module.exports = mongoose.model("Branch", branchSchema);