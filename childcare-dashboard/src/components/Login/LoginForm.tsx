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
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ⭐ الفاليديشن
  const validate = () => {
    let newErrors: any = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = "يرجى إدخال البريد الإلكتروني";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "يرجى إدخال بريد إلكتروني صحيح";
    }

    if (!password.trim()) {
      newErrors.password = "يرجى إدخال كلمة المرور";
    } else if (password.length < 4) {
      newErrors.password = "كلمة المرور يجب أن تكون 4 أحرف على الأقل";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Swal.fire({
        title: "تنبيه",
        text: "يرجى التأكد من صحة المدخلات",
        icon: "warning",
        confirmButtonText: "حسناً",
      });
    }

    return Object.keys(newErrors).length === 0;
  };

  // ⭐ إرسال النموذج
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsLoading(true);
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
      });

      const role = decoded.role.toLowerCase();

      if (role === "admin") router.push("/dashboard?role=admin");
      else if (role === "director") router.push("/dashboard?role=director");
      else if (role === "teacher") router.push("/dashboard?role=teacher");
      else if (role === "assistant_teacher")
        router.push("/dashboard?role=assistant_teacher");

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      dispatch(loginFailure("خطأ في تسجيل الدخول"));

      Swal.fire({
        title: "خطأ",
        text: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        icon: "error",
        confirmButtonText: "إعادة المحاولة",
      });
    }
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center justify-start overflow-y-auto px-4 md:px-0 py-10">

      {/* الشعار */}
      <div className="w-[200px] h-[200px] md:w-[235px] md:h-[235px] bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-16/AJTRe2kLhY.png')] bg-cover bg-no-repeat mt-4" />

      {/* الفورم */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full max-w-[715px] min-h-[380px] bg-[#f5f5f5] rounded-[12px] mt-10 px-[18px] py-[20px] gap-[20px] shadow-md"
      >
        <span className="text-[20px] md:text-[22px] font-bold text-[#3b3b3b] text-right">
          يرجى تسجيل الدخول للاستمرار
        </span>

        {/* حقل الإيميل */}
        <div className="flex flex-col gap-[10px]">
          <label className="text-[16px] font-medium text-[#3b3b3b] text-right">
            البريد الإلكتروني
          </label>

          <div className="relative">
            <input
              type="email"
              className={`h-[55px] w-full rounded-[10px] border px-12 text-right text-[16px] font-medium bg-white outline-none transition
              ${errors.email ? "border-red-500" : "border-[#e6e6e6] focus:border-[#f9b236]"}`}
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
          </div>

          {errors.email && (
            <p className="text-red-600 text-sm text-right">{errors.email}</p>
          )}
        </div>

        {/* كلمة المرور */}
        <div className="flex flex-col gap-[10px]">
          <label className="text-[16px] font-medium text-[#3b3b3b] text-right">
            كلمة المرور
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className={`h-[55px] w-full rounded-[10px] border px-12 text-right text-[16px] font-medium bg-white outline-none transition
              ${errors.password ? "border-red-500" : "border-[#e6e6e6] focus:border-[#f9b236]"}`}
              placeholder="•••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />  

            {/* أيقونة العين */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
            >
              {showPassword ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.58 10.58A3 3 0 0113.42 13.42M7.11 7.11C4.8 8.55 3 12 3 12s3.5 7 9.5 7c2.06 0 3.87-.63 5.39-1.57m2.11-2.11C21.2 15.45 23 12 23 12s-3.5-7-9.5-7c-.91 0-1.78.12-2.61.34" />
                </svg>
              )}
            </button>
          </div>

          {errors.password && (
            <p className="text-red-600 text-sm text-right">{errors.password}</p>
          )}
        </div>

        {/* زر تسجيل الدخول */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-[160px] h-[59px] bg-[#f9b236] text-white rounded-[12px] mx-auto mt-2 shadow-md text-[20px] font-medium flex items-center justify-center transition
          ${isLoading ? "opacity-60 cursor-not-allowed" : "hover:bg-[#e6a131]"}`}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              جاري الدخول...
            </div>
          ) : (
            "تسجيل الدخول"
          )}
        </button>
      </form>

      {/* التجربة السريعة */}
      <div className="w-full max-w-[715px] mt-6 flex flex-col gap-4 text-right">
        <span className="text-[16px] font-bold mx-auto text-[#3b3b3b]">
          تسجيل دخول سريع للتجربة
        </span>

        <div className="flex flex-col md:flex-row gap-3 justify-center">
          <button
            onClick={() => {
              setEmail(process.env.NEXT_PUBLIC_ADMIN_EMAIL || "");
              setPassword(process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "");
            }}
            className="px-4 py-3 bg-[#f9b236] text-white rounded-lg hover:bg-[#e6a131] transition text-[16px]"
          >
            دخول كـ (Admin)
          </button>

          <button
            onClick={() => {
              setEmail(process.env.NEXT_PUBLIC_DIRECTOR_EMAIL || "");
              setPassword(process.env.NEXT_PUBLIC_DIRECTOR_PASSWORD || "");
            }}
            className="px-4 py-3 bg-[#17B3DC] text-white rounded-lg transition text-[16px]"
          >
            دخول كـ مدير
          </button>

          <button
            onClick={() => {
              setEmail(process.env.NEXT_PUBLIC_TEACHER_EMAIL || "");
              setPassword(process.env.NEXT_PUBLIC_TEACHER_PASSWORD || "");
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
