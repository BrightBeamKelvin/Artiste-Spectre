import { CursorTrail } from '@/components/CursorTrail';
import { HeroSection } from '@/components/HeroSection';
import { ManifestoSection } from '@/components/ManifestoSection';
import { BeliefsSection } from '@/components/BeliefsSection';
import { PillarsSection } from '@/components/PillarsSection';
import { FooterSection } from '@/components/FooterSection';
import { ChromaticSection } from '@/components/ChromaticSection';
import { DatamoshDivider } from '@/components/DatamoshDivider';
import { SVGFilters } from '@/components/SVGFilters';

const Index = () => {
  return (
    <main className="bg-background text-foreground min-h-screen overflow-x-hidden">
      <SVGFilters />
      <CursorTrail />
      
      <ChromaticSection intensity={0.8}>
        <HeroSection />
      </ChromaticSection>
      
      <DatamoshDivider />
      
      <ChromaticSection intensity={1.2}>
        <ManifestoSection />
      </ChromaticSection>
      
      <DatamoshDivider />
      
      <ChromaticSection intensity={1}>
        <BeliefsSection />
      </ChromaticSection>
      
      <DatamoshDivider />
      
      <ChromaticSection intensity={1.5}>
        <PillarsSection />
      </ChromaticSection>
      
      <DatamoshDivider />
      
      <FooterSection />
    </main>
  );
};

export default Index;
