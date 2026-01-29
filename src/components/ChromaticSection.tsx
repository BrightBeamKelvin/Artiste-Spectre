import { useRef, ReactNode, useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

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
  
  // Track scroll velocity
  const scrollVelocity = useMotionValue(0);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout>();
  
  // Springs that snap back quickly when scrolling stops
  const springConfig = { stiffness: 400, damping: 30 };
  
  const redX = useSpring(0, springConfig);
  const blueX = useSpring(0, springConfig);
  const contentY = useSpring(0, springConfig);
  const aberrationOpacity = useSpring(0, { stiffness: 300, damping: 25 });

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const velocity = currentScrollY - lastScrollY.current;
      lastScrollY.current = currentScrollY;
      
      // Clamp velocity for subtle effect
      const clampedVelocity = Math.max(-1, Math.min(1, velocity / 15));
      
      // Apply subtle offsets based on scroll direction
      redX.set(clampedVelocity * 2 * intensity);
      blueX.set(clampedVelocity * -2 * intensity);
      contentY.set(clampedVelocity * 3 * intensity);
      aberrationOpacity.set(Math.abs(clampedVelocity) * 0.5);
      
      // Clear existing timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      
      // Snap back to normal when scrolling stops
      scrollTimeout.current = setTimeout(() => {
        redX.set(0);
        blueX.set(0);
        contentY.set(0);
        aberrationOpacity.set(0);
      }, 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [intensity, redX, blueX, contentY, aberrationOpacity]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Red ghost */}
      <motion.div 
        className="absolute inset-0 pointer-events-none select-none"
        style={{ 
          x: redX,
          opacity: aberrationOpacity,
          color: 'rgb(255, 100, 100)',
          mixBlendMode: 'screen',
        }}
        aria-hidden="true"
      >
        {children}
      </motion.div>
      
      {/* Blue ghost */}
      <motion.div 
        className="absolute inset-0 pointer-events-none select-none"
        style={{ 
          x: blueX,
          opacity: aberrationOpacity,
          color: 'rgb(100, 140, 255)',
          mixBlendMode: 'screen',
        }}
        aria-hidden="true"
      >
        {children}
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
