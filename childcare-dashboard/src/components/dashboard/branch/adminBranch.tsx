"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import AddBranchPopup from "@/components/dashboard/popUps/AddBranch";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function BranchesPage() {
  const [branches, setBranches] = useState<any[]>([]);
  const [openAdd, setOpenAdd] = useState(false);

  const token = useSelector((state: RootState) => state.auth.token);

  // ---- Load Branches ----
  const loadBranches = async () => {
    try {
      const res = await axios.get("http://localhost:5000/allBranchs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBranches(res.data.data); // ← مصفوفة الفروع
      console.log("DATA:", res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadBranches();
  }, []);

  return (
    <div className="p-3">
      {/* العنوان + زر إضافة فرع */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[24px] font-bold text-[var(--text)]">فروع واحة المعرفة</h1>

        <button
          onClick={() => setOpenAdd(true)}
          className="bg-[#F9B236] px-5 py-2 rounded-xl text-white"
        >
          + إضافة فرع جديد
        </button>
      </div>

      {/* قائمة الفروع */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {branches.map((branch: any) => (
          <div
            key={branch._id}
            className="
              p-2
              rounded-2xl 
              shadow-md 
              bg-[var(--card)] 
              border 
              border-[var(--border)] 
              hover:shadow-lg 
              transition
              flex
              flex-col
            "
          >
            {/* الصورة */}
            <div className="w-full h-40 mb-4">
              <img
                src={branch.branchImg}
                alt={branch.branchName}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            {/* النص */}
            <h2 className="text-lg font-medium text-[var(--text)] mb-2">
            فرع  {branch.branchName} 
            </h2>

            <p className="text-[14px] text-[var(--text)] mb-1">
              📍 {branch.city} - {branch.district}
            </p>

            <p className="mt-2 text-[var(--text)]">
              الحالة:{" "}
              <span
                className={`text-[12px] font-medium ${
                  branch.status === "نشط" ? "text-green-600" : "text-red-600"
                }`}
              >
                {branch.status}
              </span>
            </p>

            {/* زر التفاصيل */}
            <button
              className="
                w-full 
                mt-4 
                py-2 
                rounded-xl 
                text-white 
                bg-[#F9B236] 
                hover:bg-[#d79a2d]
                transition
                font-medium
              "
            >
              عرض التفاصيل
            </button>
          </div>
        ))}
      </div>

      {/* Popup */}
      <AddBranchPopup
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onAdded={loadBranches}
      />
    </div>
  );
}

