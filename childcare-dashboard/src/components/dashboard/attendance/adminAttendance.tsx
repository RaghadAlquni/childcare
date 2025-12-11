"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

type Status = "present" | "absent" | "no-record";

interface DailyRecord {
  employee: {
    _id: string;
    fullName: string;
    role: string;
  };
  status: Status;
  checkIn: string | null;
}

interface MonthlyRecord {
  employee: {
    _id: string;
    fullName: string;
    role: string;
  };
  month: {
    [day: number]: Status;
  };
}

interface Branch {
  _id: string;
  branchName: string;
}

// ✅ دالة تحسب تاريخ اليوم الحقيقي للسعودية
const getSaudiDate = () => {
  const now = new Date();
  const saTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Riyadh" })
  );
  return saTime.toISOString().split("T")[0];
};

export default function AttendancePage() {
  const [view, setView] = useState<"daily" | "monthly">("daily");
  const [dailyData, setDailyData] = useState<DailyRecord[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyRecord[]>([]);
  const [daysInMonth, setDaysInMonth] = useState(30);

  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedShift, setSelectedShift] = useState("");

  //  التاريخ الجديد الصحيح
  const today = getSaudiDate();
  const weekdayName = new Date().toLocaleDateString("ar-SA", {
    weekday: "long",
  });

  const currentMonth = Number(today.split("-")[1]);
  const currentYear = Number(today.split("-")[0]);

  //  ترجمة الرول للعربي
  const translateRole = (role: string) => {
    const map: Record<string, string> = {
      director: "مديرة",
      assistant_director: "مساعدة مديرة",
      teacher: "معلمة",
      assistant_teacher: "مساعدة معلمة",
    };
    return map[role] || role;
  };

  // ---- STATUS RENDER ----
  const renderStatus = (status: Status) => {
    const colors: Record<Status, string> = {
      present: "text-green-600",
      absent: "text-red-600",
      "no-record": "text-gray-500",
    };

    const symbols: Record<Status, string> = {
      present: "✔",
      absent: "✖",
      "no-record": "—",
    };

    return (
      <span className={`text-lg font-bold ${colors[status]}`}>
        {symbols[status]}
      </span>
    );
  };

  // ---- FETCH BRANCHES ----
  const fetchBranches = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/allBranchs", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBranches(res.data.data || []);
    } catch (err) {
      console.log("Error fetching branches:", err);
    }
  };

  // ---- FETCH DAILY ----
  const fetchDaily = async () => {
    try {
      const token = localStorage.getItem("token");

      const url =
        selectedBranch && selectedShift
          ? `http://localhost:5000/employeesAttendance?branch=${selectedBranch}&shift=${selectedShift}&date=${today}`
          : `http://localhost:5000/employeesAttendance?date=${today}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDailyData(res.data.records || []);
    } catch (err) {
      console.log("Daily fetch error:", err);
    }
  };

  // ---- FETCH MONTHLY ----
  const fetchMonthly = async () => {
    try {
      const token = localStorage.getItem("token");

      const url =
        selectedBranch && selectedShift
          ? `http://localhost:5000/MunthlyEmployeesAttendance?branch=${selectedBranch}&shift=${selectedShift}&month=${currentMonth}&year=${currentYear}`
          : `http://localhost:5000/MunthlyEmployeesAttendance?month=${currentMonth}&year=${currentYear}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMonthlyData(res.data.records || []);
      setDaysInMonth(res.data.daysInMonth || 30);
    } catch (err) {
      console.log("Monthly fetch error:", err);
    }
  };

  useEffect(() => {
    fetchBranches();
    fetchDaily();
    fetchMonthly();
  }, []);

  useEffect(() => {
    fetchDaily();
    fetchMonthly();
  }, [selectedBranch, selectedShift]);

  const formatTime = (value: string | null) => {
    if (!value) return "—";
    const date = new Date(value);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="w-full overflow-x-hidden min-h-screen bg-[var(--bg)]">
      {/* HEADER */}
      <div className="sticky top-0 bg-[var(--bg)] z-50 md:px-6 w-full">
        {/* العنوان */}
        <div className="max-w-5xl mx-auto">
          <h1 className="text-[24px] font-bold text-right text-[var(--text)]">
            <span className="text-[#d5d5d5] text-[20px] md:font-bold">
              التحضير /
            </span>{" "}
            سجل تحضير الموظفات
          </h1>
        </div>

        
        {/* DATE + VIEW BUTTONS */}
        <div className="max-w-5xl mx-auto mt-4 flex justify-between items-center">
          <div className="text-[var(--text)] font-semibold text-lg text-right">
            📅 {today} — {weekdayName}
          </div>

          {/* VIEW BUTTONS */}
          <div className="hidden md:flex gap-3">
            <button
              onClick={() => setView("daily")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                view === "daily"
                  ? "bg-[#F9B236] text-white"
                  : "bg-[var(--card)] text-[var(--text)] border border-[var(--border)]"
              }`}
            >
              الحضور اليومي
            </button>

            <button
              onClick={() => setView("monthly")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                view === "monthly"
                  ? "bg-[#F9B236] text-white"
                  : "bg-[var(--card)] text-[var(--text)] border border-[var(--border)]"
              }`}
            >
              الحضور الشهري
            </button>
          </div>
        </div>
      </div>

      {/* FILTERS SECTION */}
      <div className="w-full px-4 md:px-6 mt-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-3 w-full">
          {/* الفرع */}
          <select
            className="bg-[var(--card)] shadow-sm border border-[var(--border)] p-2 rounded-lg w-full text-[var(--text)]"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
          >
            <option value="">كل الفروع</option>
            {branches.map((b) => (
              <option key={b._id} value={b._id}>
                {b.branchName}
              </option>
            ))}
          </select>

          {/* الشفت */}
          <select
            className="bg-[var(--card)] shadow-sm border border-[var(--border)] p-2 rounded-lg w-full text-[var(--text)]"
            value={selectedShift}
            onChange={(e) => setSelectedShift(e.target.value)}
          >
            <option value="">كل الشفتات</option>
            <option value="صباح">صباح</option>
            <option value="مساء">مساء</option>
          </select>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="w-full px-0 mt-4">
        <div className="bg-[var(--card)] shadow-sm rounded-xl w-full overflow-x-auto max-w-full sm:max-w-full md:max-w-[725px] lg:max-w-[850px] mx-auto">
          {/* DAILY TABLE */}
          {(view === "daily" ||
            (typeof window !== "undefined" && window.innerWidth < 768)) && (
            <table className="w-full text-right">
              <thead>
                <tr className="bg-[rgba(249,178,54,0.1)] text-[var(--text)]">
                  <th className="p-3 border-l border-[var(--border)]">الاسم</th>
                  <th className="p-3 border-l border-[var(--border)]">
                    الوظيفة
                  </th>
                  <th className="p-3 border-l border-[var(--border)]">
                    الحالة
                  </th>
                  <th className="p-3 border-l border-[var(--border)]">
                    وقت الحضور
                  </th>
                </tr>
              </thead>
              <tbody>
                {dailyData.map((emp, i) => (
                  <tr
                    key={i}
                    className="border-b border-[var(--border)] transition text-[var(--text)]"
                  >
                    <td className="p-3 border-l border-[var(--border)] font-medium">
                      {emp.employee.fullName}
                    </td>
                    <td className="p-3 border-l border-[var(--border)]">
                      {translateRole(emp.employee.role)}
                    </td>
                    <td className="p-3 border-l border-[var(--border)]">
                      {renderStatus(emp.status)}
                    </td>
                    <td className="p-3 border-l border-[var(--border)]">
                      {formatTime(emp.checkIn)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* MONTHLY TABLE */}
          {view === "monthly" && (
            <div className="hidden md:block">
              <table className="border-collapse min-w-max w-max text-right mx-0">
                <thead>
                  <tr className="bg-[rgba(249,178,54,0.1)] text-[var(--text)] text-center">
                    <th className="p-3 border-l border-[var(--border)]">الاسم</th>
                    <th className="p-3 border-l border-[var(--border)]">
                      الوظيفة
                    </th>

                    {[...Array(daysInMonth)].map((_, i) => (
                      <th
                        key={i}
                        className="px-2 py-1 text-sm border-l border-[var(--border)]"
                      >
                        {i + 1}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {monthlyData.map((emp, i) => (
                    <tr
                      key={i}
                      className="border-b border-[var(--border)] hover:bg-[var(--bordergray)] transition text-[var(--text)]"
                    >
                      <td className="p-3 border-l border-[var(--border)] whitespace-nowrap font-medium">
                        {emp.employee.fullName}
                      </td>
                      <td className="p-3 border-l border-[var(--border)] whitespace-nowrap">
                        {translateRole(emp.employee.role)}
                      </td>

                      {[...Array(daysInMonth)].map((_, dayIndex) => {
                        const day = dayIndex + 1;
                        const status = emp.month[day] || "no-record";
                        return (
                          <td
                            key={day}
                            className="px-2 py-1 text-center border-l border-[var(--border)]"
                          >
                            {renderStatus(status as Status)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
