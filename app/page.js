import BecomeHost from "@/components/home-page/become-host/BecomeHost";
import Faq from "@/components/home-page/faq/Faq";
import Footer from "@/components/home-page/footer/Footer";
import Hero from "@/components/home-page/hero/Hero";
import How from "@/components/home-page/how-it-works/How";
import WhatsNookit from "@/components/home-page/whats-nookit/WhatsNookit";


export default async function Home() {

  return (
    <main>
      <Hero/>
      <WhatsNookit/>
      <How/>
      <BecomeHost/>
      <Faq/>
      <Footer/>
    </main>
  );
}
