import CallAction from "@/components/home-page/call-to-action/CallAction";
import Footer from "@/components/home-page/footer/Footer";
import Hero from "@/components/home-page/hero/Hero";
import How from "@/components/home-page/how-it-works/How";

export default async function Home() {

  return (
    <main>
      <Hero/>
      <How/>
      <CallAction/>
      <Footer/>
    </main>
  );
}
