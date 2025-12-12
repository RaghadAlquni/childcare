"use client";
import React, { useEffect, useState } from "react";
import ProfileIcon from "../../../../../public/icons/profileIcon";
import AddToClassroom from "../../../../../public/icons/addToClass";

interface Guardian {
  phoneNumber: string;
  relationship: string;
}


interface Child {
  _id: string;
  childName: string;
  guardian: Guardian[];
  gender: string;
  submittedAt: string;
  subscription?: {
  name: string;
  durationType: string;
};
  classroom?: {
  className: string;
  }
}

export default function TeacherConfirmed() {
  const [children, setChildren] = useState<Child[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // ********** جلب الأطفال من الباك **********
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/confirmedChildren`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        console.log("FROM BACK:", data);

        if (data.children) setChildren(data.children);
      } catch (err) {
        console.log("Error fetching children:", err);
      }
    };

    fetchChildren();
  }, []);

  const totalPages = Math.ceil(children.length / pageSize);
  const paginated = children.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="w-full max-w-[1300px] mx-auto bg-[var(--bg)] my-2">
      
      {/* ===== Header ===== */}
      <div className="flex flex-row justify-between items-center mb-6">

        <h2 className="text-[28px] font-bold font-bold text-right text-[var(--text)]">
          <span>أطفالي</span>
        </h2>
      </div>

      {/* ===== TABLE ===== */}
     <div className="hidden md:block">
  <div className="bg-[var(--card)] rounded-[10px] border border-[var(--border)] overflow-hidden">
    <table className="w-full table-auto text-right border-collapse">
          {/* HEAD */}
          <thead className="bg-[rgba(249,178,54,0.1)] text-[var(--text)] font-bold">
            <tr className="border-b border-[var(--border)]">
              <th className="p-4 border-l border-[var(--border)]">اسم الطفل</th>
              <th className="p-4 border-l border-[var(--border)]">فصل</th>
              <th className="p-4 border-l border-[var(--border)]">جنس الطفل</th>
              <th className="p-4 border-l border-[var(--border)]">أرقام أولياء الأمور</th>
             <th className="p-4 border-l border-[var(--border)]">نوع الاشتراك</th>
              <th className="p-4 border-l border-[var(--border)]">الإجراءات</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {paginated.map((item) => (
              <tr
                key={item._id}
                className="border-b border-[var(--border)] hover:bg-[var(--bordergray)] transition"
              >
                {/* اسم الطفل */}
                <td className="p-4 border-l border-[var(--border)] text-[var(--text)]">
                  {item.childName}
                </td>

                 {/* جنس الطفل */}
                <td className="p-4 border-l border-[var(--border)] text-[var(--text)]">
                  {item.gender}
                </td>
                
                {/* الفصل */}
                <td className="p-4 border-l border-[var(--border)] text-[var(--text)]">
                  {item.classroom?.className || "—"}
                </td>

                {/* أولياء الأمور */}
                <td className="p-4 border-l border-[var(--border)] text-[var(--text)]">
                  {item.guardian?.length > 0 ? (
                    item.guardian.map((g, idx) => (
                      <div key={idx} className="text-sm">
                        {g.phoneNumber} — {g.relationship}
                      </div>
                    ))
                  ) : (
                    "—"
                  )}
                </td>

                {/* نوع الاشتراك */}
                <td className="p-4 border-l border-[var(--border)] text-[var(--text)]">
                  {item.subscription?.durationType || "—"}
                </td>

                {/* الإجراءات */}
                <td className="p-4 border-l border-[var(--border)]">
                  <div className="flex justify-start gap-2 items-center">
                    {/* باقي الإجراءات المعتادة */}
                    <ProfileIcon className="w-[24px] h-[24px] text-[var(--text)] cursor-pointer" />
                    {/* 🔹 عرض آيكون لإضافة طفل إلى فصل فقط إذا لا يوجد classroom */}
                    {!item.classroom && (
                      <>
                      <span className="text-[var(--text)]">+</span>
                      <button className="text-[var(--text)] hover:text-[#f9b236] transition"> 
                        <span className="text-[var(--text)]"><AddToClassroom className="w-[24px] h-[24px] cursor-pointer"/> </span> 
                         </button>

                         </>
                    )}       
                     </div>
                      </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
      </div>

{/* ===== MOBILE CARDS ===== */}
<div className="block md:hidden mt-4 space-y-4">

  {paginated.map((item) => (
    <div 
      key={item._id}
      className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 shadow-sm"
    >
      
      {/* اسم الطفل */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-[18px] font-bold text-[var(--text)]">{item.childName}</h2>

        {/* الإجراءات — نفس منطقك */}
        <div className="flex items-center gap-2">

          {/* يظهر فقط إذا لا يوجد فصل */}
          {!item.classroom && (
            <button 
              title="إضافة الطفل إلى فصل"
              className="text-[var(--text)] hover:text-[#f9b236]"
              onClick={() => console.log("Add child:", item._id)}
            >
              <AddToClassroom className="w-[22px] h-[22px]" />
            </button>
          )}
          <ProfileIcon className="w-[22px] h-[22px] text-[var(--text)]" />
        </div>
      </div>

      {/* الجنس */}
      <p className="text-[var(--text)] text-sm mb-1">
        <span className="font-bold">الجنس: </span>
        {item.gender}
      </p>

      {/* الفصل */}
      <p className="text-[var(--text)] text-sm mb-1">
        <span className="font-bold">الفصل: </span>
        {item.classroom?.className || "—"}
      </p>

      {/* أولياء الأمور */}
      <div className="text-[var(--text)] text-sm mb-1">
        <span className="font-bold">أولياء الأمور:</span>
        <div className="mt-1 space-y-1">
          {item.guardian?.map((g, idx) => (
            <p key={idx} className="text-[13px] opacity-80">
              {g.phoneNumber} — {g.relationship}
            </p>
          ))}
        </div>
      </div>

      {/* الاشتراك */}
      <p className="text-[var(--text)] text-sm">
        <span className="font-bold">الاشتراك: </span>
        {item.subscription?.durationType || "—"}
      </p>

    </div>
  ))}
</div>

      {/* ===== Pagination ===== */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <p className="text-[#9e9e9e] text-[20px]">
            صفحة {page} من {totalPages}
          </p>

          {/* Pages */}
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="text-[var(--text)] disabled:opacity-30"
            >
              ←
            </button>

            {[...Array(totalPages)].map((_, idx) => {
              const number = idx + 1;
              return (
                <button
                  key={number}
                  onClick={() => setPage(number)}
                  className={`px-4 py-2 rounded border ${
                    page === number
                      ? "bg-[#f9b236] text-white"
                      : "bg-white text-[#9e9e9e]"
                  }`}
                >
                  {number}
                </button>
              );
            })}

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="text-[var(--text)] disabled:opacity-30"
            >
              →
            </button>
          </div>

          <div className="flex gap-2 items-center">
            <span className="text-[#9e9e9e] text-[20px]">Show</span>
            <div className="px-4 py-2 border rounded bg-white text-[#9e9e9e]">
              10
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
