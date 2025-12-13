"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function Career() {
  const [form, setForm] = useState({
    phone: "",
    email: "",
    name: "",
    degree: "",
    major: "",
  });

  const [cvFile, setCvFile] = useState(null);
  const [errors, setErrors] = useState({});

  // تحديث قيم الحقول
  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // رفع السيرة
  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setErrors((prev) => ({ ...prev, cv: "الرجاء رفع ملف PDF فقط." }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, cv: "الحد الأقصى 5MB فقط." }));
      return;
    }

    setErrors((prev) => ({ ...prev, cv: "" }));
    setCvFile(file);
  }

function validateForm() {
  let newErrors = {};

 // رقم الجوال (أرقام فقط)
const phoneRegex = /^[0-9]{8,15}$/;

if (!form.phone.trim()) {
  newErrors.phone = "يرجى إدخال رقم الجوال.";
} else if (!phoneRegex.test(form.phone)) {
  newErrors.phone = "رقم الجوال يجب أن يحتوي على أرقام فقط.";
}

  // البريد الإلكتروني
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email.trim()) {
    newErrors.email = "يرجى إدخال البريد الإلكتروني.";
  } else if (!emailRegex.test(form.email)) {
    newErrors.email = "صيغة البريد الإلكتروني غير صحيحة.";
  }

  // الاسم
  if (!form.name.trim()) newErrors.name = "يرجى إدخال الاسم.";

  // المؤهل الدراسي
  if (!form.degree.trim()) newErrors.degree = "يرجى اختيار المؤهل الدراسي.";

  // التخصص  
  if (!form.major.trim()) newErrors.major = "يرجى إدخال التخصص الدراسي.";

  // السيرة الذاتية
  if (!cvFile) newErrors.cv = "يرجى رفع السيرة الذاتية.";

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
}

  // عند الضغط على إرسال
  async function handleSubmit() {
    if (!validateForm()) return;

toast.success("تم إرسال الطلب بنجاح ✨", {
  icon: "👏",
});  }

  return (
    <div
  dir="rtl"
  className="w-full flex flex-col lg:flex-row items-start justify-between gap-10 px-4 md:px-10 py-10 pt-[180px]"
>

      {/* ====== العنوان ====== */}
      <div className="w-full lg:w-[35%] flex flex-col gap-4 lg:mt-50 text-right">
        <h1 className="text-[38px] md:text-[44px] font-bold text-[#282828] leading-tight">
          التوظيف
        </h1>

        <p className="text-[20px] md:text-[22px] leading-[1.6] text-[#484848]">
          كُن جزءًا من فريق واحة المعرفة لحضانة الأطفال وشاركنا سيرتك الذاتية
        </p>
      </div>

      {/* ====== الفورم داخل خلفية ====== */}
      <div className="w-full lg:w-[60%] bg-white rounded-[20px] p-5 md:p-8 shadow-sm border border-[#eeeeee]">
        <div className="flex flex-col gap-6">

  {/* ---------------- الصف الأول (الاسم + رقم الجوال) ---------------- */}
  <div className="flex flex-col md:flex-row gap-5">

    {/* الاسم الرباعي */}
    <div className="w-full flex flex-col gap-2">
      <label className="text-[15px] font-medium">
        الاسم الرباعي <span className="text-red-500">*</span>
      </label>

      <input
        type="text"
        placeholder="الاسم الرباعي"
        className="h-[50px] bg-[#f5f5f5] border border-[#ddd] rounded-[10px] px-4 text-right"
        value={form.name}
        onChange={(e) => updateField("name", e.target.value)}
      />

      {errors.name && (
        <span className="text-red-500 text-sm">{errors.name}</span>
      )}
    </div>

    {/* رقم الجوال */}
    <div className="w-full flex flex-col gap-2">
      <label className="text-[15px] font-medium">
        رقم الجوال <span className="text-red-500">*</span>
      </label>

      <input
        type="text"
        placeholder="05****"
        className="h-[50px] bg-[#f5f5f5] border border-[#ddd] rounded-[10px] px-4 text-right"
        value={form.phone}
        onChange={(e) => updateField("phone", e.target.value)}
      />

      {errors.phone && (
        <span className="text-red-500 text-sm">{errors.phone}</span>
      )}
    </div>
  </div>

  {/* ---------------- الصف الثاني (البريد + المؤهل) ---------------- */}
  <div className="flex flex-col md:flex-row gap-5">

    {/* البريد الإلكتروني */}
    <div className="w-full flex flex-col gap-2">
      <label className="text-[15px] font-medium">
        البريد الإلكتروني <span className="text-red-500">*</span>
      </label>

      <input
        type="email"
        placeholder="البريد الإلكتروني"
        className="h-[50px] bg-[#f5f5f5] border border-[#ddd] rounded-[10px] px-4 text-right"
        value={form.email}
        onChange={(e) => updateField("email", e.target.value)}
      />

      {errors.email && (
        <span className="text-red-500 text-sm">{errors.email}</span>
      )}
    </div>

    {/* المؤهل الدراسي */}
    <div className="w-full flex flex-col gap-2">
      <label className="text-[15px] font-medium">
        المؤهل الدراسي <span className="text-red-500">*</span>
      </label>

      <select
        className="
          h-[50px]
          bg-[#f5f5f5]
          border border-[#ddd]
          rounded-[10px]
          px-3
          text-right
          cursor-pointer
        "
        value={form.degree}
        onChange={(e) => updateField("degree", e.target.value)}
      >
        <option value="">المؤهل الدراسي</option>
        <option value="ثانوي">ثانوي</option>
        <option value="دبلوم">دبلوم</option>
        <option value="بكالوريوس">بكالوريوس</option>
        <option value="ماجستير">ماجستير</option>
        <option value="دكتوراه">دكتوراه</option>
        <option value="أخرى">أخرى</option>
      </select>

      {errors.degree && (
        <span className="text-red-500 text-sm">{errors.degree}</span>
      )}
    </div>
  </div>

  {/* ---------------- الصف الثالث (التخصص الدراسي) ---------------- */}
  <div className="flex flex-col gap-2">
    <label className="text-[15px] font-medium">
      التخصص الدراسي <span className="text-red-500">*</span>
    </label>

    <input
      type="text"
      placeholder="التخصص الدراسي"
      className="h-[50px] bg-[#f5f5f5] border border-[#ddd] rounded-[10px] px-4 text-right"
      value={form.major}
      onChange={(e) => updateField("major", e.target.value)}
    />

    {errors.major && (
      <span className="text-red-500 text-sm">{errors.major}</span>
    )}
  </div>

  {/* ---------------- رفع السيرة ---------------- */}
  <div className="flex flex-col gap-2">
    <label className="text-[15px] font-medium">
      أرفق السيرة الذاتية <span className="text-red-500">*</span>
    </label>

    <label
      htmlFor="cvUpload"
      className="
        h-[120px]
        bg-[#f5f5f5]
        border border-dashed border-[#ccc]
        rounded-[12px]
        flex flex-col items-center justify-center gap-2
        cursor-pointer
        hover:bg-[#eee]
        transition
      "
    >
      <p className="text-[14px] font-semibold">اضغط هنا لرفع ملف</p>
      <p className="text-[12px] text-[#777]">PDF — الحد 5MB</p>
    </label>

    <input
      id="cvUpload"
      type="file"
      accept="application/pdf"
      className="hidden"
      onChange={handleFileUpload}
    />

    {errors.cv && (
      <span className="text-red-500 text-sm">{errors.cv}</span>
    )}

    {cvFile && (
      <span className="text-green-600 text-sm">
        ✔ تم رفع الملف: {cvFile.name}
      </span>
    )}
  </div>

  {/* ---------------- زر الإرسال (الكلام بالنص) ---------------- */}
  <button
    onClick={handleSubmit}
    className="
      bg-[#F9B236]
      w-full
      text-white
      py-3
      rounded-[10px]
      text-lg
      font-semibold
      hover:bg-[#e6a22f]
      transition
      text-center       /* ← يثبت النص بالنص */
      flex
      flex
    justify-center
    items-center
    "
  >
    إرسال الطلب
  </button>
</div>
      </div>
    </div>
  );
}