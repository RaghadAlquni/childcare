"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
} from "@/redux/authSlice";
import { jwtDecode } from "jwt-decode";
import { api } from "@/lib/axios";
import Swal from "sweetalert2";

interface DecodedToken {
  _id: string;
  fullName: string;
  role: string;
  shift: string;
  branch?: string;
  exp: number;
}

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    let newErrors: any = {};

    if (!email.trim()) newErrors.email = "يرجى إدخال البريد الإلكتروني";
    if (!password.trim()) newErrors.password = "يرجى إدخال كلمة المرور";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Swal.fire({
        title: "تنبيه",
        text: "يرجى تعبئة جميع الحقول المطلوبة",
        icon: "warning",
        confirmButtonText: "حسناً",
        didOpen: () => {
          const el = document.querySelector(".swal2-container") as HTMLElement;
          if (el) el.style.zIndex = "20000";
        },
      });
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      dispatch(loginRequest());

      const res = await api.post("/login", { email, password });

      const token = res.data.token;

      localStorage.setItem("token", token);

      const decoded = jwtDecode<DecodedToken>(token);

      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: decoded._id,
          fullName: decoded.fullName,
          role: decoded.role,
          shift: decoded.shift,
          branch: decoded.branch ?? null,
        })
      );

      dispatch(loginSuccess(token));

      await Swal.fire({
        title: "تم تسجيل الدخول بنجاح",
        text: `أهلاً ${decoded.fullName}!`,
        icon: "success",
        timer: 1500,
        confirmButtonText: "متابعة",
        didOpen: () => {
          const el = document.querySelector(".swal2-container") as HTMLElement;
          if (el) el.style.zIndex = "20000";
        },
      });

      const role = decoded.role.toLowerCase();

      if (role === "admin") router.push("/dashboard?role=admin");
      else if (role === "director") router.push("/dashboard?role=director");
      else if (role === "teacher") router.push("/dashboard?role=teacher");
      else if (role === "assistant_teacher") router.push("/dashboard?role=assistant_teacher");

    } catch (err) {
      dispatch(loginFailure("خطأ في تسجيل الدخول"));

      Swal.fire({
        title: "خطأ",
        text: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        icon: "error",
        confirmButtonText: "إعادة المحاولة",
        didOpen: () => {
          const el = document.querySelector(".swal2-container") as HTMLElement;
          if (el) el.style.zIndex = "20000";
        },
      });
    }
  };

  return (
<div className="w-full min-h-screen bg-white flex flex-col items-center justify-start overflow-y-auto px-4 md:px-0 py-10">

      <div className="w-[200px] h-[200px] md:w-[235px] md:h-[235px] bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-16/AJTRe2kLhY.png')] bg-cover bg-no-repeat mt-4" />

      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full max-w-[715px] min-h-[380px] bg-[#f5f5f5] rounded-[12px] mt-10 px-[18px] py-[20px] gap-[20px]"
      >
        <span className="text-[20px] md:text-[22px] font-bold text-[#3b3b3b] text-right">
          يرجى تسجيل الدخول للاستمرار
        </span>

        <div className="flex flex-col gap-[10px]">
          <label className="text-[16px] font-medium text-[#3b3b3b] text-right">
            البريد الإلكتروني
          </label>

          <input
            type="email"
            className="h-[55px] w-full rounded-[10px] border border-[#f1f1f1] bg-white px-4 text-right text-[16px] font-medium text-[#3b3b3b]"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {errors.email && (
            <p className="text-red-600 text-sm text-right">{errors.email}</p>
          )}
        </div>

        <div className="flex flex-col gap-[10px]">
          <label className="text-[16px] font-medium text-[#3b3b3b] text-right">
            كلمة المرور
          </label>

          <input
            type="password"
            className="h-[55px] w-full rounded-[10px] border border-[#f1f1f1] bg-white px-4 text-right text-[16px] font-medium text-[#3b3b3b]"
            placeholder="****"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {errors.password && (
            <p className="text-red-600 text-sm text-right">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-[160px] h-[59px] bg-[#f9b236] text-white rounded-[12px] mx-auto mt-2 shadow-[4px_4px_30px_0_rgba(0,0,0,0.05)] text-[20px] font-medium cursor-pointer"
        >
          تسجيل الدخول
        </button>
      </form>

      {/* حسابات جاهزة للتجربة */}
      <div className="w-full max-w-[715px] mt-6 flex flex-col gap-4 text-right">
        <span className="text-[16px] font-bold mx-auto text-[#3b3b3b]">
          تسجيل دخول سريع للتجربة
        </span>

        <div className="flex flex-col md:flex-row gap-3 justify-center">

          <button
            onClick={() => {
              setEmail("admin@example.com");
              setPassword("00000");
            }}
            className="px-4 py-3 bg-[#f9b236] text-white rounded-lg hover:bg-[#e6a131] transition text-[16px]"
          >
            دخول كـ (Admin)
          </button>

          <button
            onClick={() => {
              setEmail("director@example.com");
              setPassword("41h8fi03");
            }}
            className="px-4 py-3 bg-[#17B3DC] text-white rounded-lg transition text-[16px]"
          >
            دخول كـ مدير
          </button>

          <button
            onClick={() => {
              setEmail("teacher@example.com");
              setPassword("31dcqbq3");
            }}
            className="px-4 py-3 bg-[#E84191] text-white rounded-lg transition text-[16px]"
          >
            دخول كـ معلم
          </button>

        </div>
      </div>
    </div>
  );
};

export default Login;
