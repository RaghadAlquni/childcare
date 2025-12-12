"use client";

import React, { useState, useEffect } from "react";
import AddIcon from "../../../../public/icons/addIcon";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Swal from "sweetalert2"; // ⬅️ NEW

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

  // 🌟 
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [shift, setShift] = useState("");
  const [branch, setBranch] = useState<string>("");

  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    if (!open) return;

    const fetchBranches = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/allBranchs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok && data.data) setBranches(data.data);
      } catch (error) {
        console.log("Error fetching branches:", error);
      }
    };

    fetchBranches();
  }, [open]);

  // ================= Submit — إضافة الموظف =================
  const handleAddUser = async (e: any) => {
    e.preventDefault();
    setLoading(true); // 🌟 to Loading

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
          branch: userRole === "admin" ? branch : userBranch,
          shift: userRole === "admin" ? shift : userShift,
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

        setLoading(false); // 🌟 NEW
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

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "خطأ في الاتصال بالسيرفر",
        confirmButtonColor: "#e84141",
      });
    }

    setLoading(false); // 🌟 NEW
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

        {/* العنوان */}
        <div className="flex items-center justify-between pb-4">
          <span className="text-[18px] font-semibold text-[#373737]">
            إضافة موظف جديد
          </span>
        </div>

        <form className="flex flex-col gap-5 mt-2" onSubmit={handleAddUser}>

         
          {/* الاسم + الهوية */}
          <div className="flex gap-5">
            <input
              type="text"
              placeholder="اسم الموظف"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#f5f5f5] rounded-[10px] border border-[#f1f1f1] p-[14px] outline-none placeholder:text-[#7b7b7b]"
            />

            <input
              type="text"
              placeholder="رقم الهوية"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              className="w-full bg-[#f5f5f5] rounded-[10px] border border-[#f1f1f1] p-[14px] outline-none placeholder:text-[#7b7b7b]"
            />
          </div>

          {/* البريد + الهاتف */}
          <div className="flex gap-5">
            <input
              type="text"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#f5f5f5] rounded-[10px] border border-[#f1f1f1] p-[14px] outline-none"
            />

            <input
              type="text"
              placeholder="رقم الهاتف"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#f5f5f5] rounded-[10px] border border-[#f1f1f1] p-[14px] outline-none"
            />
          </div>

          {/* الفترة + الفرع — تظهر فقط للادمن */}
          {userRole === "admin" && (
            <div className="flex gap-5">

              {/* الفترة */}
              <div className="w-full bg-[#f5f5f5] p-[10px] rounded-[10px] border border-[#f1f1f1]">
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

              {/* الفرع */}
              <div className="w-full bg-[#f5f5f5] p-[10px] rounded-[10px] border border-[#f1f1f1]">
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

            </div>
          )}

          {/* الوظيفة */}
          <div className="bg-[#f5f5f5] rounded-[10px] border border-[#f1f1f1] p-[10px]">
            <select
  value={role}
  onChange={(e) => setRole(e.target.value)}
  className="bg-transparent outline-none text-[#7b7b7b] w-full"
>
  <option value="">اختر الوظيفة</option>

  {/* صلاحيات حسب الدور */}
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

          {/* زر إضافة */}
          <div className="flex justify-center mt-3">
            <button
              type="submit"
              className="flex justify-center items-center bg-[#f9b236] h-[40px] w-[120px] rounded-[13px] text-white cursor-pointer font-medium gap-2 text-[16px] disabled:opacity-60"
              disabled={loading} // 🌟 NEW
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