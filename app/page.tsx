import { Nav } from "@/components/system/Nav";
import { TraceRail } from "@/components/system/TraceRail";
import { Hero } from "@/components/sections/Hero";
import { Stack } from "@/components/sections/Stack";
import { Work } from "@/components/sections/Work";
import { Trajectory } from "@/components/sections/Trajectory";
import { Toolkit } from "@/components/sections/Toolkit";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Nav />
      <TraceRail />
      <main id="main">
        <Hero />
        <Stack />
        <Work />
        <Trajectory />
        <Toolkit />
        <Contact />
      </main>
    </>
  );
}
