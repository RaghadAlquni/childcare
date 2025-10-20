import React from "react";
import "./style.css";
import { motion } from "framer-motion";
import childlist from "../Images/image.png";
import child from "../Images/child.png";

const Home = () => {
  return (
    <div className="HomeBody">
      {/* الخلفية والصورة */}

      <div className="homeLeft">
<svg  className="leftBg" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 579 838" fill="none">
  <path d="M564.974 641.012C670.596 843.345 112.352 517.621 -68.0832 814.481C-143.999 939.381 -109.714 532.07 -109.714 328.113C-89.0589 -7.04202 178.212 293.383 320.448 35.9707C417.526 -139.716 425.305 373.455 564.974 641.012Z" fill="#F9B236"/>
</svg>
        <motion.img
          src={child}
          alt="child"
          className="childImg"
          initial={{ opacity: 0, x: -200, scaleX: -1 }}
          animate={{ opacity: 1, x: 0, scaleX: -1 }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* النصوص والبوتونز */}
      <div className="HomeRight">
        <div className="HeaderRight">
          <div className="topHeader">مرحبا بك في مركز واحة المعرفة</div>
          <div className="bottomHeader">ضيافة آمنة.. طفولة سعيدة</div>
        </div>
        <div className="HomeCenter">
          <p className="topCenter">
            في واحة المعرفة نصنع لأطفالكم بيئة آمنة وممتعة تجمع بين اللعب
            والتعلم، ليقضوا أوقاتًا مليئة بالمرح والاكتشاف وأنتم مطمئنون
          </p>
          <div className="HomeButtons">
            <button className="mainButton">تسجيل طفل</button>
            <button className="moreButton">قراءة المزيد</button>
          </div>
          <div className="bottomRight">
            <ul className="bottomImgItems">
              <li className="BottomImg">
                <img src={childlist} alt="child" />
              </li>
              <li className="BottomImg">
                <img src={childlist} alt="child" />
              </li>
              <li className="BottomImg">
                <img src={childlist} alt="child" />
              </li>
              <li className="BottomImg">
                <img src={childlist} alt="child" />
              </li>
            </ul>
            <p className="bottomText">
              بفخر.. خرجنا أكثر من ٤٠ ألف طفل وطفلة خلال ٥ سنوات من العطاء.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;