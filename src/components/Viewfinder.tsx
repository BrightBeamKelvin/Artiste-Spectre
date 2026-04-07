import { useEffect, useState } from 'react';
import { motion, useTransform, MotionValue } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface ViewfinderProps {
  className?: string;
  children?: React.ReactNode;
  showMarkers?: boolean;
  onReady?: () => void;
  isClosing?: boolean;
  onCloseComplete?: () => void;
  layoutId?: string;
  style?: any;
  boxOpacity?: MotionValue<number>;
  inverseX?: MotionValue<number>;
  inverseY?: MotionValue<number>;
  sourceWidth?: string | number;
  sourceHeight?: string | number;
}

export const Viewfinder = ({ 
  className = '', 
  children, 
  showMarkers = true,
  onReady,
  isClosing = false,
  onCloseComplete,
  layoutId,
  style,
  boxOpacity,
  inverseX,
  inverseY,
  sourceWidth = "100%",
  sourceHeight = "100%"
}: ViewfinderProps) => {
  const [isOpening, setIsOpening] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // If we're mounting because of a transition, the wait has already happened.
    // We use a small 100ms delay to ensure the component is fully ready.
    // Otherwise, for a cold start, we use 1000ms to overlap with the Machina intro.
    const isFromTransition = location.state?.fromTransition;
    const delay = isFromTransition ? 100 : 1000;

    const timer = setTimeout(() => {
      setIsOpening(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [location.state?.fromTransition]);

  return (
    <motion.div 
      style={style}
      initial={{ scaleX: 0, scaleY: 0.05, opacity: 0 }}
      animate={isOpening ? { 
        scaleX: [0, 1, 1], 
        scaleY: [0.05, 0.05, 1], 
        opacity: [0, 1, 1] 
      } : { scaleX: 0, scaleY: 0.05, opacity: 0 }}
      transition={{
        duration: 0.6,
        times: [0, 0.4, 1],
        ease: [0.16, 1, 0.3, 1]
      }}
      onAnimationComplete={() => {
        if (isClosing) {
          onCloseComplete?.();
        } else if (isOpening) {
          onReady?.();
        }
      }}
      className={`relative ${className}`}
    >
      {/* The background/border styling layer that can fade out separately */}
      <motion.div 
        className="absolute inset-0 pointer-events-none border border-white/5 bg-white/[0.01]"
        style={boxOpacity ? { opacity: boxOpacity } : undefined}
      >
        {/* Stylistic Candy: Chromatic Fringing */}
        <div className="absolute inset-0 border border-red-500/5 -translate-x-[1px]" />
        <div className="absolute inset-0 border border-blue-500/5 translate-x-[1px]" />
        
        {/* Stylistic Candy: Micro-Grid / Scanlines */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ 
               backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', 
               backgroundSize: '24px 24px' 
             }} 
        />
        
        {/* Stylistic Candy: Glitchy 'Zaps' */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px w-full bg-white/10"
              initial={{ top: `${Math.random() * 100}%`, opacity: 0, scaleX: 0 }}
              animate={{ 
                opacity: [0, 0.4, 0],
                scaleX: [0, 1.2, 0],
                top: [`${Math.random() * 100}%`, `${Math.random() * 100}%`]
              }}
              transition={{
                duration: 0.15,
                repeat: Infinity,
                repeatDelay: Math.random() * 15 + 5,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Stylistic Candy: Simple Shapes (Grey for Noise Interaction) */}
        <div className="absolute inset-0 pointer-events-none text-white/20 font-mono text-[8px] uppercase tracking-widest">
          {/* Mid-Left Crosshair */}
          <div className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2">+</div>
          {/* Mid-Right Crosshair */}
          <div className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2">+</div>
          
          {/* Brackets */}
          <div className="hidden md:block absolute left-[20%] top-4">[</div>
          <div className="hidden md:block absolute right-[20%] top-4">]</div>

          {/* Dot cluster (Top Left / Mobile Top Right) */}
          <div className="absolute top-12 right-6 md:right-auto md:left-12 flex flex-col gap-1 opacity-40">
            <div className="flex gap-1"><div className="w-0.5 h-0.5 bg-white" /><div className="w-0.5 h-0.5 bg-white" /></div>
            <div className="flex gap-1"><div className="w-0.5 h-0.5 bg-white" /><div className="w-0.5 h-0.5 bg-white" /></div>
          </div>
          
          {/* Rule of Thirds Grid - Only during animation */}
          <motion.div 
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={isClosing ? { opacity: 0.15 } : (isOpening ? { opacity: [0, 0.15, 0] } : { opacity: 0 })}
            transition={isOpening ? {
              duration: 1.2,
              times: [0, 0.4, 1],
              ease: "easeInOut",
              delay: 0.2
            } : { duration: 0.3 }}
          >
            <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/40" />
            <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/40" />
            <div className="absolute top-1/3 left-0 right-0 h-px bg-white/40" />
            <div className="absolute top-2/3 left-0 right-0 h-px bg-white/40" />
          </motion.div>

          {/* Corner Angle Mark (Extreme Bottom Left Only) */}
          <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white/20" />

          {/* Side Ruler Ticks (Left Only) */}
          <div className="hidden md:flex absolute left-0 top-1/4 bottom-1/4 flex-col justify-between items-start pl-1 opacity-30">
            {[...Array(5)].map((_, i) => <div key={i} className="w-1 h-px bg-white" />)}
          </div>
        </div>
      </motion.div>
      {showMarkers && (
        <>
          {/* Top Left */}
          <motion.div 
            className="absolute -top-2 -left-2 w-4 h-4 z-10 pointer-events-none"
          >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-white/40" />
            <div className="absolute top-0 left-0 w-[1px] h-full bg-white/40" />
          </motion.div>
          
          {/* Top Right */}
          <motion.div 
            className="absolute -top-2 -right-2 w-4 h-4 z-10 pointer-events-none"
          >
            <div className="absolute top-0 right-0 w-full h-[1px] bg-white/40" />
            <div className="absolute top-0 right-0 w-[1px] h-full bg-white/40" />
          </motion.div>
          
          {/* Bottom Left */}
          <motion.div 
            className="absolute -bottom-2 -left-2 w-4 h-4 z-10 pointer-events-none"
          >
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/40" />
            <div className="absolute bottom-0 left-0 w-[1px] h-full bg-white/40" />
          </motion.div>
          
          {/* Bottom Right */}
          <motion.div 
            className="absolute -bottom-2 -right-2 w-4 h-4 z-10 pointer-events-none"
          >
            <div className="absolute bottom-0 right-0 w-full h-[1px] bg-white/40" />
            <div className="absolute bottom-0 right-0 w-[1px] h-full bg-white/40" />
          </motion.div>
        </>
      )}

      <motion.div
        className="relative z-10 w-full h-full flex items-center justify-center overflow-hidden"
        animate={{ opacity: isClosing ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div 
          style={{ 
            x: inverseX, 
            y: inverseY,
            width: sourceWidth,
            height: sourceHeight
          }}
          className="flex max-w-[1440px] shrink-0 justify-center items-stretch"
        >
          <div className="w-full h-full flex flex-col">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
