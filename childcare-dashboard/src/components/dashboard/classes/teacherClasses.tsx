"use client";

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import ChildrenIcon from "../../../../public/icons/childrenIcon";
import axios from "axios";
import Classes from "../popUps/Classroom";

interface Child {
  _id: string;
  childName: string;
}

interface Classroom {
  id: string;
  name: string;
  childrenCount: number;
  children?: Child[];
}

const TeacherClassrooms = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
  const [openPopup, setOpenPopup] = useState(false);

  // ---------------- GET ALL CLASSROOMS ----------------
  const fetchClassrooms = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/TeacherClassrooms`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formatted = res.data.classrooms.map((cls: any) => ({
        id: cls._id,
        name: cls.className,
        childrenCount: cls.children?.length || 0,
      }));

      setClassrooms(formatted);
    } catch (error) {
      console.log("Error fetching classrooms:", error);
    }
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  // ---------------- GET ONE CLASSROOM ----------------
  const fetchOneClassroom = async (id: string) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/classrooms/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const cls = res.data.classroom;

      setSelectedClassroom({
        id: cls._id,
        name: cls.className,
        childrenCount: cls.children?.length || 0,
        children: cls.children || [],
      });

      setOpenPopup(true);
    } catch (error) {
      console.log("Error fetching classroom:", error);
    }
  };

  // ---------------- ADD CLASSROOM ----------------
  const handleAddClassroom = () => {
    Swal.fire({
      title: "إضافة فصل جديد",
      input: "text",
      inputPlaceholder: "اكتب اسم الفصل...",
      showCancelButton: true,
      confirmButtonText: "إضافة",
      cancelButtonText: "إلغاء",
      confirmButtonColor: "#F9B236",
      cancelButtonColor: "#777",
    }).then(async (result) => {
      if (!result.isConfirmed || !result.value.trim()) return;

      try {
        const token = localStorage.getItem("token");

        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/addClassroom`,
          { className: result.value.trim() },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        Swal.fire("تم إضافة الفصل!", "", "success");
        fetchClassrooms();
      } catch (error: any) {
        Swal.fire("خطأ", error.response?.data?.message || "", "error");
      }
    });
  };

  // ---------------- DELETE CLASSROOM ----------------
  const handleDeleteClassroom = async (id: string) => {
    Swal.fire({
      title: "هل أنتِ متأكدة من الحذف؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "حذف",
      cancelButtonText: "إلغاء",
      confirmButtonColor: "#d33",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        const token = localStorage.getItem("token");

        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/deleteClassroom/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        Swal.fire("تم الحذف!", "", "success");
        setOpenPopup(false);
        fetchClassrooms();
      } catch {
        Swal.fire("خطأ", "لم يتم الحذف", "error");
        
      }
    });
  };

  // ---------------- ADD MULTIPLE CHILDREN ----------------
  const handleAddChild = async (classroomId: string, childrenIds: string[]) => {
    if (!childrenIds || childrenIds.length === 0) return;

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/addChildClassroom`,
        { classroomId, childrenIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      Swal.fire({
        icon: "success",
        title: "تمت إضافة الأطفال!",
        didOpen: () => {
             const swal = document.querySelector(".swal2-container") as HTMLElement;
             if (swal) swal.style.zIndex = "40000";
  }
});
      
      // تحديث الفصل
      fetchOneClassroom(classroomId);
      fetchClassrooms();

    } catch {
Swal.fire({
  icon: "error",
  title: "خطأ",
  text: "فشل في إضافة الأطفال",
  didOpen: () => {
    const swal = document.querySelector(".swal2-container") as HTMLElement;
    if (swal) swal.style.zIndex = "40000";
  }
});
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="w-full bg-[var(--bg)] p-3 md:p-2" dir="rtl">
      
      {/* -------- Header -------- */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-[28px] font-bold text-[var(--text)]">الفصول</h1>

        <button
          onClick={handleAddClassroom}
          className="bg-[#F9B236] text-white font-bold px-6 py-2 rounded-lg hover:bg-[#e4a02f] transition-all"
        >
          إضافة فصل جديد
        </button>
      </div>

      {/* -------- Classrooms Grid -------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {classrooms.map((cls) => (
          <div
            key={cls.id}
            onClick={() => fetchOneClassroom(cls.id)}
            className="cursor-pointer bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
          >
            <h2 className="text-2xl font-bold text-[var(--text)] mb-3">
              {cls.name}
            </h2>

            <div className="w-full h-px bg-[var(--border)] mb-4"></div>

            <div className="flex justify-start items-center gap-2 text-md text-[var(--text)]">
              <ChildrenIcon className="h-5 w-5 mt-[-5px]" />
              <span>الأطفال: {cls.childrenCount} طفل</span>
            </div>
          </div>
        ))}
      </div>

      {/* -------- POPUP -------- */}
      <Classes
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        classroom={selectedClassroom}
        onDelete={() =>
          selectedClassroom && handleDeleteClassroom(selectedClassroom.id)
        }
        onAddChild={(childrenIds) =>
          selectedClassroom &&
          handleAddChild(selectedClassroom.id, childrenIds)
        }
      />
    </div>
  );
};

export default TeacherClassrooms;
