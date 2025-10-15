import CommunitySection from '@/components/landing_page/CommunitySection';
import CommunityTestimonials from '@/components/landing_page/CommunityTestimonials';
import FAQSection from '@/components/landing_page/FAQSection';
import HeroSection from '@/components/landing_page/HeroSection';
import IdeaBox from '@/components/landing_page/IdeaBox';
import Navbar from '@/components/landing_page/Navbar';
import PricingSection from '@/components/landing_page/PricingSection';
import  Footer  from '@/components/landing_page/Footer';
import VisionSection from '@/components/landing_page/VisionSection';

const Index = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <div className="py-16">
        <IdeaBox />
      </div>
      <div className="py-16">
        <VisionSection />
      </div>
      {/* <CommunitySection/> */}
      {/* <CommunityTestimonials /> */}
      <div className="py-16">
        <PricingSection />
      </div>
      <div className="py-16">
        <FAQSection />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
