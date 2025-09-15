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
      <IdeaBox />
      <VisionSection />
      <CommunitySection/>
      <CommunityTestimonials />
      <PricingSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
