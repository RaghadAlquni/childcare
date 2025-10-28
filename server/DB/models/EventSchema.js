const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    // موضوع أو عنوان الخبر
    title: { type: String, required: true },
    
    // صورة العرض الأساسية للخبر (تظهر بالكروت أو الصفحة الرئيسية)
    coverImage: { type: String, required: true },

    // التاريخ الفعلي لحفظه للفرز أو الترتيب الزمني
    date: { type: Date, default: Date.now },

    // التفاصيل الكاملة للخبر أو الحدث
    description: { type: String, required: true },

    // صور إضافية للخبر (قائمة صور)
    gallery: [{ type: String }],

    // نوع الخبر (إما حدث أو خبر)
    type: {
      type: String,
      enum: ["event", "news"],
      required: true,
    },
  },
  {
    timestamps: true, // يضيف createdAt و updatedAt تلقائيًا
  }
);

module.exports = mongoose.model("Event", eventSchema);