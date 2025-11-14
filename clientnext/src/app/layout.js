import "./globals.css";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

export const metadata = {
  title: "واحة المعرفة",
  description: "مركز واحة المعرفة لضيافة الأطفال",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="font-sans bg-white text-[#282828]">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}