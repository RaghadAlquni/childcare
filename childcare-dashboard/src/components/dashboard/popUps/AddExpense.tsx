"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface Branch {
  _id: string;
  branchName: string;
}

interface AddExpenseModalProps {
  open: boolean;
  onClose: () => void;
  branches: Branch[];
  defaultBranch: string;
  onSuccess: () => void;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  open,
  onClose,
  branches,
  defaultBranch,
  onSuccess,
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const role = user?.role;
  const directorBranch = user?.branch;
  const directorShift = user?.shift;

  const emptyForm = {
    branch: role === "director" ? directorBranch : defaultBranch || "",
    shift: role === "director" ? directorShift : "",
    amount: "",
    category: "",
    description: "",
    date: "",
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (open) {
      setForm({
        branch: role === "director" ? directorBranch : defaultBranch || "",
        shift: role === "director" ? directorShift : "",
        amount: "",
        category: "",
        description: "",
        date: "",
      });
    }
  }, [open, role, directorBranch, directorShift, defaultBranch]);

  const handleSubmit = async () => {
    if (!form.amount || !form.category) {
      Swal.fire({
        title: "تنبيه",
        text: "جميع الحقول الإلزامية مطلوبة",
        icon: "warning",
        didOpen: () => {
          const swal = document.querySelector(".swal2-container") as HTMLElement;
          if (swal) swal.style.zIndex = "30000";
        },
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/createExpenses",
        {
          ...form,
          amount: Number(form.amount),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        title: "تمت الإضافة",
        text: "تم تسجيل المصروف بنجاح",
        icon: "success",
        didOpen: () => {
          const swal = document.querySelector(".swal2-container") as HTMLElement;
          if (swal) swal.style.zIndex = "30000";
        },
      });

      onClose();
      onSuccess();
    } catch (error) {
      Swal.fire({
        title: "خطأ",
        text: "حدث خطأ أثناء الإضافة",
        icon: "error",
        didOpen: () => {
          const swal = document.querySelector(".swal2-container") as HTMLElement;
          if (swal) swal.style.zIndex = "30000";
        },
      });
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[20000]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-[var(--card)] text-[var(--text)] rounded-2xl shadow-lg p-6 w-full max-w-md"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">إضافة مصروف جديد</h2>
              <button onClick={onClose} className="text-xl">✕</button>
            </div>

            {/* Form */}
            <div className="flex flex-col gap-4">

              {/* الفرع — للأدمن فقط */}
              {role === "admin" && (
                <div>
                  <label className="text-sm font-medium">الفرع *</label>
                  <select
                    className="border p-2 rounded-md w-full"
                    value={form.branch}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, branch: e.target.value }))
                    }
                  >
                    <option value="">اختر الفرع</option>
                    {branches.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.branchName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* الفترة — للأدمن فقط */}
              {role === "admin" && (
                <div>
                  <label className="text-sm font-medium">الفترة *</label>
                  <select
                    className="border p-2 rounded-md w-full"
                    value={form.shift}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, shift: e.target.value }))
                    }
                  >
                    <option value="">اختر الفترة</option>
                    <option value="صباح">صباح</option>
                    <option value="مساء">مساء</option>
                  </select>
                </div>
              )}

              {/* المبلغ */}
              <div>
                <label className="text-sm font-medium">المبلغ *</label>
                <input
                  type="number"
                  className="border p-2 rounded-md w-full"
                  value={form.amount}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, amount: e.target.value }))
                  }
                />
              </div>

              {/* التصنيف */}
              <div>
                <label className="text-sm font-medium">التصنيف *</label>
                <select
                  className="border p-2 rounded-md w-full"
                  value={form.category}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, category: e.target.value }))
                  }
                >
                  <option value="">اختر التصنيف</option>
                  <option value="رواتب">رواتب</option>
                  <option value="إيجار">إيجار</option>
                  <option value="فواتير">فواتير</option>
                  <option value="مواد تعليمية">مواد تعليمية</option>
                  <option value="صيانة">صيانة</option>
                  <option value="تسويق">تسويق</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </div>

              {/* وصف */}
              <div>
                <label className="text-sm font-medium">الوصف</label>
                <textarea
                  className="border p-2 rounded-md w-full min-h-[80px]"
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button className="px-4 py-2 rounded-xl border" onClick={onClose}>
                إلغاء
              </button>

              <button
                className="px-4 py-2 rounded-xl bg-[#F9B236] text-white"
                onClick={handleSubmit}
              >
                إضافة المصروف
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddExpenseModal;
