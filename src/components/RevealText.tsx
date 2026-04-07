import { motion, MotionValue, useTransform } from 'framer-motion';
import { ReactNode } from 'react';

interface RevealTextProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  scrollProgress?: MotionValue<number>;
  trigger?: boolean;
}

export const RevealText = ({ children, className = '', delay = 0, scrollProgress, trigger }: RevealTextProps) => {
  // If scrollProgress is provided, bind animation to scroll (0.18 to 0.28 threshold + delay)
  const scrollDelay = delay * 0.1; 
  const opacityTransform = scrollProgress ? useTransform(scrollProgress, [0.18 + scrollDelay, 0.28 + scrollDelay], [0, 1]) : undefined;
  const yTransform = scrollProgress ? useTransform(scrollProgress, [0.18 + scrollDelay, 0.28 + scrollDelay], [12, 0]) : undefined;

  // If manual trigger is used, determine state
  const animateState = trigger ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 };

  if (scrollProgress) {
    return (
      <motion.div
        className={className}
        style={{ opacity: opacityTransform, y: yTransform }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      animate={trigger !== undefined ? animateState : undefined}
      whileInView={trigger === undefined ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ 
        duration: 0.8, 
        delay,
        ease: [0.215, 0.61, 0.355, 1] // Out-Cubic for smooth stop
      }}
    >
      {children}
    </motion.div>
  );
};
