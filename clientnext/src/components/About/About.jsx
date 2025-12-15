"use client";
import React from "react";
import Image from "next/image"; 
import aboutStyles from "./About.module.css";

const About = () => {
  return (
    <section id="About" className="relative w-full overflow-hidden py-10 bg-white">

      {/* 🟡 الخلفية */}
      <div
        className="absolute inset-0 bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-10/2aBYAv5EY3.png')] bg-cover bg-center bg-no-repeat opacity-100"
      ></div>


      {/* ✨ النجوم */}
      <Image
        src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-10/mcJF0eUwsg.png"
        alt="star"
        width={170}
        height={170}
        className={`absolute w-[120px] h-[120px] md:w-[170px] md:h-[170px] top-[80px] left-[10px] md:left-[30px] ${aboutStyles.float}`}
      />

      <Image
        src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-10/hrNpjPBeDg.png"
        alt="star"
        width={180}
        height={180}
        className={`absolute w-[130px] h-[130px] md:w-[180px] md:h-[180px] top-[60px] right-[10px] md:right-[30px] ${aboutStyles["float-delay"]}`}
      />

      <Image
        src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-10/Cs685enURd.png"
        alt="star"
        width={160}
        height={160}
        className={`absolute w-[110px] h-[130px] md:w-[140px] md:h-[160px] bottom-[20px] right-[-10px] md:right-[-40px] ${aboutStyles.float}`}
      />

      <Image
        src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-10/mLpxNRb2Rk.png"
        alt="star"
        width={160}
        height={160}
        className={`absolute w-[120px] h-[120px] md:w-[160px] md:h-[160px] bottom-[60px] left-[-20px] md:left-[-50px] ${aboutStyles["float-delay"]}`}
      />


      {/* 🩵 المحتوى */}
      <div className="relative mt-10 z-[10] w-full max-w-[1280px] mx-auto px-4 md:px-10 text-center">

        <div className="w-full flex justify-center">
          <h1
            className="
              text-3xl md:text-5xl 
              font-bold 
              text-[#282828] 
              mb-6 
              leading-tight 
              text-center
              w-full
              break-words
              px-10
              max-w-[800px]
            "
          >
            مركز <span className="text-[#F9B236] mx-2">واحة المعرفة</span> لضيافة الأطفال
          </h1>
        </div>

        <p className="text-base md:text-xl text-[#4d4c4c] leading-relaxed text-center mx-auto w-full flex justify-center">
          يقدم بيئة تعليمية وترفيهية آمنة وشاملة، نحتضن فيها الصغار لنمنحهم الرعاية والاهتمام،
          ونساعدهم على النمو والاكتشاف بثقة وسعادة.
        </p>


        {/*  الكروت*/}
        <div className="relative flex flex-col lg:flex-row justify-center items-stretch gap-10 mb-20 mt-20">

          {/* كرت 1 */}
          <div
            className="
              relative flex flex-col items-center justify-start
              bg-[rgba(249,178,54,0.60)] border border-[#F9B236] 
              rounded-[40px] px-6 pt-[60px] pb-6
              w-full lg:max-w-[420px]
              mx-auto shadow-sm hover:-translate-y-1 transition-all duration-500
            "
          >
            <div className="absolute -top-[60px] flex justify-center items-center bg-[#F9B236] rounded-full w-[106px] h-[106px] shadow-md">
              <Image
                src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-10/S4haUP9fO7.png"
                alt="vision icon"
                width={70}
                height={70}
                className="w-[70px] h-[70px]"
              />
            </div>

            <h3 className="text-[24px] font-bold mt-4 mb-4 text-[#3b3b3b] text-center">
              رؤيتنا
            </h3>

            <p
              className="text-[16px] text-[#4d4c4c] leading-relaxed text-center px-2"
              style={{ direction: "ltr", unicodeBidi: "plaintext" }}
            >
              أن نكون الخيار الأول للأسر في تقديم بيئة ضيافة متميزة تجمع بين التعليم والترفيه والرعاية المتكاملة.
            </p>
          </div>


          {/* كرت 2 */}
          <div
            className="
              relative flex flex-col items-center justify-start
              bg-[rgba(23,179,220,0.60)] border border-[#17B3DC] 
              rounded-[40px] px-6 pt-[60px] pb-[60px]
              w-full lg:max-w-[420px]
              mx-auto shadow-sm hover:-translate-y-1 transition-all duration-500
            "
          >
            <div className="absolute -top-[60px] flex justify-center items-center bg-[#17B3DC] rounded-full w-[106px] h-[106px] shadow-md">
              <Image
                src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-10/YVHo5JzdPa.png"
                alt="mission icon"
                width={70}
                height={70}
                className="w-[70px] h-[70px]"
              />
            </div>

            <h3 className="text-[24px] font-bold mt-4 mb-4 text-[#3b3b3b] text-center">
              رسالتنا
            </h3>

            <p
              className="text-[16px] text-[#4d4c4c] leading-relaxed text-center px-2"
              style={{ direction: "ltr", unicodeBidi: "plaintext" }}
            >
              نوفّر تجربة تعليمية ممتعة تُنمّي حب التعلم والاستكشاف عند الأطفال.
            </p>
          </div>


          {/* كرت 3 */}
          <div
            className="
              relative flex flex-col items-center justify-start
              bg-[rgba(249,178,54,0.60)] border border-[#F9B236] 
              rounded-[40px] px-6 pt-[60px] pb-6
              w-full lg:max-w-[420px]
              mx-auto shadow-sm hover:-translate-y-1 transition-all duration-500
            "
          >
            <div className="absolute -top-[60px] flex justify-center items-center bg-[#F9B236] rounded-full w-[106px] h-[106px] shadow-md">
              <Image
                src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-10/MSyyruSaCV.png"
                alt="goal icon"
                width={70}
                height={70}
                className="w-[70px] h-[70px]"
              />
            </div>

            <h3 className="text-[24px] font-bold mt-4 mb-4 text-[#3b3b3b] text-center">
              أهدافنا
            </h3>

            <p
              className="text-[16px] text-[#4d4c4c] leading-relaxed text-center px-2"
              style={{ direction: "ltr", unicodeBidi: "plaintext" }}
            >
              تنمية مهارات الأطفال الاجتماعية والعاطفية والعقلية من خلال أنشطة تفاعلية.
            </p>
          </div>


          {/* كرت 4 */}
          <div
            className="
              relative flex flex-col items-center justify-start
              bg-[rgba(23,179,220,0.60)] border border-[#17B3DC] 
              rounded-[40px] px-6 pt-[60px] pb-[60px]
              w-full lg:max-w-[420px]
              mx-auto shadow-sm hover:-translate-y-1 transition-all duration-500
            "
          >
            <div className="absolute -top-[60px] flex justify-center items-center bg-[#17B3DC] rounded-full w-[106px] h-[106px] shadow-md">
              <Image
                src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-10/zmpiNKUTvM.png"
                alt="facility icon"
                width={70}
                height={70}
                className="w-[70px] h-[70px]"
              />
            </div>

            <h3 className="text-[24px] font-bold mt-4 mb-4 text-[#3b3b3b] text-center">
              مرافقنا
            </h3>

            <p
              className="text-[16px] text-[#4d4c4c] leading-relaxed text-center px-2"
              style={{ direction: "ltr", unicodeBidi: "plaintext" }}
            >
              نوفّر مرافق مريحة وآمنة تتيح للأطفال اللعب، التعلم، والاستكشاف ضمن بيئة محفزة.
            </p>
          </div>


        </div>
      </div>
    </section>
  );
};

export default About;
