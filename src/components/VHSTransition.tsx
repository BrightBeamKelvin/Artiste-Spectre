import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ASCIIText from './ASCIIText';

interface VHSTransitionProps {
  isActive: boolean;
  onComplete: () => void;
}

export const VHSTransition = ({ isActive, onComplete }: VHSTransitionProps) => {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isActive) {
      setPhase('in');
      
      // Hold phase - show ASCII text
      const holdTimer = setTimeout(() => setPhase('hold'), 300);
      
      // Navigate while screen is covered (during hold phase)
      const navigateTimer = setTimeout(() => {
        onComplete();
      }, 900);
      
      // Out phase - fade out AFTER navigation
      const outTimer = setTimeout(() => setPhase('out'), 1100);

      return () => {
        clearTimeout(holdTimer);
        clearTimeout(navigateTimer);
        clearTimeout(outTimer);
      };
    }
  }, [isActive, onComplete]);

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

          {/* ASCII Text in center - responsive sizing */}
          <motion.div
            className="relative z-10 w-full h-32 md:h-48 px-4"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: phase === 'hold' ? 1 : 0,
            }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {phase === 'hold' && (
              <ASCIIText
                text="ARTISTE SPECTRE"
                enableWaves={false}
                asciiFontSize={isMobile ? 4 : 6}
                textFontSize={isMobile ? 48 : 120}
                planeBaseHeight={isMobile ? 4 : 6}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
