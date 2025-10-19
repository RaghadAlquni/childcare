import React from "react";
import "./style.css";
// import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import childlist from "../Images/image.png"
import child from "../Images/child.png"

const Home = () => {
    // const location = useLocation();
    // const { pathname } = location;
    // const splitLocation = pathname.split("/");


  return <div className="HomeBody">
  



<div className="HomeRight">
  <div className="HeaderRight">
  <div className="topHeader">  مرحبا بك في مركز واحة المعرفة  </div>
  <div className="bottomHeader"> ضيافة آمنة.. طفولة سعيدة </div>
  <svg className="HeaderLine" xmlns="http://www.w3.org/2000/svg" width="263" height="21" viewBox="0 0 263 21" fill="none">
<path d="M3.5 12.2896C2.70435 12.2839 1.94129 12.595 1.37868 13.1577C0.816071 13.7202 0.5 14.4883 0.5 15.2896C0.5 16.0909 0.816071 16.859 1.37868 17.4215C1.94129 17.9842 2.70435 18.2953 3.5 18.2896C8.44395 18.0971 12.6876 17.3623 17.1725 16.6412C25.1636 15.2847 33.0633 13.5668 40.8817 11.3862C42.8546 10.8322 44.4931 10.6219 45.9244 11.0891C48.9442 11.9539 51.3788 15.5462 54.1195 19.1835C54.4123 19.5725 54.7931 19.8758 55.1367 20.0682C55.4445 20.2421 55.7434 20.3521 56.0225 20.4272C56.4928 20.5539 56.9465 20.5825 57.2445 20.5865C57.5803 20.5913 57.8874 20.57 58.151 20.5427C58.4313 20.5136 58.689 20.4749 58.9269 20.4335C59.9034 20.2602 60.762 20.0195 61.5857 19.7706C63.2454 19.2617 64.8086 18.6776 66.348 18.0781C69.4181 16.8746 72.4031 15.5838 75.3831 14.2835C81.3303 11.683 87.2101 9.0212 93.1378 6.57779C101.648 2.71217 110.974 8.51868 121.704 9.74293L121.897 9.75387C134.105 10.2177 147.192 12.1864 159.9 11.978L159.918 11.9781C189.338 11.8475 218.776 11.4878 248.198 11.0325C252.635 10.9626 257.073 10.8896 261.511 10.8133C261.808 10.8081 262.091 10.6849 262.298 10.4718C262.505 10.2587 262.62 9.9732 262.617 9.67696C262.614 9.38072 262.493 9.09764 262.282 8.88877C262.07 8.67997 261.785 8.56248 261.489 8.56338C257.051 8.57724 252.613 8.58775 248.177 8.59506C218.761 8.63585 189.321 8.58098 159.93 8.29715L159.948 8.2973C147.201 8.31446 135.102 6.23942 121.943 5.53633L122.136 5.54727C113.023 4.67228 102.681 -2.3003 91.4001 2.26929C85.3331 4.67107 79.3898 7.26233 73.4445 9.76248C70.4705 11.011 67.5012 12.2442 64.5404 13.3565C63.062 13.9091 61.5691 14.4394 60.1245 14.8593C59.4164 15.0639 58.6902 15.248 58.0712 15.3467C57.7847 15.3934 57.4825 15.4194 57.3425 15.4121C57.2827 15.4114 57.2594 15.3956 57.3777 15.4236C57.4446 15.4412 57.556 15.4768 57.7019 15.5585C57.8633 15.6479 58.0846 15.8171 58.2603 16.0505C55.686 12.7574 53.2565 7.97618 47.5615 5.96382C44.7152 4.9951 41.733 5.48853 39.442 6.1044C31.8216 8.11514 24.0529 9.69115 16.2466 10.9029C11.9709 11.543 7.39783 12.2 3.5 12.2896Z" fill="#F9B236"/>
</svg>
  </div>
<div className="HomeCenter">
  <p className="topCenter">  في واحة المعرفة نصنع لأطفالكم بيئة آمنة وممتعة تجمع بين اللعب والتعلم،  ليقضوا اوقاتًا مليئة بالمرح والاكتشاف وأنتم مطمئنون  </p>
  <div className="HomeButtons"> 
  <button className="mainButton"> تسجيل طفل </button>
  <button className="moreButton"> قراءة المزيد </button>
  </div>
  <div className="bottomRight">
  <ul className="bottomImgItems">
    <li className="BottomImg"> <img src={childlist} alt="logo" className="logo"/> </li>
    <li className="BottomImg"> <img src={childlist} alt="logo" className="logo"/> </li>
    <li className="BottomImg"> <img src={childlist} alt="logo" className="logo"/> </li>
    <li className="BottomImg"> <img src={childlist} alt="logo" className="logo"/> </li>
  </ul>

  <p className="bottomText"> بفخر.. خرجنا أكثر من ٤٠ ألف طفل وطفلة خلال ٥ سنوات من العطاء. </p>
  </div>
  </div>
</div>

<div className="homeLeft">
<div className="leftImg">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 652 977" fill="none">
<path d="M634.407 750.931C758.158 995.76 192.828 712.191 68.4516 917.555C-49.7997 1112.8 -85 785.294 -85 538.501C-60.7998 132.954 161.402 356.306 328.054 44.8304C441.796 -167.756 470.763 427.18 634.407 750.931Z" fill="#F9B236"/>
</svg>
</div>
<motion.img
src={child}
alt="bg"
className="childImg"
initial={{opacity: 0, x: -200, scaleX: -1}}
animate={{ opacity: 1, x:0, scaleX: -1}}
transition={{ duration: 0.5}}
/>
</div>
  </div>
};

export default Home;