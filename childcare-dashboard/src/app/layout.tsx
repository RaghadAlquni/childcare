import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import { AppProviders } from "./providers";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "مركز واحة المعرفة لضيافة الأطفال",
  description: "مركز واحة المعرفة لضيافة الأطفال",
  icons: {
    icon: "/wmLogo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={tajawal.className}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
