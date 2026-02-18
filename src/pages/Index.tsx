import { HeroSection } from '@/components/HeroSection';
import { ManifestoSection } from '@/components/ManifestoSection';
import { BeliefsSection } from '@/components/BeliefsSection';
import { FooterSection } from '@/components/FooterSection';

const Index = () => {
  return (
    <div className="bg-background text-foreground">
      <HeroSection />
      <ManifestoSection />
      <BeliefsSection />
      <FooterSection />
    </div>
  );
};

export default Index;
