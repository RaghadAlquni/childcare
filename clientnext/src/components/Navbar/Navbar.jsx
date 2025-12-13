"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import logo from "../../../public/wmLogo.png";
import Link from "next/link";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Home");

  // ⭐ Scroll Spy
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // ⭐ Helper function لتسهيل لون الرابط
  const linkClass = (id) =>
    `transition font-bold ${
      activeSection === id ? "text-[#F9B236]" : "text-[#292929]"
    } hover:text-[#F9B236]`;

  return (
    <header
      className="bg-white py-3 px-6 md:px-12 shadow-sm flex justify-between items-center w-full md:fixed md:top-0 md:left-0 md:right-0 md:z-50"
      dir="rtl"
    >
      {/* Logo */}
      <div className="flex items-center">
        <Image
          src={logo}
          alt="واحة المعرفة"
          width={90}
          height={90}
          className="object-contain"
        />
      </div>

      {/* Navigation Links */}
      <nav className="hidden lg:flex items-center gap-20 text-[18px] font-bold">
        <Link href="/#Home" className={linkClass("Home")}>
          الرئيسية
        </Link>
        <Link href="/#About" className={linkClass("About")}>
          من نحن؟
        </Link>
        <Link href="/#Servive" className={linkClass("Servive")}>
          الخدمات
        </Link>
        <Link href="/#Branch" className={linkClass("Branch")}>
          الفروع
        </Link>
        <Link href="/#Events" className={linkClass("Events")}>
          أخبارنا
        </Link>
        <Link href="/career" className={linkClass("career")}>
          التوظيف
        </Link>
      </nav>

      {/* Buttons */}
      <div className="hidden md:flex items-center gap-4">
        <button className="bg-[#F9B236] text-white rounded-full py-[8px] px-[20px] font-bold hover:opacity-90 transition">
          تواصل معنا
        </button>
      </div>

      {/* Mobile Menu Icon */}
      <div
        className="flex flex-col justify-between w-[28px] h-[22px] cursor-pointer lg:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span
          className={`h-[3px] bg-[#292929] rounded-md transition-transform duration-300 ${
            menuOpen ? "rotate-45 translate-y-[8px]" : ""
          }`}
        ></span>
        <span
          className={`h-[3px] bg-[#292929] rounded-md transition-opacity duration-300 ${
            menuOpen ? "opacity-0" : ""
          }`}
        ></span>
        <span
          className={`h-[3px] bg-[#292929] rounded-md transition-transform duration-300 ${
            menuOpen ? "-rotate-45 -translate-y-[8px]" : ""
          }`}
        ></span>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 w-[260px] h-full bg-white shadow-2xl flex flex-col items-center pt-24 gap-6 text-[18px] font-bold transition-transform duration-500 ease-in-out z-50 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <Link href="/#Home" className={linkClass("Home")} onClick={() => setMenuOpen(false)}>
          الرئيسية
        </Link>

        <Link href="/#About" className={linkClass("About")} onClick={() => setMenuOpen(false)}>
          من نحن؟
        </Link>

        <Link href="/#Servive" className={linkClass("Servive")} onClick={() => setMenuOpen(false)}>
          الخدمات
        </Link>

        <Link href="/#Branch" className={linkClass("Branch")} onClick={() => setMenuOpen(false)}>
          الفروع
        </Link>

        <Link href="/#Events" className={linkClass("Events")} onClick={() => setMenuOpen(false)}>
          أخبارنا
        </Link>

        <Link href="/career" className={linkClass("career")} onClick={() => setMenuOpen(false)}>
          التوظيف
        </Link>

        <div className="mt-6 flex flex-col items-center gap-3">
          <button
            className="bg-[#F9B236] text-white rounded-full py-[8px] px-[20px] font-bold"
            onClick={() => setMenuOpen(false)}
          >
            تواصل معنا
          </button>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
