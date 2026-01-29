import { useRef, ReactNode, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

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
  const [isInView, setIsInView] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Smooth spring for aberration
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // More pronounced chromatic splits
  const redX = useTransform(smoothProgress, [0, 0.5, 1], [-6 * intensity, 0, 6 * intensity]);
  const redY = useTransform(smoothProgress, [0, 0.5, 1], [-2 * intensity, 0, 2 * intensity]);
  const blueX = useTransform(smoothProgress, [0, 0.5, 1], [6 * intensity, 0, -6 * intensity]);
  const blueY = useTransform(smoothProgress, [0, 0.5, 1], [2 * intensity, 0, -2 * intensity]);
  
  // Parallax for main content
  const contentY = useTransform(smoothProgress, [0, 1], [30, -30]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Red/Cyan ghost - left offset */}
      <motion.div 
        className="absolute inset-0 pointer-events-none select-none"
        style={{ 
          x: redX,
          y: redY,
          opacity: isInView ? 0.4 : 0,
          color: 'rgb(255, 80, 80)',
          mixBlendMode: 'screen',
          transition: 'opacity 0.3s ease'
        }}
        aria-hidden="true"
      >
        <div style={{ filter: 'blur(0.5px)' }}>
          {children}
        </div>
      </motion.div>
      
      {/* Blue ghost - right offset */}
      <motion.div 
        className="absolute inset-0 pointer-events-none select-none"
        style={{ 
          x: blueX,
          y: blueY,
          opacity: isInView ? 0.35 : 0,
          color: 'rgb(80, 120, 255)',
          mixBlendMode: 'screen',
          transition: 'opacity 0.3s ease'
        }}
        aria-hidden="true"
      >
        <div style={{ filter: 'blur(0.5px)' }}>
          {children}
        </div>
      </motion.div>
      
      {/* Main content with subtle parallax */}
      <motion.div 
        className="relative"
        style={{ y: contentY }}
      >
        {children}
      </motion.div>
    </div>
  );
};
