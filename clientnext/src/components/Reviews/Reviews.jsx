"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const reviewsData = [
  {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco. Duis aute irure dolor in reprehenderit in voluptate velit esse.",
    name: "Raghad Alquni",
    role: "Parents",
    img: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-14/60A2SiEYQE.png",
  },
  {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco. Duis aute irure dolor in reprehenderit in voluptate velit esse.",
    name: "Ahlam Mohammed",
    role: "Parent",
    img: "https://randomuser.me/api/portraits/women/71.jpg",
  },
  {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco. Duis aute irure dolor in reprehenderit in voluptate velit esse.",
    name: "Lama Saad",
    role: "Guardian",
    img: "https://randomuser.me/api/portraits/women/32.jpg",
  },
];

const Reviews = () => {
  const [index, setIndex] = useState(0);

  // auto change every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % reviewsData.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const current = reviewsData[index];

  return (
    <div className="relative w-[90%] mx-auto my-15 rounded-[60px] overflow-hidden">

      {/* الخلفية + الأوفرلاي */}
      <div className="absolute inset-0 bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-14/ki3d0zGgQz.png')] bg-cover bg-no-repeat z-[1]">
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* المحتوى فوق الخلفية */}
      <div className="relative z-[10] flex flex-col lg:flex-row items-center justify-between gap-10 p-10 lg:p-14">

        {/* العنوان الجانبي */}
        <div className="text-white text-right lg:w-[35%]">
          <h2 className="text-[50px] md:text-[64px] font-bold leading-[70px] md:leading-[80px]">
            ماذا قالوا عن
            <br />
            واحة المعرفة ؟
          </h2>
        </div>

        {/* الصندوق الأبيض — الأنيميشن */}
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -80 }}      // يدخل من اليسار
            animate={{ opacity: 1, x: 0 }}        // في المنتصف
            exit={{ opacity: 0, x: 80 }}          // يطلع لليمين
            transition={{ duration: 0.7 }}

            className="bg-white w-full lg:w-[65%] rounded-[60px] p-10 flex flex-col gap-10 shadow-sm"
          >

            <p className="text-[20px] md:text-[22px] text-black leading-8 font-medium">
              "{current.text}"
            </p>

            <div className="flex items-center justify-between mt-4">
              
              <div className="flex items-center gap-5">
                <div
                  className="w-[60px] h-[60px] rounded-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url('${current.img}')`,
                  }}
                ></div>

                <div>
                  <h3 className="text-[24px] font-bold text-[#f9b236]">
                    {current.name}
                  </h3>
                  <p className="text-[20px] font-medium text-[#129cc1]">
                    {current.role}
                  </p>
                </div>
              </div>

              <div
                className="w-[120px] h-[70px] bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-14/KE6Vw8YY7M.png')",
                }}
              ></div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* السلايدرز تحت */}
      <div className="relative z-[20] flex justify-center gap-3 pb-6">
        {reviewsData.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === index ? "bg-[#f9b236] scale-125" : "bg-white/50"
            }`}
          ></div>
        ))}
      </div>

    </div>
  );
};

export default Reviews;