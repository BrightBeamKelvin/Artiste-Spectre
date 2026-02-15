import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TypewriterText } from './TypewriterText';
import { DrawingLine } from './DrawingLine';
import { LogoLoop } from './LogoLoop';
import { useWorkData } from '@/hooks/useWorkData';

export const HeroSection = () => {
  const [showSubtext, setShowSubtext] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const { data } = useWorkData();

  const { scrollY } = useScroll();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    const timer = setTimeout(() => setShowScroll(true), 3000);
    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timer);
    };
  }, []);

  return (
    <section className="min-h-screen flex flex-col justify-center relative px-6 md:px-12 pb-32 pt-32 overflow-hidden">
      <div className="max-w-7xl w-full mx-auto relative">
        <div className="mb-12">
          {/* Top Line - mobile high contrast with scroll hand-off */}
          <motion.div
            className="md:hidden"
          >
            <div className="w-20 h-px bg-white" />
          </motion.div>
          <DrawingLine className="hidden md:block w-64" delay={0.5} />
        </div>

        {/* Main title - editorial asymmetric layout */}
        <div className="mb-10 md:mb-12 w-full">
          {/* Line 1: Where */}
          <h1 className="text-[13vw] leading-[1.05] md:text-5xl lg:text-7xl font-light md:leading-[0.95] tracking-tight whitespace-nowrap">
            <TypewriterText
              text={!isMobile ? "Where culture is" : "Where"}
              delay={800}
              speed={35}
              onComplete={() => setShowSubtext(true)}
            />
          </h1>

          {/* Line 2: culture is (Mobile Only - now handled above for desktop) */}
          {isMobile && (
            <div className="md:hidden mt-2">
              <h1 className="text-[13vw] leading-[1.05] font-light tracking-tight whitespace-nowrap">
                <TypewriterText
                  text="culture is"
                  delay={1000}
                  speed={35}
                  onComplete={() => setShowSubtext(true)}
                />
              </h1>
            </div>
          )}

          <div className="mt-2 md:mt-5">
            <h1 className="text-[13vw] md:text-5xl lg:text-7xl font-light leading-[1.05] md:leading-[0.95] tracking-tight whitespace-nowrap">
              {showSubtext && (
                <TypewriterText
                  text="designed,"
                  delay={200}
                  speed={35}
                  highlightWords={["designed"]}
                />
              )}
            </h1>
          </div>

          <div className="min-h-[1.5rem] md:min-h-[2.5rem] lg:min-h-[3rem] mt-8 md:mt-2 text-right md:text-right">
            {showSubtext && (
              <h1 className="text-[13vw] md:text-5xl lg:text-7xl font-light leading-[1.05] tracking-tight whitespace-nowrap">
                <TypewriterText
                  text="not chased."
                  delay={600}
                  speed={45}
                />
              </h1>
            )}
          </div>
        </div>

        {/* Subtext - Mobile V5 Style with vertical accent */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: showSubtext ? 1 : 0, x: showSubtext ? 0 : -10 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="md:max-w-md ml-0 md:ml-auto mr-0 md:mr-[10%] lg:mr-[15%] text-left md:text-right mb-12 md:mb-16 flex items-start md:block"
        >
          {/* Vertical line accent for mobile */}
          <div className="md:hidden w-px h-24 bg-white/40 mr-4 mt-1 shrink-0" />

          <div className="space-y-1 md:space-y-2">
            <p className="leading-relaxed text-muted-foreground text-xs md:text-base">
              Creator-led creative <br className="md:hidden" /> & production agency.
            </p>
            <p className="leading-relaxed text-muted-foreground text-xs md:text-base">
              We architect ecosystems, <br className="md:hidden" /> design narratives, <br className="md:hidden" /> and activate culture.
            </p>
          </div>
        </motion.div>

        {/* Logo Loop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showSubtext ? 1 : 0 }}
          transition={{ duration: 1.2, delay: 1.2 }}
          className="mt-8 -ml-6 md:-ml-12 w-[100vw] py-8 md:py-16 overflow-hidden"
        >
          {data?.logos && data.logos.length > 0 && (
            <div className="md:hidden">
              <LogoLoop
                logos={data.logos}
                speed={30}
                gap={60}
                logoHeight={60}
                fadeOut
                fadeOutColor="hsl(var(--background))"
                className="logoloop--invert"
              />
            </div>
          )}
          {data?.logos && data.logos.length > 0 && (
            <div className="hidden md:block">
              <LogoLoop
                logos={data.logos}
                speed={40}
                gap={180}
                logoHeight={120}
                fadeOut
                fadeOutColor="hsl(var(--background))"
                className="logoloop--invert"
              />
            </div>
          )}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showScroll ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        className="absolute bottom-8 right-6 md:right-12 z-20"
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex items-center gap-3"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] font-light text-muted-foreground rotate-90 origin-left translate-x-1">
            SCROLL
          </span>
          <div className="flex flex-col items-center">
            <div className="w-px h-12 bg-muted-foreground/30 relative">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[5px] h-[5px] border-b border-r border-muted-foreground/30 rotate-45" />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};


