"use client";
import React from "react";
import { FaTiktok, FaWhatsapp, FaInstagram, FaSnapchatGhost } from "react-icons/fa";


const Footer = () => {
  return (
    <footer dir="rtl" className="relative overflow-hidden bg-white">
      {/* الخلفية */}
      <div className="absolute inset-0 bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-10/8j14yRhvSU.png')] bg-cover bg-no-repeat opacity-100" />

      {/* المحتوى */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-10 lg:px-12 py-12 lg:py-16 ">
        {/* تخطيط الأعمدة: شعار + نص | أقسام | تواصل */}
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr_1fr] gap-12 lg:gap-16 items-start">
          
          {/* 🟢 العمود 1 — الشعار + النص (اليمين) */}
          <div className="flex flex-col items-start text-right">
            <img
              src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-10/B3awCHTEvF.png"
              alt="شعار واحة المعرفة"
              className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] object-contain mb-0 mr-[-20]"
            />
            <p className="text-[#000] text-base md:text-lg leading-[1.9] max-w-md w-full">
              نعمل جاهدين من أجل بناء شخصية الطفل في تنمية قدراته ومهاراته
              لبناء جيل تربوي وموهوب. نقدّم العديد من الفعاليات التعليمية
              والترفيهية والفنيّة ضمن بيئة محفزة وآمنة.
            </p>
          </div>

          {/* 🟡 العمود 2 — أقسام المركز (الوسط) */}
          <nav className="flex flex-col items-start text-right md:items-center md:text-center mt-30">
            <h3 className="text-[#F9B236] font-bold text-xl md:text-2xl mb-4">
              أقسام المركز
            </h3>
            <ul className="space-y-2 md:space-y-2.5">
              {[
                "الرئيسية",
                "من نحن؟",
                "الخدمات",
                "الفروع",
                "الفعاليات والأخبار",
                "التوظيف",
              ].map((label) => (
                <li key={label}>
                  <a className="text-[#4d4c4c] text-base md:text-lg hover:text-[#F9B236] transition cursor-pointer">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* 🔸 العمود 3 — تواصل مع المركز (اليسار) */}
          <div className="flex flex-col items-start text-right md:items-start md:text-center mt-30">
            <h3 className="text-[#F9B236] font-bold text-xl md:text-2xl mb-4">
              تواصل مع المركز
            </h3>

            <div className="flex items-center gap-3 mb-2">
              <img
                src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-10/Z5fbKWyGWZ.png"
                alt="phone"
                className="w-5 h-5 md:w-6 md:h-6"
              />
              <span className="text-[#4d4c4c] text-base md:text-lg">
                0536691319
              </span>
            </div>

            <div className="flex items-center gap-3">
              <img
                src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-10/sZUuwp0GTm.png"
                alt="email"
                className="w-5 h-5 md:w-6 md:h-6"
              />
              <span className="text-[#4d4c4c] text-base md:text-lg">
                alm3rfh2020@outlook.sa
              </span>
            </div>

            <div className="mt-5">
              <span className="block text-[#F9B236] font-bold text-lg mb-2">
                تابعنا:
              </span>
             <div className="flex w-[180px] gap-[14px] items-center justify-start flex-nowrap relative z-[16]">
      <a
        href="https://tiktok.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 hover:text-[#010101] transition-colors duration-300 text-[25px]"
      >
        <FaTiktok />
      </a>

      <a
        href="https://wa.me/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 hover:text-[#25D366] transition-colors duration-300 text-[25px]"
      >
        <FaWhatsapp />
      </a>

      <a
        href="https://instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 hover:text-[#E1306C] transition-colors duration-300 text-[25px]"
      >
        <FaInstagram />
      </a>

      <a
        href="https://snapchat.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 hover:text-[#F9B236] transition-colors duration-300 text-[25px]"
      >
        <FaSnapchatGhost />
      </a>
    </div>
            </div>
          </div>
        </div>
      </div>

      {/* حقوق النشر */}
      <div className="relative z-10 border-t border-[#ECECEC]">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 lg:px-12">
          <div className="flex items-center justify-center gap-2 py-4 text-[#4d4c4c] text-sm">
            <span>© {new Date().getFullYear()} مركز واحة المعرفة</span>
            <span className="inline-block w-2 h-2 rounded-full bg-pink-300" />
            <span>جميع الحقوق محفوظة.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;