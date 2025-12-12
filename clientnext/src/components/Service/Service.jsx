"use client";
import React from "react";
import Link from "next/link";
import ServiceStyles from "./Service.module.css"

const servicesCards = [
  {
    color: "#e84191",
    title: "الابتدائي",
    age: "من عمر ٦ سنوات حتى ١٢ سنة",
    img: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-13/GZMRD8xt83.png",
    heart: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-13/RfoTNQR0hs.png",
    desc: "في مرحلة الابتدائي نركز على تنمية المهارات الأكاديمية والاجتماعية للطفل بأسلوب ممتع وتفاعلي، مع متابعة دراسته وتعزيز سلوكه وإبداعه من خلال أنشطة تعليمية وحركية وفنية.",
  },
  {
    color: "#f9b236",
    title: "الروضة - التمهيدي",
    age: "من عمر السنتين حتى ٥ سنوات",
    img: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-13/TqtZaxAi94.png",
    heart: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-13/NZPzrStOU9.png",
    desc: "نوفر للأطفال بيئة تعليمية آمنة وممتعة تنمّي مهاراتهم الاجتماعية والعاطفية عبر أنشطة تفاعلية تجمع بين التعلم والمرح، وتغرس فيهم السلوك الإيجابي والإبداع.",
  },
  {
    color: "#17b3dc",
    title: "الحضانة",
    age: "من عمر الولادة حتى سنتين",
    img: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-13/wd3Jr0u2Go.png",
    heart: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-13/CZB7rPrrD8.png",
    desc: "نعتني بأطفالكم في بيئة آمنة ونظيفة مع تعقيم مستمر، نوفر لهم رعاية شاملة تشمل النوم، التغذية، واللعب الحسي، مع فريق متخصص يحرص على راحتهم وسعادتهم ونموهم الصحي.",
  },
];
const Service = () => {
    return (
      <section id="Servive" className="py-20 bg-white">
      <div className="mx-auto px-6 md:px-10 text-center">
        
<h1 className="text-4xl md:text-5xl font-bold text-[#282828] mb-6 leading-tight text-center mx-auto w-full flex justify-center">
          خدمات <span className="text-[#F9B236] mx-2">واحة المعرفة</span>
        </h1>


<div className="mt-10 flex flex-col lg:flex-row justify-center items-stretch gap-8">

  {servicesCards.map((card, index) => (
    <div
  key={index}
  style={{ borderColor: card.color }}
  className="
    group relative flex flex-col 
    items-center
    border border-dashed rounded-[20px] 
    p-[10px] pb-4 gap-[14px] 
    w-full lg:max-w-[420px]
    transition-all duration-500 ease-out
    hover:-translate-y-1 hover:shadow-md
  "
>

      {/* طبقة الأوبسيتي */}
      <div
        className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-10 transition-all duration-500 pointer-events-none"
        style={{ backgroundColor: card.color }}
      />

      {/* الصورة + القلب + الرابط */}
      <div className="relative w-full">

        <Link
          href={card.img}
          target="_blank"
          className="
            absolute top-3 left-3 z-20 opacity-0 group-hover:opacity-100 
            transition-all duration-500 bg-white/60 backdrop-blur-sm
            p-2 rounded-full
          "
        >
          🔗
        </Link>

        <Image
          src={card.heart}   alt="heart" width={95} height={95}
          className="absolute left-3 bottom-[-70px] z-10 w-[95px] opacity-0 translate-y-3 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0"/>

        <div
          className="h-[300px] w-full rounded-[20px] bg-cover bg-no-repeat transition-all duration-500 group-hover:scale-[1.01]"
          style={{ backgroundImage: `url(${card.img})` }}
        />
      </div>

      <span className="text-[26px] font-bold text-[#282828] text-center w-full px-1">
        {card.title}
      </span>

      <span className="text-[12px] text-[#282828] text-center w-full px-1">
        {card.age}
      </span>

      <p
        className="text-[14px] leading-[1.5] text-[#282828] text-center w-full px-2"
        style={{ direction: "ltr", unicodeBidi: "plaintext" }}
      >
        {card.desc}
      </p>

    </div>
  ))}

</div>
      </div>
    </section>
    );
}

export default Service;