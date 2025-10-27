const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ["شهري", "أسبوعي", "ترم", "صيفي", "سنوي"], 
  },
  price: { type: Number, required: true },
  ageRange: {
    from: { type: Number, required: true },
    to: { type: Number, required: true },
  },
  durationType: {
    type: String,
    enum: ["شهر", "أسبوع", "ترم", "سنة"],
    required: true,
  },
  description: { type: String, default: "" },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    default: null,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Subscription", subscriptionSchema);