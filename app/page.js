'use client'
import CallAction from "@/components/page-home/call-to-action/CallAction";
import Footer from "@/components/page-home/footer/Footer";
import Hero from "@/components/page-home/hero/Hero";
import How from "@/components/page-home/how-it-works/How";
import Pricing from "@/components/page-home/pricing/Pricing";

export default function Home() {
  return (
    <main>
      <Hero/>
      <How/>
      <Pricing/>
      <CallAction/>
      <Footer/>
    </main>
  );
}
