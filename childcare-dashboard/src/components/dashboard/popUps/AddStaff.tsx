"use client";

import React, { useState, useEffect } from "react";
import AddIcon from "../../../../public/icons/addIcon";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Swal from "sweetalert2";

const swalStyleFix = `
  .swal2-container {
    z-index: 999999 !important;
  }
`;

type PopupProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

interface Branch {
  _id: string;
  branchName: string;
}

export default function AddStaff({ open, setOpen }: PopupProps) {
  if (!open) return null;

  const { role: userRole, branch: userBranch, shift: userShift } =
    useSelector((state: RootState) => state.auth.user || {});

  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [shift, setShift] = useState("");
  const [branch, setBranch] = useState<string>("");

  const [errors, setErrors] = useState<any>({});
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    if (!open) return;

    const styleTag = document.createElement("style");
    styleTag.innerHTML = swalStyleFix;
    document.head.appendChild(styleTag);

    const fetchBranches = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/allBranchs`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok && data.data) setBranches(data.data);
      } catch (error) {
        console.log("Error fetching branches:", error);
      }
    };

    fetchBranches();
  }, [open]);

  // ⭐⭐⭐ الفاليديشن هنا فقط
  const validateForm = () => {
    const newErrors: any = {};

    // الاسم عربي فقط
    const arabicRegex = /^[\u0600-\u06FF\s]+$/;

    if (!fullName.trim()) newErrors.fullName = "يرجى إدخال اسم الموظف";
    else if (!arabicRegex.test(fullName))
      newErrors.fullName = "الاسم يجب أن يكون باللغة العربية فقط";

    // رقم الهوية: أرقام فقط
    const numberRegex = /^[0-9]+$/;

    if (!idNumber.trim()) newErrors.idNumber = "يرجى إدخال رقم الهوية";
    else if (!numberRegex.test(idNumber))
      newErrors.idNumber = "رقم الهوية يجب أن يحتوي على أرقام فقط";

    // البريد: صيغة صحيحة
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) newErrors.email = "يرجى إدخال البريد الإلكتروني";
    else if (!emailRegex.test(email))
      newErrors.email = "يرجى إدخال بريد إلكتروني صحيح";

    // الهاتف: 10 أرقام فقط
    if (!phone.trim()) newErrors.phone = "يرجى إدخال رقم الهاتف";
    else if (!numberRegex.test(phone))
      newErrors.phone = "رقم الهاتف يجب أن يحتوي على أرقام انجليزية فقط";
    else if (phone.length !== 10)
      newErrors.phone = "رقم الهاتف يجب أن يتكون من 10 أرقام";

    // الوظيفة
    if (!role.trim()) newErrors.role = "يرجى اختيار الوظيفة";

    // لو المستخدم Admin → يجب تحديد الفترة والفرع
    if (userRole === "admin" && role !== "admin") {
      if (!shift.trim()) newErrors.shift = "يرجى اختيار الفترة";
      if (!branch.trim()) newErrors.branch = "يرجى اختيار الفرع";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ================= Submit — إضافة الموظف =================
  const handleAddUser = async (e: any) => {
    e.preventDefault();

    // التحقق قبل الإرسال
    if (!validateForm()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          fullName,
          email,
          idNumber,
          phone,
          role,

          branch:
            role === "admin"
              ? null
              : userRole === "admin"
              ? branch
              : userBranch,

          shift:
            role === "admin"
              ? null
              : userRole === "admin"
              ? shift
              : userShift,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "خطأ",
          text: data.message || "حدث خطأ أثناء الإضافة",
          confirmButtonColor: "#e84141",
        });

        setLoading(false);
        return;
      }

      Swal.fire({
        icon: "success",
        title: "تمت الإضافة بنجاح",
        text: "تم إضافة الموظف للنظام",
        confirmButtonColor: "#F9B236",
      });

      setOpen(false);

      setFullName("");
      setEmail("");
      setIdNumber("");
      setPhone("");
      setRole("");
      setBranch("");
      setShift("");
      setErrors({});

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "خطأ في الاتصال بالسيرفر",
        confirmButtonColor: "#e84141",
      });
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-[#373737]/50 flex items-center justify-center z-[9999] px-4">
      <div className="w-full max-w-[872px] bg-white rounded-[16px] p-[22px] relative">

        {/* زر الإغلاق */}
        <button
          className="absolute top-4 left-4 text-gray-500 hover:text-red-500 cursor-pointer"
          onClick={() => setOpen(false)}
        >
          ✕
        </button>

        <div className="flex items-center justify-between pb-4">
          <span className="text-[18px] font-semibold text-[#373737]">
            إضافة موظف جديد
          </span>
        </div>

        <form className="flex flex-col gap-5 mt-2" onSubmit={handleAddUser}>

          {/* الاسم + الهوية */}
          <div className="flex gap-5">

            <div className="w-full">
              <input
                type="text"
                placeholder="اسم الموظف"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full bg-[#f5f5f5] rounded-[10px] border p-[14px] outline-none 
                ${errors.fullName ? "border-red-500" : "border-[#f1f1f1]"}`}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1 text-right">{errors.fullName}</p>
              )}
            </div>

            <div className="w-full">
              <input
                type="text"
                placeholder="رقم الهوية"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                className={`w-full bg-[#f5f5f5] rounded-[10px] border p-[14px] outline-none
                ${errors.idNumber ? "border-red-500" : "border-[#f1f1f1]"}`}
              />
              {errors.idNumber && (
                <p className="text-red-500 text-sm mt-1 text-right">{errors.idNumber}</p>
              )}
            </div>

          </div>

          {/* البريد + الهاتف */}
          <div className="flex gap-5">

            <div className="w-full">
              <input
                type="text"
                placeholder="البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-[#f5f5f5] rounded-[10px] border p-[14px] outline-none
                ${errors.email ? "border-red-500" : "border-[#f1f1f1]"}`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 text-right">{errors.email}</p>
              )}
            </div>

            <div className="w-full">
              <input
                type="text"
                placeholder="رقم الهاتف"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full bg-[#f5f5f5] rounded-[10px] border p-[14px] outline-none
                ${errors.phone ? "border-red-500" : "border-[#f1f1f1]"}`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1 text-right">{errors.phone}</p>
              )}
            </div>

          </div>

          {/* الوظيفة */}
          <div className="w-full">
            <div className={`bg-[#f5f5f5] rounded-[10px] border p-[10px]
              ${errors.role ? "border-red-500" : "border-[#f1f1f1]"}`}>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-transparent outline-none text-[#7b7b7b] w-full"
              >
                <option value="">اختر الوظيفة</option>

                {userRole === "admin" && (
                  <>
                    <option value="admin">مسؤول</option>
                    <option value="director">مدير</option>
                    <option value="assistant_director">مدير مساعد</option>
                    <option value="teacher">معلم</option>
                    <option value="assistant_teacher">معلم مساعد</option>
                  </>
                )}

                {userRole === "director" && (
                  <>
                    <option value="assistant_director">مدير مساعد</option>
                    <option value="teacher">معلم</option>
                    <option value="assistant_teacher">معلم مساعد</option>
                  </>
                )}

                {userRole === "assistant_director" && (
                  <>
                    <option value="teacher">معلم</option>
                    <option value="assistant_teacher">معلم مساعد</option>
                  </>
                )}
              </select>
            </div>

            {errors.role && (
              <p className="text-red-500 text-sm mt-1 text-right">{errors.role}</p>
            )}
          </div>

          {/* الفترة + الفرع */}
          {userRole === "admin" && role !== "admin" && (
            <div className="flex gap-5">

              {/* الفترة */}
              <div className="w-full">
                <div className={`bg-[#f5f5f5] rounded-[10px] border p-[10px]
                  ${errors.shift ? "border-red-500" : "border-[#f1f1f1]"}`}>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value)}
                    className="w-full bg-transparent outline-none"
                  >
                    <option value="">اختر الفترة</option>
                    <option value="صباح">صباح</option>
                    <option value="مساء">مساء</option>
                  </select>
                </div>

                {errors.shift && (
                  <p className="text-red-500 text-sm mt-1 text-right">{errors.shift}</p>
                )}
              </div>

              {/* الفرع */}
              <div className="w-full">
                <div className={`bg-[#f5f5f5] rounded-[10px] border p-[10px]
                  ${errors.branch ? "border-red-500" : "border-[#f1f1f1]"}`}>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full bg-transparent outline-none"
                  >
                    <option value="">اختر الفرع</option>
                    {branches.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.branchName}
                      </option>
                    ))}
                  </select>
                </div>

                {errors.branch && (
                  <p className="text-red-500 text-sm mt-1 text-right">{errors.branch}</p>
                )}
              </div>
            </div>
          )}

          {/* زر إضافة */}
          <div className="flex justify-center mt-3">
            <button
              type="submit"
              className="flex justify-center items-center bg-[#f9b236] h-[40px] w-[120px] rounded-[13px] text-white cursor-pointer font-medium gap-2 text-[16px] disabled:opacity-60"
              disabled={loading}
            >
              {loading ? (
                <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
              ) : (
                <>
                  <AddIcon className="w-5 h-5" /> إضافة
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
