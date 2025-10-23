import React from "react";
import "./style.css";
import { AiOutlineEye, AiOutlineMail, AiOutlineStar, AiOutlineCheckCircle, AiOutlineBook } from 'react-icons/ai';
import { Grid, GridItem, Box, Heading, Text, Icon } from "@chakra-ui/react";
import Bg from "../../Components/Images/whoPg.png";
// import WhyVedio from "../Images/Why.mp4";

const cards = [
  {
    title: "رؤيتنا",
    text: "نسعى لتقديم بيئة تعليمية آمنة وملهمة تُسهم في بناء شخصية الطفل وتنمية مهاراته.",
    color: "#F9B236",
    icon: <AiOutlineEye />,
    rowSpan: 2,
    colSpan: 1,
  },
  {
    title: "رسالتنا",
    text: "نوفّر تجربة تعليمية ممتعة تُنمّي حب التعلم والاستكشاف عند الأطفال.",
    color: "#E84191",
    icon: <AiOutlineMail />,
    rowSpan: 2, 
    colSpan: 1,
  },
  {
    title: "قيمنا",
    text: "• الأمان والاهتمام\n• التعلم باللعب\n• الشفافية والثقة\n• الإبداع والتميز",
    color: "#17B3DC",
    icon: <AiOutlineStar />,
    rowSpan: 3,
    colSpan: 1,
    maxWidth: 300,
  },
  {
    title: "أهدافنا",
    text: "تطوير مهارات الأطفال الاجتماعية والعاطفية والفكرية، وتمكينهم من التعلم بثقة واستقلالية.",
    color: "#17B3DC",
    icon: <AiOutlineCheckCircle />,
    rowStart: 3,
    colSpan: 2,
    pt: 6, // padding داخلي من الأعلى
  },
  {
    title: "قصتنا",
    text: "يتكوّن من نخبة من المعلمات المتخصصات في التربية والتعليم المبكر، ملتزمات بتقديم أفضل رعاية وتعليم للأطفال.",
    color: "#F9B236",
    icon: <AiOutlineBook />,
    rowStart: 4,
    colSpan: 3,
    pt: 6, // padding داخلي من الأعلى
    maxWidth: 1080,
  },
];

const WhoUs = () => {
  return (
    <div>
    <div className="whoUsContainer">
      {/* الخلفية */}
      <img className="whoUsBg" src={Bg} alt="background" />

      {/* المحتوى فوق الصورة */}
      <div className="whoUsContent">
        <h1 className="whoUsTitle">
          مركز <span className="highlight">واحة المعرفة</span> لضيافة الأطفال
        </h1>

        <p className="whoUsDescription">
          نقدم بيئة تعليمية آمنة ومشجعة، تُحتضن فيها العقول الصغيرة بالرعاية والاهتمام.
        </p>

<Grid
  templateColumns={{ base: "1fr", md: "repeat(6, 1fr)" }}
  gap={{ base: 4, md: 2 }}
  p={{ base: "20px", md: "60px 80px" }}
  justifyContent="center"
>
  {/* الثلاثة كروت فوق */}
  {cards.slice(0, 3).map((card, index) => (
    <GridItem key={index} colSpan={{ base: 1, md: 2 }}>
      <Box
        bg={card.color + "19"}
        border={`1px dashed ${card.color}`}
        borderRadius={50}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        p={5}
        m={2}
        gap={2}
        h="200px"
        maxW="100%"
      >
        <Icon as={card.icon.type} boxSize={8} color={card.color} mb={2} />
        <Heading fontFamily= "Cairo, sans-serif" size="md" color="#292929" mb={1}>
          {card.title}
        </Heading>
        <Text color="#292929" fontSize="sm" whiteSpace="pre-line">
          {card.text}
        </Text>
      </Box>
    </GridItem>
  ))}

  {/* الكرتين تحت */}
  {cards.slice(3).map((card, index) => (
    <GridItem key={index} colSpan={{ base: 1, md: 3 }}>
      <Box
        bg={card.color + "19"}
        border={`1px dashed ${card.color}`}
        borderRadius={50}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        p={5}
        m={2}
        h="200px"
        gap={2}
        maxW="100%"
      >
        <Icon as={card.icon.type} boxSize={8} color={card.color} mb={2} />
        <Heading fontFamily= "Cairo, sans-serif" size="md" color="#292929" mb={1}>
          {card.title}
        </Heading>
        <Text color="#292929" fontSize="sm" whiteSpace="pre-line">
          {card.text}
        </Text>
      </Box>
    </GridItem>
  ))}
</Grid>

      </div>
    </div>

     {/* القسم الثاني */}
   {/*   <div className="secondCenter">
        <h1 className="whoUsTitle">
          لماذا <span className="highlight">واحة المعرفة؟</span>
        </h1>

        <Grid
  templateColumns={{ base: "1fr", md: "1fr 1fr" }} // عمودين على شاشات كبيرة، عمود واحد على الموبايل
  gap={{ base: 4, md: 6 }}
  p={{ base: "20px", md: "60px 80px" }}
  justifyContent="center"
  alignItems="center"
>
   // العمود الأول - النص 
  <GridItem colSpan={1}>
    <Box
      borderRadius={50}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      p={5}
      m={0}
      gap={2}
      h="100%"
    >
      <Text fontWeight="bold" fontSize={{ base: "2xl", md: "3xl" }} lineHeight="1.8" >

      <span className="highlight">واحة المعرفة</span> مو بس مكان لتعلم الحروف والأرقام.
        <br />
        هو مكان يكتشف فيه طفلك نفسه، ويقوى، ويستعد للحياة.
      </Text>
    </Box>
  </GridItem>

   // العمود الثاني - الفيديو 
  <GridItem colSpan={1}>
    <Box
      borderRadius={20}
      overflow="hidden"
      display="flex"
      justifyContent="center"
      alignItems="center"
      m={2}
      p={0}
    >
      <video
        src={WhyVedio} // حطي مسار الفيديو هنا
        controls
        style={{
          width: "55%",
          maxheight: "200px",
          borderRadius: "12px",
          opjectFit: "cover",
          boxShadow: "0 4px 5px rgba(0,0,0,0.2)",
        }}
      />
    </Box>
  </GridItem>
</Grid>
      </div> */}
      </div>
  );
};

export default WhoUs;