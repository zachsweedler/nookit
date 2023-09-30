import BecomeHost from "@/components/home-page/become-host/BecomeHost";
import Footer from "@/components/home-page/footer/Footer";
import Hero from "@/components/home-page/hero/Hero";
import WhatsNookit from "@/components/home-page/whats-nookit/WhatsNookit";


export default async function Home() {

  return (
    <main>
      <Hero/>
      <WhatsNookit/>
      <BecomeHost/>
      <Footer/>
    </main>
  );
}
