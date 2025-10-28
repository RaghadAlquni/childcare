import React from "react";
import { Box, Image, Text, Heading } from "@chakra-ui/react";
import "./style.css";
import serviceImg1 from "../Images/Img1.png";
import serviceImg2 from "../Images/Img2.png";
import serviceImg3 from "../Images/Img3.png";
import yellowHeart from "../Images/yellowHeart.svg";
import pinkHeart from "../Images/pinkHeart.svg";
import blueHeart from "../Images/blueHeart.svg";




const services = [
  {
    img: serviceImg1,
    title: "الحضانة",
    text: "من عمر الولادة حتى سنتين",
    Description: "نعتني بأطفالكم في بيئة آمنة ونظيفة مع تعقيم مستمر، نوفر لهم رعاية شاملة تشمل النوم، التغذية، واللعب الحسي، مع فريق متخصص بحرص على راحتهم وسعادتهم ونموهم الصحي.",
    color: "#F9B236",
    svg: yellowHeart,
    rowSpan: 2,
    colSpan: 1,
  },
  {
    img: serviceImg2,
    title: "الروضة - التمهيدي",
    text: "من عمر السنتين حتى ٥ سنوات",
    Description: "نقدم للأطفال بيئة تعليمية آمنة ومليئة بالمرح، حيث نركز على تنمية مهاراتهم الاجتماعيه والعاطفية من خلال أنشطة تفاعلية ممتعة ومبتكرة. برنامجنا يجمع بين التعليم المبسط الذي يهيئ الطفل للمدرسة، وتعديل السلوك بطريقة إيجابية تساعده على تكوين عادات سليمة، بالإضافة إلى الألعاب والأنشطة الحركية والفنيه التي تنمي قدراته الذهنية والإبداعية. ",
    color: "#E84191",
    svg: pinkHeart,
    rowSpan: 2, 
    colSpan: 1,
  },
  {
    img: serviceImg3,
    title: "الابتدائي (مسائي)",
    text: "من عمر ٦ سنوات حتى ١٢ سنة ",
    Description: "مرحلة الطلاب الابتدائيين، في هذه المرحلة نركز على دعم مهارات الطفل الأكاديمية والاجتماعية بطريقة ممتعة وتفاعلية. نتابع الواجبات والأنشطة التعليمية، مع تقديم برامج لتنمية السلوك والقدرات الإبداعية، بالإضافة إلى الأنشطة الحركية والفنية لتعزيز اللياقة والخيال.",
    color: "#17B3DC",
    svg: blueHeart,
    rowSpan: 3,
    colSpan: 1,
    maxWidth: 300,
  },
];

const Services = () => {
    return (
        <div className="Container">
         <h1 className="serviceTitle">
          خدماتنا في <span className="highlight">واحة المعرفة</span>
        </h1>
    <Box
      display="flex"
      justifyContent="center"
      alignItems="stretch"
      flexWrap="wrap"
      gap={5}
      p="40px"
      className="servicesContainer"
    >
      {services.map((service, index) => (
        <Box
  key={index}
  className="serviceCard"
  border={`1px dashed ${service.color}`}
  borderRadius="30px"
  position="relative"
  w="380px"
  bg="white"
  transition="all 0.4s ease"
  overflow="hidden"                // يضمن أي شي خارج الكارد ما يطلع
  _hover={{
    bg: `${service.color}0D`,      // 5% من لون الستروك
    transform: "translateY(-4px)",
  }}
>
  {/* غلاف الصورة + القلب */}
  <Box position="relative" overflow="visible" m="8px 10px 0">
    {/* قصّ الصورة فقط بداخل غلاف clip */}
    <Box overflow="hidden" borderRadius="25px">
      <Image
        src={service.img}
        alt={service.title}
        w="100%"
        h="240px"
        objectFit="cover"
        transition="transform 0.5s ease"
        className="serviceImg"
      />
    </Box>

    {/* SVG القلب: نصفه داخل الصورة ونصفه تحتها، ويظهر كامل */}
    <Image
      src={service.svg}
      alt="decoration"
      position="absolute"
      left="16px"         // جهة اليسار
      bottom="-26px"      // ينزل شوي تحت حافة الصورة
      boxSize="100px"     // أكبر
      zIndex="2"
      pointerEvents="none"
      opacity="0"
      transform="translateY(12px)"
      transition="all 0.35s ease"
      className="hoverSvg"
    />
  </Box>

  {/* النصوص */}
  <Box p="24px 28px 32px" textAlign="right" dir="rtl" flex="1">
  <Heading
    size="md"
    color="#292929"
    fontFamily="Cairo, sans-serif"
    mb="10px"
    letterSpacing="0.3px"
  >
    {service.title}
  </Heading>

  <Text
    color="#555"
    fontWeight="500"
    mb="8px"
    fontSize="10px"
    letterSpacing="0.2px"
  >
    {service.text}
  </Text>

  <Text
    color="#292929"
    fontSize="12px"
    lineHeight="1.8"
    letterSpacing="0.3px"
    textAlign="justify"
  >
    {service.Description}
  </Text>
</Box>
</Box>
      ))}
    </Box>
    </div>
  );

};


export default Services;