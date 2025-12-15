"use client";

import { motion } from "framer-motion";
import ParentChildPopup from "@/components/PopUps/AddChild"; 
import Link from "next/link";
import { useState } from "react";

const Home = () => {
  const [openPopup, setOpenPopup] = useState(false);

  return (
    <section
      id="Home"
      className="main-container flex flex-col-reverse lg:flex-row justify-center items-center w-full max-w-[1440px] min-h-screen px-6 md:px-16 mx-auto relative overflow-x-hidden"
    >
      {/* 🩵 النصوص */}
      <div className="flex flex-col items-start text-right gap-6 w-full lg:w-[600px] z-[2] mt-10 lg:mt-0">
        <div className="flex flex-col items-start text-right gap-2">
          <span className="text-[#f9b236] text-lg md:text-xl font-bold">
            مرحبًا بك في مركز واحة المعرفة
          </span>
          <h1 className="text-[#282828] text-[32px] md:text-[48px] font-bold leading-snug md:leading-[58px]">
            ضيافة آمنة.. طفولة سعيدة
          </h1>
        </div>

        <p className="text-[#282828] text-[16px] md:text-[20px] leading-[28px] md:leading-[32px]">
          في واحة المعرفة نصنع لأطفالكم بيئة آمنة وممتعة تجمع بين اللعب
          والتعلم، ليقضوا أوقاتًا مليئة بالمرح والاكتشاف وأنتم مطمئنون.
        </p>

        {/* زر تسجيل طفل */}
        <div className="flex gap-4 justify-end mt-2">
          <button
            className="px-6 py-2 rounded-[99px] bg-[#f9b236] text-white text-[16px] md:text-[18px] hover:bg-[#e1a42e] transition font-bold"
            onClick={() => setOpenPopup(true)}
          >
            تسجيل طفل
          </button>

          <Link href="/#About" className="px-6 py-2 rounded-[99px] bg-[#f9b236] text-white text-[16px] md:text-[18px] hover:bg-[#e1a42e] transition font-bold">
            قراءة المزيد
          </Link>
        </div>

        <div className="flex items-center justify-end gap-3 mt-4">
          <div className="flex -space-x-3">
            {[
              "C0REGSCdTe.png",
              "760gZCdJkH.png",
              "Tbp2WXyxaq.png",
              "TfhtrsGhkf.png",
            ].map((img, i) => (
              <div
                key={i}
                className="w-[30px] h-[30px] md:w-[36px] md:h-[36px] rounded-full border border-[#f5f5f5] bg-white shadow-sm"
                style={{
                  backgroundImage: `url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-02/${img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            ))}
          </div>

          <span className="text-[#282828] text-[14px] md:text-[16px]">
            بفخر.. خرجنا أكثر من ٤٠ ألف طفل وطفلة خلال ٥ سنوات من العطاء
          </span>
        </div>
      </div>

      {/* الصورة المتحركة */}
      <motion.div
        className="
          relative flex justify-center items-center
          w-full
          md:w-[70%]
          md:-translate-y-5
          md:translate-x-[10px]
          lg:w-[45%]
          overflow-visible
        "
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* الخلفية */}
        <motion.div
          className="absolute w-[380px] h-[380px] sm:w-[440px] sm:h-[440px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-02/8R7RgwGLn8.png')] bg-contain bg-no-repeat"
          animate={{ scale: [1, 1.05, 1], rotate: [0, 1, -1, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* صورة الطفل */}
        <motion.div
          className="relative z-[1] w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] md:w-[440px] md:h-[440px] lg:w-[500px] lg:h-[500px] bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-02/EpDerqs3cc.png')] bg-contain bg-no-repeat"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Popup */}
      <ParentChildPopup open={openPopup} setOpen={setOpenPopup} />
    </section>
  );
};

export default Home;
