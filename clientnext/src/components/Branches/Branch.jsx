"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Branch = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBranches = async () => {
    try {
      const res = await axios.get(
  `http://localhost:5000/activeBranchs`, { withCredentials: true }
);

      // حماية من undefined
      const branchData = res?.data?.data || [];

      // فلترة النشط فقط
      const activeBranches = branchData.filter(
        (b) => b?.status === "نشط"
      );

      const formatted = activeBranches.map((b) => ({
        branchName: b?.branchName || "",
        city: b?.city || "",
        district: b?.district || "",
        branchImg:
          b?.branchImg ||
          "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-05/aK9FMXdUq7.png",
      }));

      setBranches(formatted);
    } catch (error) {
      console.log("FULL ERROR:", error);
  console.log("RESPONSE:", error?.response);
  console.log("DATA:", error?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  return (
    <section id="Branch" className="relative w-full py-16 pt-20 overflow-hidden">

      {/* الخلفية */}
      <div className="absolute inset-0 bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-13/LUOrLgnyOU.png')] bg-cover bg-no-repeat opacity-100"></div>

      {/* المحتوى */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-10 md:pt-9 text-center">

        {/* العنوان */}
        <h1 className="text-4xl md:text-5xl font-bold text-[#282828] mb-6 leading-tight text-center mx-auto w-full flex justify-center">
          ضيافات <span className="text-[#F9B236] mx-2">واحة المعرفة</span>
        </h1>

        {/* الكروت */}
        <div className="mt-12 flex flex-col lg:flex-row justify-center items-stretch gap-8">

          {loading ? (
            <p className="text-xl text-gray-600">جارِ التحميل...</p>
          ) : branches.length === 0 ? (
            <p className="text-xl text-gray-600">لا توجد فروع حالياً</p>
          ) : (
            branches.slice(0, 3).map((branch, index) => (
              <div
                key={index}
                className="
                group relative flex flex-col items-center 
                bg-white rounded-[20px] overflow-hidden
                border border-[#f1f1f1] shadow-[0px_4px_20px_rgba(0,0,0,0.05)]
                w-full lg:max-w-[380px]
                transition-all duration-500 hover:-translate-y-1 mx-auto
              "
              >
                {/* الصورة */}
                <div
                  className="w-full h-[240px] bg-cover bg-center"
                  style={{ backgroundImage: `url(${branch.branchImg})` }}
                ></div>

                {/* النص */}
                <div className="py-6 flex flex-col gap-2 text-right w-full px-4">
                  <span className="text-[20px] font-medium text-[#4d4c4c]">
                    فرع
                  </span>

                  <span className="text-[26px] font-bold text-[#f9b236]">
                    {branch.branchName}
                  </span>

                  <span className="text-[18px] text-[#7b7b7b]">
                    {branch.city}، حي {branch.district}
                  </span>
                </div>
              </div>
            ))
          )}

        </div>

        {/* زر المزيد */}
        <div className="mt-10 flex justify-center">
          <button
            className="
            bg-[#f9b236] text-white text-[20px] 
            font-medium rounded-full 
            px-10 py-3 shadow-md
            hover:bg-[#e7a22e] transition
          "
          >
            المزيد من الضيافات
          </button>
        </div>

      </div>
    </section>
  );
};

export default Branch;
