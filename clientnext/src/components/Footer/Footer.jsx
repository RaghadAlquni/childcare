"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image"; 
import { FaTiktok, FaWhatsapp, FaInstagram, FaSnapchatGhost } from "react-icons/fa";

const Footer = () => {
  return (
    <footer dir="rtl" className="relative overflow-x-hidden overflow-y-hidden bg-white">
      
      {/* الخلفية */}
      <div className="absolute inset-0 bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-10/8j14yRhvSU.png')] bg-cover bg-no-repeat opacity-100" />

      {/* المحتوى */}
      <div
        className="
          relative z-10 max-w-[1280px] mx-auto
          px-6 md:px-10 lg:px-12 
          py-20 md:py-16 lg:py-16 
          overflow-x-hidden
        "
      >
        {/* تخطيط الأعمدة */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 items-start overflow-x-hidden">

          {/* 🟢 العمود 1 — الصورة + النص */}
          <div className="flex flex-col lg:flex-row lg:items-start gap-5 text-right w-full overflow-x-hidden">

            <Image
              src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-10/B3awCHTEvF.png"
              alt="شعار واحة المعرفة"
              width={120}
              height={120}
              className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] object-contain shrink-0"
            />

            <p className="text-[#000] text-base md:text-lg leading-[1.9] max-w-md w-full">
              نعمل جاهدين من أجل بناء شخصية الطفل في تنمية قدراته ومهاراته
              لبناء جيل تربوي وموهوب. نقدّم العديد من الفعاليات التعليمية
              والترفيهية والفنية ضمن بيئة محفزة وآمنة.
            </p>
          </div>

          {/* 🟡 العمود 2 — أقسام المركز */}
          <nav className="flex flex-col items-start text-right md:items-center md:text-center w-full overflow-x-hidden">
            <h3 className="text-[#F9B236] font-bold text-xl md:text-2xl mb-4">
              أقسام المركز
            </h3>

            <ul className="space-y-2 md:space-y-2.5">
              <li><Link href="/#Home" className="footer-link">الرئيسية</Link></li>
              <li><Link href="/#About" className="footer-link">من نحن؟</Link></li>
              <li><Link href="/#Services" className="footer-link">الخدمات</Link></li>
              <li><Link href="/#Branches" className="footer-link">الفروع</Link></li>
              <li><Link href="/#Events" className="footer-link">الفعاليات والأخبار</Link></li>
              <li><Link href="/jobs" className="footer-link">التوظيف</Link></li>
            </ul>
          </nav>

          {/* 🔸 العمود 3 — تواصل مع المركز */}
          <div className="flex flex-col items-start text-right md:items-start md:text-center w-full overflow-x-hidden">
            <h3 className="text-[#F9B236] font-bold text-xl md:text-2xl mb-4">
              تواصل مع المركز
            </h3>

            <div className="flex items-center gap-3 mb-2">
              <Image
                src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-10/Z5fbKWyGWZ.png"
                alt="رقم الجوال"
                width={24}
                height={24}
                className="w-5 h-5 md:w-6 md:h-6"
              />
              <span className="text-[#4d4c4c] text-base md:text-lg">
                0555555555
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Image
                src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-10/sZUuwp0GTm.png"
                alt="البريد الإلكتروني"
                width={24}
                height={24}
                className="w-5 h-5 md:w-6 md:h-6"
              />
              <span className="text-[#4d4c4c] text-base md:text-lg">
                alm3rfh@example.sa
              </span>
            </div>

            <div className="mt-5">
              <span className="block text-[#F9B236] font-bold text-lg mb-2">
                تابعنا:
              </span>

              <div className="flex w-[180px] gap-[14px] items-center justify-start">
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="social-icon"><FaTiktok /></a>
                <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="social-icon"><FaWhatsapp /></a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon"><FaInstagram /></a>
                <a href="https://snapchat.com" target="_blank" rel="noopener noreferrer" className="social-icon"><FaSnapchatGhost /></a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* حقوق النشر */}
      <div className="relative z-10 border-t border-[#ECECEC] overflow-x-hidden">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 lg:px-12">
          <div className="flex items-center justify-center gap-2 py-4 text-[#4d4c4c] text-sm">
            <span>©️ {new Date().getFullYear()} مركز واحة المعرفة</span>
            <span className="inline-block w-2 h-2 rounded-full bg-pink-300" />
            <span>جميع الحقوق محفوظة.</span>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
