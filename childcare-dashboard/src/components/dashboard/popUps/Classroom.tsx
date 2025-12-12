"use client";

import React, { useState } from "react";
import axios from "axios";
import ChildrenIcon from "../../../../public/icons/childrenIcon";

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

export interface PopupProps {
  open: boolean;
  onClose: () => void;
  classroom: Classroom | null;
  onDelete: () => void;
  onAddChild: (childIds: string[]) => void;   // ← important update
}

const ClassroomPopup: React.FC<PopupProps> = ({
  open,
  onClose,
  classroom,
  onDelete,
  onAddChild,
}) => {
  const [childPopup, setChildPopup] = useState(false);
  const [childList, setChildList] = useState<Child[]>([]);
  const [loadingChildren, setLoadingChildren] = useState(false);

  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);

  // ---------------- FETCH TEACHER CHILDREN ----------------
  const fetchTeacherChildren = async () => {
    try {
      setLoadingChildren(true);

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/ChildrenWhithoutClasses`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setChildList(res.data.children);
      setLoadingChildren(false);
    } catch (error) {
      console.log("Error fetching children:", error);
      setLoadingChildren(false);
    }
  };

  const toggleChild = (childId: string) => {
    setSelectedChildren((prev) =>
      prev.includes(childId)
        ? prev.filter((id) => id !== childId)
        : [...prev, childId]
    );
  };

  if (!open || !classroom) return null;

  return (
    <>
      {/* ----------- MAIN CLASSROOM POPUP ----------- */}
      <div
        className="fixed inset-0 bg-[#373737]/50 flex justify-center items-center z-[9999]"
        onClick={onClose}
      >
        <div
          className="bg-white w-[90%] md:w-[480px] rounded-lg p-6 shadow-lg max-h-[85vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* عنوان الفصل */}
          <h2 className="text-2xl font-bold text-[#373737] mb-4">
            {classroom.name}
          </h2>

          {/* عدد الأطفال */}
          <div className="flex items-center gap-2 mb-3">
            <ChildrenIcon className="h-6 w-6" />
            <span className="text-lg">
              عدد الأطفال: {classroom.children?.length || 0}
            </span>
          </div>

          {/* قائمة الأطفال */}
          <div className="bg-gray-50 p-3 rounded-lg h-[200px] overflow-y-auto mb-4 border">
            {classroom.children && classroom.children.length > 0 ? (
              classroom.children.map((child) => (
                <p key={child._id} className="py-2 text-[#333]">
                  {child.childName}
                </p>
              ))
            ) : (
              <p className="text-gray-500">لا يوجد أطفال</p>
            )}
          </div>

<div className="flex mt-4 justify-between items-center w-full">

  {/* يسار: إضافة + حذف */}
  <div className="flex gap-2">
    <button
      onClick={() => {
        setChildPopup(true);
        fetchTeacherChildren();
      }}
      className="bg-[#F9B236] text-white px-4 py-2 rounded-lg"
    >
      إضافة طفل
    </button>

    <button
      onClick={onDelete}
      className="bg-red-500 text-white px-4 py-2 rounded-lg"
    >
      حذف الفصل
    </button>
  </div>

  {/* يمين: إغلاق */}
  <button
    onClick={onClose}
    className="bg-gray-400 text-white px-4 py-2 rounded-lg"
  >
    إغلاق
  </button>

</div>
        </div>
      </div>

      {/* ----------- CHILD PICK POPUP (MULTI SELECT) ----------- */}
      {childPopup && (
        <div
          className="fixed inset-0 bg-[#373737]/50 flex justify-center items-center z-[9999]"
          onClick={() => setChildPopup(false)}
        >
          <div
            className="bg-white w-[85%] md:w-[380px] rounded-lg p-5 shadow-lg max-h-[70vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-[#333] mb-4 text-center">
              اختيار الأطفال
            </h3>

            {loadingChildren ? (
              <p className="text-center text-gray-500">جاري التحميل...</p>
            ) : childList.length === 0 ? (
              <p className="text-center text-gray-500">
                لا يوجد أطفال مسجلين بدون فصل
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {childList.map((child) => (
                  <label
                    key={child._id}
                    className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer bg-white hover:bg-gray-100"
                  >
                    <input
                      type="checkbox"
                      checked={selectedChildren.includes(child._id)}
                      onChange={() => toggleChild(child._id)}
                    />
                    <span>{child.childName}</span>
                  </label>
                ))}
              </div>
            )}

            {/* زر إضافة الجميع */}
            <button
              disabled={selectedChildren.length === 0}
              onClick={() => {
                onAddChild(selectedChildren);
                setSelectedChildren([]);
                setChildPopup(false);
              }}
              className="mt-4 bg-[#F9B236] text-white px-4 py-2 rounded-lg w-full disabled:bg-gray-300"
            >
              إضافة الأطفال المحددين
            </button>

            <button
              onClick={() => setChildPopup(false)}
              className="mt-3 bg-gray-400 text-white px-4 py-2 rounded-lg w-full"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ClassroomPopup;
