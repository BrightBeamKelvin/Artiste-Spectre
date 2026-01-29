import { CursorTrail } from '@/components/CursorTrail';
import { HeroSection } from '@/components/HeroSection';
import { ManifestoSection } from '@/components/ManifestoSection';
import { BeliefsSection } from '@/components/BeliefsSection';
import { PillarsSection } from '@/components/PillarsSection';
import { FooterSection } from '@/components/FooterSection';

const Index = () => {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <CursorTrail />
      
      <HeroSection />
      <ManifestoSection />
      <BeliefsSection />
      <PillarsSection />
      <FooterSection />
    </main>
  );
};

export default Index;
