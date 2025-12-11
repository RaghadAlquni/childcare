"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import AddPaymentModal from "../../popUps/AddPayment"; 

// ------------------------------------------
//               TYPESCRIPT TYPES
// ------------------------------------------

interface Branch {
  _id: string;
  branchName: string;
}

interface Payment {
  _id: string;
  amount: number;
  paymentType: string;
  date: string;
  note?: string;
  branch?: Branch;
}

// ------------------------------------------

const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [pages, setPages] = useState<number>(1);
  const [selectedBranch, setSelectedBranch] = useState<string>("all");

  const [limit, setLimit] = useState<number>(10);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // ⭐️ NEW: Get logged user role
  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null;

  const role = user?.role;

  // مجموع المدفوعات
  const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  // ------------------------------------------------
  // Fetch Branches
  // ------------------------------------------------
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

  // ------------------------------------------------
  // Fetch Payments
  // ------------------------------------------------
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/allIncoming?page=${page}&limit=${limit}&branch=${selectedBranch}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPayments(res.data.data || []);
      setPages(res.data.pages || 1);
    } catch (error) {
      console.log("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [page, selectedBranch, limit]);

  // ------------------------------------------------
  // Checkbox Logic
  // ------------------------------------------------
  const toggleSelect = (id: string) => {
    setSelectedPayments((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedPayments.length === payments.length && payments.length > 0) {
      setSelectedPayments([]);
    } else {
      setSelectedPayments(payments.map((p) => p._id));
    }
  };

  // ------------------------------------------------
  // Delete Selected
  // ------------------------------------------------
  const deleteSelected = async () => {
    if (selectedPayments.length === 0) return;

    const confirm = await Swal.fire({
      title: "هل أنتِ متأكدة؟",
      text: "سيتم حذف العمليات المحددة نهائيًا.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم، احذف",
      cancelButtonText: "إلغاء",
      reverseButtons: true,
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/deletePayments",
        { ids: selectedPayments },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSelectedPayments([]);
      fetchPayments();

      Swal.fire("تم الحذف", "تم حذف العمليات المحددة بنجاح.", "success");
    } catch (error) {
      Swal.fire("خطأ", "حدث خطأ أثناء الحذف", "error");
    }
  };

  // ------------------------------------------------
  // LOADING
  // ------------------------------------------------

  if (loading) {
    return <div className="text-center py-10">جاري التحميل...</div>;
  }

  return (
    <div className="w-full flex flex-col gap-5 p-2">
      {/* ---------------- HEADER ---------------- */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h1 className="text-[24px] font-semibold text-[var(--text)]">
          <span className="text-[#d5d5d5]">العمليات المالية /</span> المدفوعات
        </h1>

        <button
          className="bg-[#F9B236] text-white px-4 py-2 rounded-xl"
          onClick={() => setShowAddModal(true)}
        >
          إضافة مدفوعات جديدة
        </button>
      </div>

      {/* ---------------- TOTAL + FILTER ---------------- */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="text-xl text-[var(--text)]">
          مجموع المدفوعات: {totalAmount} ريال
        </div>

        {/* يظهر للأدمن فقط */}
        {role === "admin" && (
          <div className="flex gap-3 items-center">
            <span className="text-lg text-[var(--text)]">الفرع:</span>

            <select
              className="border border-[var(--border)] bg-[var(--card)] text-[var(--text)] p-2 rounded-md"
              value={selectedBranch}
              onChange={(e) => {
                setPage(1);
                setSelectedBranch(e.target.value);
                setSelectedPayments([]);
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
                    payments.length > 0 &&
                    selectedPayments.length === payments.length
                  }
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="border border-[var(--border)] p-3">وصف العملية</th>
              <th className="border border-[var(--border)] p-3">المبلغ</th>
              <th className="border border-[var(--border)] p-3">التاريخ</th>
              <th className="border border-[var(--border)] p-3">نوع الدفع</th>
              <th className="border border-[var(--border)] p-3">الفرع</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((p) => (
              <motion.tr
                key={p._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <td className="border border-[var(--border)] p-3 text-center">
                  <input
                    type="checkbox"
                    checked={selectedPayments.includes(p._id)}
                    onChange={() => toggleSelect(p._id)}
                  />
                </td>

                <td className="border border-[var(--border)] text-[var(--text)] p-3">
                  {p.note || "--"}
                </td>

                <td className="border border-[var(--border)] text-[var(--text)] p-3">
                  {p.amount} ريال
                </td>

                <td className="border border-[var(--border)] text-[var(--text)] p-3">
                  {new Date(p.date).toLocaleDateString("ar-EG")}
                </td>

                <td className="border border-[var(--border)] text-[var(--text)] p-3">
                  {p.paymentType}
                </td>

                <td className="border border-[var(--border)] text-[var(--text)] p-3">
                  {p.branch?.branchName || "--"}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DELETE BUTTON */}
      <button
        onClick={deleteSelected}
        disabled={selectedPayments.length === 0}
        className={`px-4 py-2 rounded-xl mt-2 ${
          selectedPayments.length === 0
            ? "bg-gray-400 text-white"
            : "bg-[#F9B236] text-white"
        }`}
      >
        حذف العمليات المحددة
      </button>

      {/* ---------------- PAGINATION ---------------- */}
      <div className="flex justify-between items-center mt-6 flex-wrap gap-5">
        <span className="text-lg text-[var(--text)]">
          Page {page} of {pages}
        </span>

        <div className="flex items-center gap-3">
          <button
            className="text-[var(--text)] disabled:opacity-30"
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            <span className="text-2xl">‹</span>
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: pages }, (_, i) => i + 1).map((pNum) => (
              <button
                key={pNum}
                onClick={() => setPage(pNum)}
                className={`px-4 py-1 rounded-md border 
                  ${
                    pNum === page
                      ? "bg-[#F9B236] text-white border-[#F9B236]"
                      : "bg-white text-gray-500 border-gray-300"
                  }`}
              >
                <p className="mt-1"> {pNum} </p>
              </button>
            ))}
          </div>

          <button
            className="text-[var(--text)] disabled:opacity-30"
            disabled={page === pages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            <span className="text-2xl">›</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-lg text-[var(--text)]">Show</span>

          <select
            className="border border-[var(--border)] rounded-md p-2 text-[var(--text)]"
            value={limit}
            onChange={(e) => {
              const newLimit = Number(e.target.value);
              setLimit(newLimit);
              setPage(1);
              setSelectedPayments([]);
            }}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      {/* MODAL */}
      <AddPaymentModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        branches={branches}
        defaultBranch={selectedBranch}
        onSuccess={fetchPayments}
      />
    </div>
  );
};

export default PaymentsPage;
