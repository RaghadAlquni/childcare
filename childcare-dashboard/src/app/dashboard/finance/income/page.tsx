"use client";

import { useAppSelector } from "@/redux/hooks";
import Income from "@/components/dashboard/finance/income/Income";

export default function DashboardIncomeMoney() {

  const { user, loading } = useAppSelector((state) => state.auth);

  // 1) منع الـ Loop — لا ترندر شيء أثناء الـ hydration
  if (typeof window !== "undefined" && loading) return null;

  // 2) لو ما فيه يوزر نهائيًا
  if (!user) return <p>لم يتم تسجيل الدخول</p>;

  // 3) حسب الدور
  switch (user.role) {
    case "admin":
      return <Income />;
    case "director":
      return <Income />;
    default:
      return <p>لا يوجد صفحة لهذا الدور</p>;
  }
  
}