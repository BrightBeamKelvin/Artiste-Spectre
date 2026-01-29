import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TrailDot {
  id: number;
  x: number;
  y: number;
}

export const CursorTrail = () => {
  const [trail, setTrail] = useState<TrailDot[]>([]);
  
  useEffect(() => {
    let idCounter = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      const newDot: TrailDot = {
        id: idCounter++,
        x: e.clientX,
        y: e.clientY,
      };
      
      setTrail(prev => [...prev.slice(-8), newDot]);
    };

    // Throttle mouse move
    let lastTime = 0;
    const throttledHandler = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime > 50) {
        handleMouseMove(e);
        lastTime = now;
      }
    };

    window.addEventListener('mousemove', throttledHandler);
    return () => window.removeEventListener('mousemove', throttledHandler);
  }, []);

  // Clean up old dots
  useEffect(() => {
    const interval = setInterval(() => {
      setTrail(prev => prev.slice(1));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {trail.map((dot, index) => (
          <motion.div
            key={dot.id}
            initial={{ opacity: 0.3, scale: 0 }}
            animate={{ opacity: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute w-1 h-1 bg-foreground/20 rounded-full"
            style={{
              left: dot.x - 2,
              top: dot.y - 2,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
