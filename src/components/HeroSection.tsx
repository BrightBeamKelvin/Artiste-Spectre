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
    <section className="min-h-screen flex flex-col justify-center relative px-6 md:px-12">
      <div className="max-w-5xl mx-auto w-full">
        {/* Scene heading */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-8"
        >
          <span className="scene-heading">INT. ARTISTE SPECTRE — PRESENT</span>
        </motion.div>
        
        <DrawingLine className="w-full mb-12" delay={0.5} />
        
        {/* Main title */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-light leading-tight tracking-tight">
            <TypewriterText 
              text="Where culture is designed," 
              delay={800}
              speed={35}
              onComplete={() => setShowSubtext(true)}
            />
          </h1>
          {showSubtext && (
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-light leading-tight tracking-tight mt-2">
              <TypewriterText 
                text="not chased." 
                delay={200}
                speed={45}
              />
            </h1>
          )}
        </div>
        
        {/* Subtext */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showSubtext ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-xl"
        >
          <p className="action-text leading-relaxed">
            Creator-led creative & production agency. We architect ecosystems,
            design narratives, and activate culture.
          </p>
        </motion.div>
        
        <DrawingLine className="w-32 mt-12" delay={2.5} />
      </div>
      
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showScroll ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        className="absolute bottom-12 left-6 md:left-12"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-start gap-2"
        >
          <span className="scene-heading text-muted-foreground/50">SCROLL</span>
          <div className="w-px h-8 bg-gradient-to-b from-muted-foreground/50 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
};
