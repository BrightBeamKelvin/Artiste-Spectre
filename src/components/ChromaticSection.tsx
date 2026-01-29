import { useRef, ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ChromaticSectionProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

export const ChromaticSection = ({ 
  children, 
  className = '',
  intensity = 1 
}: ChromaticSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Chromatic aberration offsets - prism color split
  const redX = useTransform(scrollYProgress, [0, 0.5, 1], [-2 * intensity, 0, 2 * intensity]);
  const blueX = useTransform(scrollYProgress, [0, 0.5, 1], [2 * intensity, 0, -2 * intensity]);
  const greenY = useTransform(scrollYProgress, [0, 0.5, 1], [1 * intensity, 0, -1 * intensity]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Red channel - offset left/right */}
      <motion.div 
        className="absolute inset-0 mix-blend-screen opacity-[0.15] pointer-events-none"
        style={{ 
          x: redX,
          filter: 'url(#redChannel)'
        }}
      >
        {children}
      </motion.div>
      
      {/* Blue channel - offset opposite */}
      <motion.div 
        className="absolute inset-0 mix-blend-screen opacity-[0.15] pointer-events-none"
        style={{ 
          x: blueX,
          filter: 'url(#blueChannel)'
        }}
      >
        {children}
      </motion.div>
      
      {/* Green channel - slight vertical offset */}
      <motion.div 
        className="absolute inset-0 mix-blend-screen opacity-[0.08] pointer-events-none"
        style={{ 
          y: greenY,
          filter: 'url(#greenChannel)'
        }}
      >
        {children}
      </motion.div>
      
      {/* Main content */}
      <div className="relative">
        {children}
      </div>
    </div>
  );
};
