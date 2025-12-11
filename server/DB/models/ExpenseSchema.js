const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      enum: [
        "رواتب",
        "إيجار",
        "فواتير",
        "مواد تعليمية",
        "صيانة",
        "تسويق",
        "أخرى",
      ],
      default: "أخرى",
    },

    description: {
      type: String,
      trim: true,
    },

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

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// 👇 أهم خطوة تمنع الخطأ
module.exports = mongoose.models.Expense || mongoose.model("Expense", expenseSchema);
