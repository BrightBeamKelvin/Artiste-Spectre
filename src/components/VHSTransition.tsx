import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ASCIIText from './ASCIIText';

interface VHSTransitionProps {
  isActive: boolean;
  onComplete: () => void;
  persist?: boolean;
}

export const VHSTransition = ({ isActive, onComplete, persist = false }: VHSTransitionProps) => {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>(isActive ? 'hold' : 'in');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isActive) {
      setPhase('hold');

      if (!persist) {
        // Notify parent while screen is covered
        const navigateTimer = setTimeout(() => {
          onComplete();
        }, 900);

        // Out phase - fade out AFTER onComplete
        const outTimer = setTimeout(() => setPhase('out'), 1100);

        return () => {
          clearTimeout(navigateTimer);
          clearTimeout(outTimer);
        };
      }
    } else {
      // Reset for next activation
      setPhase('in');
    }
  }, [isActive, onComplete, persist]);

  const [animatedFontSize, setAnimatedFontSize] = useState(5);

  useEffect(() => {
    if (isActive && isMobile) {
      const duration = 1000; // 1 second cycle
      const startSize = 8;
      const endSize = 2;
      let startTime = Date.now();

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Linear interpolation from 5 to 1
        const newSize = startSize + (endSize - startSize) * progress;
        setAnimatedFontSize(newSize);

        if (progress >= 1) {
          // Restart cycle or stay at 1? The user said "cycle", so I'll restart it.
          startTime = Date.now();
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isActive, isMobile]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-[10002] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Black base - start at opacity 1 to cover screen instantly */}
          <motion.div
            className="absolute inset-0 bg-background"
            initial={{ opacity: 1 }}
            animate={{ opacity: phase === 'out' ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          />

          {/* ASCII Text in center - responsive sizing */}
          <motion.div
            className="relative z-10 w-full h-32 md:h-48 px-0"
            animate={{
              opacity: phase === 'hold' ? 1 : 0,
            }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {phase === 'hold' && (
              <ASCIIText
                text="ARTISTE SPECTRE"
                enableWaves={false}
                asciiFontSize={isMobile ? animatedFontSize : 4}
                textFontSize={isMobile ? 20 : 20}
                planeBaseHeight={isMobile ? 6 : 6}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
