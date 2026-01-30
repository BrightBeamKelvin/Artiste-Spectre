import { HeroSection } from '@/components/HeroSection';
import { ManifestoSection } from '@/components/ManifestoSection';
import { BeliefsSection } from '@/components/BeliefsSection';
import { PillarsSection } from '@/components/PillarsSection';
import { FooterSection } from '@/components/FooterSection';
import { ChromaticSection } from '@/components/ChromaticSection';

const Index = () => {
  return (
    <>
      <ChromaticSection intensity={1}>
        <HeroSection />
      </ChromaticSection>
      
      <ChromaticSection intensity={1.5}>
        <ManifestoSection />
      </ChromaticSection>
      
      <ChromaticSection intensity={1.2}>
        <BeliefsSection />
      </ChromaticSection>
      
      <ChromaticSection intensity={2}>
        <PillarsSection />
      </ChromaticSection>
      
      <FooterSection />
    </>
  );
};

export default Index;
