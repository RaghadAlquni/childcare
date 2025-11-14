import Home from "@/components/Home/Home";
import About from "@/components/About/About";
import Service from "@/components/Service/Service";
import Branch from "@/components/Branches/Branch";
import WhyUs from "@/components/WhyUs/WhyUs";

import Image from "next/image";

export default function Page() {
  return (
    <main>
    <Home />
    <About />
    <Service />
    <Branch />
    <WhyUs />
    </main>
  );
}
