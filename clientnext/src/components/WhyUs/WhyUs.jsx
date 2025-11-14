"use client";
import React from "react";

const whyCards = [
  {
    title: "قيمنا",
    desc: "أن نكون الخيار الأول للأسر في تقديم بيئة ضيافة متميزة تجمع بين التعليم والترفيه والرعاية المتكاملة، ونسهم في إعداد جيل مبدع، واثق، ومحب للتعلم.",
    img: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-13/tG72jxikBF.png",
    border: "#e84191",
  },
  {
    title: "رسالتنا",
    desc: "أن نكون بيئة محفزة تتكامل فيها الضيافة مع التعليم، ونقدّم أفضل رعاية تحفّز الطفل على الاستكشاف، الإبداع، وبناء الشخصية.",
    img: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-13/tG72jxikBF.png",
    border: "#f9b236",
  },
  {
    title: "رؤيتنا",
    desc: "أن نصنع جيلًا محبًا للتعلم واثقًا بقدراته عبر توفير مكان آمن، دافئ، ومتكامل يدعم نماء الطفل وسعادته.",
    img: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-13/tG72jxikBF.png",
    border: "#f9b236",
  },
  {
    title: "أهدافنا",
    desc: "تنمية مهارات الطفل الاجتماعية والعقلية والحركية عبر برامج تعليمية وترفيهية تفاعلية.",
    img: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-13/tG72jxikBF.png",
    border: "#17b3dc",
  },
];

const WhyUs = () => {
  return (
    <section className="relative w-full py-20">

      {/* العنوان — الآن محاذي تمامًا لبداية الكروت */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <h4 className="text-3xl md:text-3xl font-bold text-[#282828] mb-12 text-right w-full">
          لماذا <span className="text-[#F9B236]">واحة المعرفة</span> أفضل خيار لطفلك؟
        </h4>
      </div>

      <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-5 px-6 md:px-10 h-full items-stretch">

        {/* الكروت */}
        <div className="flex flex-col w-full lg:w-[65%] h-full justify-between">

          {/* الصف الأول */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
            {whyCards.slice(0, 2).map((card, i) => (
             <div
  key={i}
  className="
    group
    relative
    flex flex-col items-center rounded-[20px] 
    border-1 border-dashed p-10 
    bg-white shadow-sm h-full
    transition-all duration-300
    overflow-hidden
  "
  style={{ borderColor: card.border }}
>
  {/* اوفــــرلاي الهوفر */}
  <div
    className="
      absolute inset-0 opacity-0 
      group-hover:opacity-5
      transition-all duration-300
      pointer-events-none
    "
    style={{ backgroundColor: card.border }}
  />

  <div
    className="w-[90px] h-[90px] bg-contain bg-no-repeat mb-6"
    style={{ backgroundImage: `url(${card.img})` }}
  />

  <h3 className="text-[28px] font-bold text-[#282828] mb-3">
    {card.title}
  </h3>

  <p className="text-[18px] text-[#3b3b3b] leading-relaxed text-center">
    {card.desc}
  </p>
</div>
            ))}
          </div>

          {/* الصف الثاني */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow mt-6">
            {whyCards.slice(2, 4).map((card, i) => (
              <div
  key={i}
  className="
    group
    relative
    flex flex-col items-center rounded-[20px] 
    border-1 border-dashed p-10 
    bg-white shadow-sm h-full
    transition-all duration-300
    overflow-hidden
  "
  style={{ borderColor: card.border }}
>
  {/* اوفــــرلاي الهوفر */}
  <div
    className="
      absolute inset-0 opacity-0 
      group-hover:opacity-5
      transition-all duration-300
      pointer-events-none
    "
    style={{ backgroundColor: card.border }}
  />

  <div
    className="w-[90px] h-[90px] bg-contain bg-no-repeat mb-6"
    style={{ backgroundImage: `url(${card.img})` }}
  />

  <h3 className="text-[28px] font-bold text-[#282828] mb-3">
    {card.title}
  </h3>

  <p className="text-[18px] text-[#3b3b3b] leading-relaxed text-center">
    {card.desc}
  </p>
</div>
            ))}
          </div>

        </div>

        {/* الصورة */}
        <div className="w-full lg:w-[35%] h-auto">
          <div
            className="w-full h-full min-h-full bg-cover bg-center rounded-[20px] border-2 border-[#e6e6e6]"
            style={{
              backgroundImage:
                "url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-13/edccyHE1ts.png')",
            }}
          />
        </div>

      </div>
    </section>
  );
};

export default WhyUs;