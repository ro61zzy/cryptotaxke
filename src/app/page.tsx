import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Cta } from "@/components/landing/Cta";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Cta />
    </>
  );
}
