import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface DatamoshDividerProps {
  className?: string;
}

export const DatamoshDivider = ({ className = '' }: DatamoshDividerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Create glitchy horizontal slice offsets
  const slice1X = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [0, 12, -8, 15, 0]);
  const slice2X = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0, -18, 10, -12, 0]);
  const slice3X = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0, 8, -15, 0]);
  const slice4X = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0, -10, 20, 0]);

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} className={`relative h-32 overflow-hidden ${className}`}>
      <motion.div 
        className="absolute inset-0"
        style={{ opacity }}
      >
        {/* Horizontal glitch slices */}
        <motion.div 
          className="absolute top-0 left-0 right-0 h-1 bg-foreground/5"
          style={{ x: slice1X }}
        />
        <motion.div 
          className="absolute top-4 left-0 right-0 h-px bg-foreground/10"
          style={{ x: slice2X }}
        />
        <motion.div 
          className="absolute top-8 left-0 right-0 h-2 bg-foreground/3"
          style={{ x: slice3X }}
        />
        <motion.div 
          className="absolute top-14 left-0 right-0 h-px bg-foreground/8"
          style={{ x: slice4X }}
        />
        
        {/* Mirrored bottom slices */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-1 bg-foreground/5"
          style={{ x: slice2X }}
        />
        <motion.div 
          className="absolute bottom-4 left-0 right-0 h-px bg-foreground/10"
          style={{ x: slice1X }}
        />
        <motion.div 
          className="absolute bottom-8 left-0 right-0 h-2 bg-foreground/3"
          style={{ x: slice4X }}
        />
        <motion.div 
          className="absolute bottom-14 left-0 right-0 h-px bg-foreground/8"
          style={{ x: slice3X }}
        />

        {/* Color artifacts */}
        <motion.div 
          className="absolute top-1/2 left-0 right-0 h-px"
          style={{ 
            x: slice1X,
            background: 'linear-gradient(90deg, transparent, rgba(255,100,100,0.1), transparent, rgba(100,100,255,0.1), transparent)'
          }}
        />
      </motion.div>
    </div>
  );
};
