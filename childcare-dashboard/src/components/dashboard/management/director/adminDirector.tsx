"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";import StaffIcon from "../../../../../public/icons/staff";
import ChildrenIcon from "../../../../../public/icons/childrenIcon";
import ClockIcon from "../../../../../public/icons/clock";
import HomeIcon from "../../../../../public/icons/homeIcon";
import PhoneIcon from "../../../../../public/icons/phone";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";


interface Director {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  branch: string;  
  shift: string;
  employeesCount: number;
  childrenCount: number;
  avatar: string;
  
}


const adminDirector = () => {

  const { user } = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);

  const [directors, setDirectors] = useState<Director[]>([]);
  const [loading, setLoading] = useState(true);

   const getAllDirectors = async () => {
    try {
    console.log("🔴 TOKEN BEFORE REQUEST:", token);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/directors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDirectors(res.data.directors);
      console.log("TOKEN:", token);

    } catch (error: any) {
      console.log("Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllDirectors();
  }, []);


  return (
    
    <main className="w-full bg-[var(--bg)] px-4 md:px-8 py-2">

      {/* العنوان */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">

        <h1 className="text-[24px] font-bold text-right text-[var(--text)]">
          <span className="text-[#d5d5d5] text-[20px] md:font-meduim"> الإدارة / </span> مدراء الفروع 
        </h1>
      </div>
 {/* Loading */}
      {loading && <p className="text-center text-[var(--text)] mt-10">جاري التحميل...</p>}

      {/* لا يوجد بيانات */}
      {!loading && directors.length === 0 && (
        <p className="text-center text-[var(--text)] mt-10">لا يوجد مديرين</p>
      )}


      {/* الكروت */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">

        {directors.map((director) => (
          <div
            key={director._id}
            className="w-full bg-[var(--card)] rounded-xl border border-[var(--border)] shadow-sm p-4 flex flex-col gap-4">
        {/* الصورة + الاسم/الوظيفة */}
            <div className="flex items-center gap-4">
              {/* الصورة */}
              <div
                className="w-18 h-18 rounded-xl bg-cover bg-center"
                style={{ backgroundImage: `url(${director.avatar})` }}
              />

              {/* الاسم + الرول */}
              <div className="flex flex-col text-right gap-1">
                <h3 className="text-lg font-bold mt-2 text-[var(--text)]">
                  {director.fullName}
                </h3>
                <p className="text-lg text-[var(--text)]"> مديرة فرع </p>
              </div>
            </div>

            <div className="w-full h-px bg-gray-100" />

            {/* البيانات */}
            <div className="flex flex-col gap-2 text-right ">
              <p className="flex text-md text-[var(--text)]"> <HomeIcon className="w-4 h-4 mt-[0.8px] ml-1"/> الفرع : {director.branch}</p>
              <p className="flex text-md text-[var(--text)]"> <ClockIcon className="w-4 h-4 mt-[0.8px] ml-1"/> الفترة : {director.shift} </p>
              <p className="flex text-md text-[var(--text)]"> <StaffIcon className="w-4 h-4 mt-[0.8px] ml-1" />
                الموظفون : {director.employeesCount || 0}
              </p>
              <p className="flex text-md text-[var(--text)]"> <ChildrenIcon className="w-4 h-4 mt-[0.5px] ml-1"/>
                الأطفال : {director.childrenCount || 0} 
              </p>
            </div>

            <div className="w-full h-px bg-gray-100" />

            {/* التفاصيل + رقم الهاتف */}
<div className="flex items-center justify-between w-full text-right">

  {/* الهاتف */}
  <div className="flex items-center text-md text-[var(--text)]">
    <PhoneIcon className="w-4 h-4 ml-1" />
    {director.phone}
  </div>

  {/* زر التفاصيل */}
  <button className="text-sm underline text-[var(--text)] cursor-pointer">
    اعرض التفاصيل
  </button>
</div>

          </div>
        ))}

      </div>
    </main>
  );
}
export default adminDirector;