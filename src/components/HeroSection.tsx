import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TypewriterText } from './TypewriterText';
import { DrawingLine } from './DrawingLine';

export const HeroSection = () => {
  const [showSubtext, setShowSubtext] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowScroll(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="min-h-screen flex flex-col justify-center relative px-6 md:px-12 py-24">
      <div className="max-w-5xl mx-auto w-full">
        <DrawingLine className="w-full mb-8" delay={0.5} />

        {/* Main title */}
        <div className="mb-8 min-h-[4.5rem] md:min-h-[7.5rem] lg:min-h-[8.5rem]">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-light leading-tight tracking-tight">
            <TypewriterText
              text="Where culture is designed,"
              delay={800}
              speed={35}
              onComplete={() => setShowSubtext(true)}
              highlightWords={["designed"]}
            />
          </h1>
          <div className="min-h-[1.5rem] md:min-h-[2.5rem] lg:min-h-[3rem] mt-2">
            {showSubtext && (
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-light leading-tight tracking-tight">
                <TypewriterText
                  text="not chased."
                  delay={200}
                  speed={45}
                />
              </h1>
            )}
          </div>
        </div>

        {/* Subtext */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showSubtext ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-xl"
        >
          <p className="leading-relaxed text-muted-foreground">
            Creator-led creative & production agency.
          </p>
          <p className="leading-relaxed text-muted-foreground mt-2">
            We architect ecosystems, design narratives, and activate culture.
          </p>
        </motion.div>

        <DrawingLine className="w-32 mt-8" delay={2.5} />
      </div>

      {/* Scroll indicator - text and arrow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showScroll ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        className="absolute bottom-12 left-6 md:left-12 z-20"
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
