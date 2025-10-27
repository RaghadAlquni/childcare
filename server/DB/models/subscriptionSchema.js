const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  name: { type: String, required: true }, // اسم الباقة
  price: { type: Number, required: true }, // السعر
  description: { type: String },
  duration: { type: String }, // مثلاً: "شهري" أو "فصلي"

  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true
  },
  shift: {
    type: String,
    enum: ["صباح", "مساء"],
    required: true
  },

  isActive: { type: Boolean, default: true } // حالة التفعيل
}, { timestamps: true });

module.exports = mongoose.model("Subscription", subscriptionSchema);