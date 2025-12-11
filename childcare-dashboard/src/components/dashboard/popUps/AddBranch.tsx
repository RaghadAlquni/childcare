"use client";

import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";


interface AddBranchPopupProps {
  open: boolean;
  onClose: () => void;
  onAdded: () => void;
}

const servicesList = [
  "مركز تنموي لتطوير مهارات الطفل",
  "بيئة مهيئة للعب والتعلم",
  "الدراسة وفق منهج القاعدة النورانية",
  "يشمل المنهج برنامج اللغة الانجليزية",
  "استقبال الأطفال",
];

export default function AddBranchPopup({ open, onClose, onAdded }: AddBranchPopupProps) {
  const [branchData, setBranchData] = useState({
    branchName: "",
    city: "",
    district: "",
    locationLink: "",
    contactNumber: "",
    ageRange: { from: "", to: "" },
    services: [] as string[],
  });

  const [branchImg, setBranchImg] = useState<File | null>(null);
  const [branchImgPreview, setBranchImgPreview] = useState("");

  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [galleryPreview, setGalleryPreview] = useState<string[]>([]);

  const token = useSelector((state: RootState) => state.auth.token);

  if (!open) return null;

  const inputStyle =
    "w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#17B3DC] placeholder-gray-400";

  const labelStyle = "font-medium text-gray-700 mb-1 block";

  const sectionTitle = "text-lg font-semibold text-gray-800 mt-6 mb-2";

  const handleInput = (e: any) => {
    setBranchData({ ...branchData, [e.target.name]: e.target.value });
  };

  const handleAge = (e: any) => {
    setBranchData({
      ...branchData,
      ageRange: { ...branchData.ageRange, [e.target.name]: e.target.value },
    });
  };

  const toggleService = (service: string) => {
    setBranchData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const handleMainImage = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBranchImg(file);
    setBranchImgPreview(URL.createObjectURL(file));
  };

  const handleGalleryImages = (e: React.ChangeEvent<HTMLInputElement>) => {
  const fileList = e.target.files;
  if (!fileList) return;

  const files: File[] = Array.from(fileList); 
  setGalleryImages(files);

  const previews = files.map((file) => URL.createObjectURL(file));
  setGalleryPreview(previews);
};


  const handleSubmit = async () => {
  const form = new FormData();

  Object.entries(branchData).forEach(([key, value]) => {
    if (key === "ageRange") {
      form.append("ageFrom", branchData.ageRange.from);
      form.append("ageTo", branchData.ageRange.to);
    } else if (key === "services") {
      branchData.services.forEach((s) => form.append("services[]", s));
    } else {
      form.append(key, value as string);
    }
  });

  if (branchImg) form.append("branchImg", branchImg);
  galleryImages.forEach((img) => form.append("images", img));

  try {
    await axios.post("http://localhost:5000/newBranch", form, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    onAdded();
    onClose();
  } catch (err: any) {
  console.log("🔥 SERVER ERROR:", err.response?.data);
  console.log("🔥 FULL ERROR:", err);
}
  
};

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000] flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl p-7 max-h-[85vh] overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-3">
          <h2 className="text-2xl font-bold text-gray-800">إضافة فرع جديد</h2>
          <button
            className="text-gray-500 hover:text-gray-900 text-xl"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* --- FORM CONTENT --- */}
        <div className="flex flex-col gap-6">

          {/* قسم: معلومات الفرع */}
          <div>
            <h3 className={sectionTitle}>معلومات الفرع</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelStyle}> اسم الفرع - اسم الحي فقط مثال: الفايزية</label>
                <input className={inputStyle} name="branchName" onChange={handleInput} />
              </div>

              <div>
                <label className={labelStyle}>المدينة</label>
                <input className={inputStyle} name="city" onChange={handleInput} />
              </div>

              <div>
                <label className={labelStyle}>الحي</label>
                <input className={inputStyle} name="district" onChange={handleInput} />
              </div>

              <div>
                <label className={labelStyle}>رابط اللوكيشن</label>
                <input className={inputStyle} name="locationLink" onChange={handleInput} />
              </div>
            </div>

            <label className={labelStyle + " mt-3"}>رقم التواصل</label>
            <input className={inputStyle} name="contactNumber" onChange={handleInput} />
          </div>

          {/* قسم: الفئة العمرية */}
          <div>
            <h3 className={sectionTitle}>الفئة العمرية</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelStyle}>من</label>
                <input className={inputStyle} name="from" onChange={handleAge} />
              </div>

              <div>
                <label className={labelStyle}>إلى</label>
                <input className={inputStyle} name="to" onChange={handleAge} />
              </div>
            </div>
          </div>

          {/* الصورة الرئيسية */}
          <div>
            <h3 className={sectionTitle}>الصورة الرئيسية</h3>

            <input type="file" accept="image/*" onChange={handleMainImage} className={inputStyle} />

            {branchImgPreview && (
              <img
                src={branchImgPreview}
                className="w-32 h-32 mt-3 rounded-xl object-cover shadow-md"
              />
            )}
          </div>

          {/* صور إضافية */}
          <div>
            <h3 className={sectionTitle}>صور إضافية للفرع</h3>

            <input type="file" multiple accept="image/*" onChange={handleGalleryImages} className={inputStyle} />

            <div className="flex flex-wrap gap-3 mt-3">
              {galleryPreview.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  className="w-20 h-20 rounded-xl object-cover shadow"
                />
              ))}
            </div>
          </div>

          {/* الخدمات */}
          <div>
            <h3 className={sectionTitle}>الخدمات المقدمة</h3>

            <div className="grid grid-cols-1 gap-3">
              {servicesList.map((s) => (
                <label key={s} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={branchData.services.includes(s)}
                    onChange={() => toggleService(s)}
                    className="w-5 h-5 accent-[#17B3DC]"
                  />
                  <span className="text-gray-700">{s}</span>
                </label>
              ))}
            </div>
          </div>

        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-8 border-t pt-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
          >
            إلغاء
          </button>

          <button
            onClick={handleSubmit}
            className="px-8 py-2 bg-[#17B3DC] text-white rounded-xl hover:bg-[#139bbc] transition"
          >
            حفظ الفرع
          </button>
        </div>

      </div>
    </div>
  );
}
