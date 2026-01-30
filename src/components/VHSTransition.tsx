import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VHSTransitionProps {
  isActive: boolean;
  onComplete: () => void;
}

export const VHSTransition = ({ isActive, onComplete }: VHSTransitionProps) => {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in');

  useEffect(() => {
    if (isActive) {
      setPhase('in');
      
      // Hold phase - show text
      const holdTimer = setTimeout(() => setPhase('hold'), 400);
      
      // Navigate while screen is covered (during hold phase)
      const navigateTimer = setTimeout(() => {
        onComplete();
      }, 800);
      
      // Out phase - fade out AFTER navigation
      const outTimer = setTimeout(() => setPhase('out'), 1000);

      return () => {
        clearTimeout(holdTimer);
        clearTimeout(navigateTimer);
        clearTimeout(outTimer);
      };
    }
  }, [isActive, onComplete]);

  // Generate static noise lines
  const staticLines = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    height: `${1 + Math.random() * 3}px`,
    delay: Math.random() * 0.2,
    duration: 0.05 + Math.random() * 0.1,
  }));

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Black base */}
          <motion.div 
            className="absolute inset-0 bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'out' ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* VHS static noise overlay */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {staticLines.map((line) => (
              <motion.div
                key={line.id}
                className="absolute left-0 right-0 bg-foreground/20"
                style={{ 
                  top: line.top, 
                  height: line.height,
                }}
                initial={{ x: '-100%', opacity: 0 }}
                animate={{ 
                  x: ['100%', '-100%', '50%', '-100%'],
                  opacity: [0, 0.6, 0.3, 0],
                }}
                transition={{
                  duration: 1.2,
                  delay: line.delay,
                  repeat: 0,
                  ease: 'linear',
                }}
              />
            ))}
          </div>

          {/* Horizontal glitch bars */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'hold' ? 0.15 : 0.4 }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute left-0 right-0 bg-foreground"
                style={{ 
                  top: `${10 + i * 12}%`,
                  height: '2px',
                }}
                animate={{
                  x: [0, 20, -15, 5, 0],
                  opacity: [0.3, 0.8, 0.2, 0.6, 0.3],
                }}
                transition={{
                  duration: 0.15,
                  repeat: Infinity,
                  delay: i * 0.02,
                }}
              />
            ))}
          </motion.div>

          {/* Scanlines */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
            }}
          />

          {/* Center text */}
          <motion.div
            className="relative z-10 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: phase === 'hold' ? 1 : 0,
              scale: phase === 'hold' ? 1 : 0.95,
            }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.h1 
              className="text-2xl md:text-4xl tracking-[0.4em] font-light"
              animate={{
                x: phase === 'hold' ? [0, 2, -1, 0] : 0,
              }}
              transition={{
                duration: 0.1,
                repeat: phase === 'hold' ? Infinity : 0,
                repeatDelay: 0.5,
              }}
            >
              ARTISTE SPECTRE
            </motion.h1>
            <motion.div 
              className="mt-4 h-px bg-foreground/50 mx-auto"
              initial={{ width: 0 }}
              animate={{ width: phase === 'hold' ? 200 : 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            />
          </motion.div>

          {/* Color aberration flashes */}
          <motion.div
            className="absolute inset-0 pointer-events-none mix-blend-screen"
            animate={{
              backgroundColor: ['transparent', 'rgba(255,50,50,0.1)', 'transparent', 'rgba(50,50,255,0.1)', 'transparent'],
            }}
            transition={{
              duration: 0.2,
              repeat: Infinity,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
