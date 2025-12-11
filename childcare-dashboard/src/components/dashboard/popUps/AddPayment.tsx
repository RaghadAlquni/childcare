"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import axios from "axios";

interface Branch {
  _id: string;
  branchName: string;
}

interface AddPaymentModalProps {
  open: boolean;
  onClose: () => void;
  branches: Branch[];
  defaultBranch: string;
  onSuccess: () => void;
}

interface UserData {
  role: string;
  branch?: string;
  shift?: string;
}

const AddPaymentModal: React.FC<AddPaymentModalProps> = ({
  open,
  onClose,
  branches,
  defaultBranch,
  onSuccess,
}) => {
  // -------------------------------
  // 👤 قراءة بيانات اليوزر من localStorage
  // -------------------------------
  const userData: UserData | null =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null;

  const role = userData?.role || "admin";
  const directorBranch = userData?.branch || "";
  const directorShift = userData?.shift || "";

  const emptyForm = {
    branch: role === "director" ? directorBranch : defaultBranch || "",
    shift: role === "director" ? directorShift : "",
    paymentType: "",
    amount: "",
    note: "",
  };

  const [form, setForm] = useState(emptyForm);

  // ------------------------------------
  // 🧼 تصفير الفورم كل مرة يفتح فيها البوب-أب
  // ------------------------------------
  useEffect(() => {
    if (open) {
      setForm({
        branch: role === "director" ? directorBranch : defaultBranch || "",
        shift: role === "director" ? directorShift : "",
        paymentType: "",
        amount: "",
        note: "",
      });
    }
  }, [open, role, directorBranch, directorShift, defaultBranch]);

  // ------------------------------------
  // 📤 إرسال البيانات
  // ------------------------------------
  const handleSubmit = async () => {
    if (!form.paymentType || !form.amount) {
      Swal.fire({
        title: "تنبيه",
        text: "يرجى تعبئة جميع الحقول الإلزامية",
        icon: "warning",
        didOpen: () => {
          const el = document.querySelector(".swal2-container") as HTMLElement;
          if (el) el.style.zIndex = "30000";
        },
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/createPayment",
        {
          branch: form.branch,
          shift: form.shift,
          paymentType: form.paymentType,
          amount: Number(form.amount),
          note: form.note,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire({
        title: "تمت الإضافة",
        text: "تم إضافة المدفوعات بنجاح",
        icon: "success",
        didOpen: () => {
          const el = document.querySelector(".swal2-container") as HTMLElement;
          if (el) el.style.zIndex = "30000";
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
          const el = document.querySelector(".swal2-container") as HTMLElement;
          if (el) el.style.zIndex = "30000";
        },
      });
    }
  };

  // ------------------------------------
  // 🧩 UI + المنطق
  // ------------------------------------
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
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">إضافة مدفوعات جديدة</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-4">

              {/* ------------------------------- */}
              {/* 🎛️ الفرع — يظهر فقط للأدمن */}
              {/* ------------------------------- */}
              {role === "admin" && (
                <div>
                  <label className="text-sm font-medium">الفرع *</label>
                  <select
                    className="border border-[var(--border)] w-full p-2 rounded-md"
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

              {/* ------------------------------- */}
              {/* 🕒 الشفت — يظهر فقط للأدمن */}
              {/* ------------------------------- */}
              {role === "admin" && (
                <div>
                  <label className="text-sm font-medium">الفترة *</label>
                  <select
                    className="border border-[var(--border)] w-full p-2 rounded-md"
                    value={form.shift}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        shift: e.target.value as "صباح" | "مساء",
                      }))
                    }
                  >
                    <option value="">اختر الفترة</option>
                    <option value="صباح">صباح</option>
                    <option value="مساء">مساء</option>
                  </select>
                </div>
              )}

              {/* نوع الدفع */}
              <div>
                <label className="text-sm font-medium">طريقة الدفع *</label>
                <select
                  className="border border-[var(--border)] w-full p-2 rounded-md"
                  value={form.paymentType}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      paymentType: e.target.value,
                    }))
                  }
                >
                  <option value="">اختر طريقة الدفع</option>
                  <option value="Apple Pay">Apple Pay</option>
                  <option value="POS">POS</option>
                  <option value="cash">Cash</option>
                  <option value="Tappy">Tappy</option>
                  <option value="Tamara">Tamara</option>
                </select>
              </div>

              {/* مبلغ */}
              <div>
                <label className="text-sm font-medium">المبلغ (ريال) *</label>
                <input
                  type="number"
                  className="border border-[var(--border)] w-full p-2 rounded-md"
                  value={form.amount}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, amount: e.target.value }))
                  }
                />
              </div>

              {/* ملاحظة */}
              <div>
                <label className="text-sm font-medium">ملاحظة (اختياري)</label>
                <textarea
                  className="border border-[var(--border)] w-full p-2 rounded-md min-h-[80px]"
                  value={form.note}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, note: e.target.value }))
                  }
                />
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 rounded-xl border border-[var(--border)]"
                onClick={onClose}
              >
                إلغاء
              </button>

              <button
                className="px-4 py-2 rounded-xl bg-[#F9B236] text-white"
                onClick={handleSubmit}
              >
                حفظ المدفوعات
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddPaymentModal;
