"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import AddExpenseModal from "../../popUps/AddExpense";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

// -------------------------------------
// TYPES
// -------------------------------------
interface Branch {
  _id: string;
  branchName: string;
}

interface Expense {
  _id: string;
  amount: number;
  category: string;
  description?: string;
  date: string;
  branch?: Branch;
  shift?: string;
}

// -------------------------------------

const ExpensesPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const role = user?.role;

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [pages, setPages] = useState<number>(1);
  const [selectedBranch, setSelectedBranch] = useState<string>("all");

  const [limit, setLimit] = useState<number>(10);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // مجموع المصروفات
  const totalAmount = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  // -------------------------------------
  // FETCH BRANCHES (Admin only)
  // -------------------------------------
  const fetchBranches = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/allBranchs", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBranches(res.data.data || []);
    } catch (error) {
      console.log("Error fetching branches:", error);
    }
  };

  // -------------------------------------
  // FETCH Expenses
  // -------------------------------------
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/allExpenses?page=${page}&limit=${limit}&branch=${selectedBranch}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setExpenses(res.data.data || []);
      setPages(res.data.pages || 1);
    } catch (error) {
      console.log("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === "admin") fetchBranches();
  }, [role]);

  useEffect(() => {
    fetchExpenses();
  }, [page, selectedBranch, limit]);

  // -------------------------------------
  // CHECKBOX LOGIC
  // -------------------------------------
  const toggleSelect = (id: string) => {
    setSelectedExpenses((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedExpenses.length === expenses.length && expenses.length > 0) {
      setSelectedExpenses([]);
    } else {
      setSelectedExpenses(expenses.map((e) => e._id));
    }
  };

  // -------------------------------------
  // DELETE SELECTED
  // -------------------------------------
  const deleteSelected = async () => {
  if (selectedExpenses.length === 0) return;

  const confirm = await Swal.fire({
    title: "هل أنتِ متأكدة؟",
    text: "سيتم حذف المصروفات المحددة نهائيًا.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "نعم، احذف",
    cancelButtonText: "إلغاء",
    reverseButtons: true,
  });

  if (!confirm.isConfirmed) return;

  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      "http://localhost:5000/deleteExpenses",
      { ids: selectedExpenses },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.data.success) {
      Swal.fire("تم الحذف", "تم حذف المصروفات بنجاح.", "success");

      setSelectedExpenses([]); // تفريغ الاختيار
      fetchExpenses(); // إعادة تحميل الصفحة
    } else {
      Swal.fire("خطأ", "لم يتم الحذف من السيرفر", "error");
    }
  } catch (error) {
    Swal.fire("خطأ", "حدث خطأ أثناء تنفيذ عملية الحذف", "error");
  }
};

  // -------------------------------------
  // PAGE LOADING
  // -------------------------------------

  if (loading) {
    return <div className="text-center py-10">جاري التحميل...</div>;
  }

  return (
    <div className="w-full flex flex-col gap-5 p-2">
      {/* ---------------- HEADER ---------------- */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h1 className="text-[24px] font-semibold text-[var(--text)]">
          <span className="text-[#d5d5d5]">العمليات المالية /</span> المصروفات
        </h1>

        <button
          className="bg-[#F9B236] text-white px-4 py-2 rounded-xl"
          onClick={() => setShowAddModal(true)}
        >
          إضافة مصروف جديد
        </button>
      </div>

      {/* ---------------- TOTAL + FILTER ---------------- */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="text-xl text-[var(--text)]">
          مجموع المصروفات: {totalAmount} ريال
        </div>

        {/* فلترة الفروع — للأدمن فقط */}
        {role === "admin" && (
          <div className="flex gap-3 items-center">
            <span className="text-lg text-[var(--text)]">الفرع:</span>

            <select
              className="border border-[var(--border)] bg-[var(--card)] text-[var(--text)] p-2 rounded-md"
              value={selectedBranch}
              onChange={(e) => {
                setPage(1);
                setSelectedBranch(e.target.value);
                setSelectedExpenses([]);
              }}
            >
              <option value="all">كل الفروع</option>
              {branches.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.branchName}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ---------------- TABLE ---------------- */}
      <div className="bg-[var(--card)] rounded-xl overflow-x-auto border border-[var(--border)]">
        <table className="min-w-full text-right">
          <thead className="bg-[#F9B236]/10 text-[var(--text)]">
            <tr>
              <th className="border border-[var(--border)] p-3 text-center">
                <input
                  type="checkbox"
                  checked={
                    expenses.length > 0 &&
                    selectedExpenses.length === expenses.length
                  }
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="border border-[var(--border)] p-3">الوصف</th>
              <th className="border border-[var(--border)] p-3">التصنيف</th>
              <th className="border border-[var(--border)] p-3">المبلغ</th>
              <th className="border border-[var(--border)] p-3">التاريخ</th>
              <th className="border border-[var(--border)] p-3">الفرع</th>
            </tr>
          </thead>

          <tbody>
            {expenses.map((e) => (
              <motion.tr
                key={e._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <td className="border border-[var(--border)] p-3 text-center">
                  <input
                    type="checkbox"
                    checked={selectedExpenses.includes(e._id)}
                    onChange={() => toggleSelect(e._id)}
                  />
                </td>

                <td className="border border-[var(--border)] text-[var(--text)] p-3">{e.description || "--"}</td>
                <td className="border border-[var(--border)] text-[var(--text)] p-3">{e.category}</td>
                <td className="border border-[var(--border)] text-[var(--text)] p-3">{e.amount} ريال</td>
                <td className="border border-[var(--border)] text-[var(--text)] p-3">
                  {new Date(e.date).toLocaleDateString("ar-EG")}
                </td>
                <td className="border border-[var(--border)] text-[var(--text)] p-3">{e.branch?.branchName || "--"}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DELETE BUTTON */}
      <button
        onClick={deleteSelected}
        disabled={selectedExpenses.length === 0}
        className={`px-4 py-2 rounded-xl mt-2 ${
          selectedExpenses.length === 0
            ? "bg-gray-400 text-white"
            : "bg-[#F9B236] text-white"
        }`}
      >
        حذف المصروفات المحددة
      </button>

      {/* ---------------- PAGINATION ---------------- */}
      <div className="flex justify-between items-center mt-6 flex-wrap gap-5">
        <span className="text-lg text-[var(--text)]">
          Page {page} of {pages}
        </span>

        {/* Pagination Numbers */}
        <div className="flex items-center gap-2">
          {Array.from({ length: pages }, (_, i) => i + 1).map((pNum) => (
            <button
              key={pNum}
              onClick={() => setPage(pNum)}
              className={`px-4 py-1 rounded-md border ${
                pNum === page
                  ? "bg-[#F9B236] text-white border-[#F9B236]"
                  : "bg-white text-gray-500 border-gray-300"
              }`}
            >
              <p className="mt-1">{pNum}</p>
            </button>
          ))}
        </div>

        {/* Show per page */}
        <div className="flex items-center gap-3">
          <span className="text-lg text-[var(--text)]">Show</span>

          <select
            className="border border-[var(--border)] rounded-md p-2 text-[var(--text)]"
            value={limit}
            onChange={(e) => {
              const newLimit = Number(e.target.value);
              setLimit(newLimit);
              setPage(1);
              setSelectedExpenses([]);
            }}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      {/* MODAL */}
      <AddExpenseModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        branches={branches}
        defaultBranch={selectedBranch}
        onSuccess={fetchExpenses}
      />
    </div>
  );
};

export default ExpensesPage;
