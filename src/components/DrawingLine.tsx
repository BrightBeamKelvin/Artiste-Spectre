import { motion } from 'framer-motion';

interface DrawingLineProps {
  className?: string;
  delay?: number;
  vertical?: boolean;
  trigger?: boolean;
}

export const DrawingLine = ({ className = '', delay = 0, vertical = false, trigger }: DrawingLineProps) => {
  const animateState = { scaleX: 1, scaleY: 1 };
  const initialState = { scaleX: vertical ? 1 : 0, scaleY: vertical ? 0 : 1 };

  return (
    <motion.div
      className={`bg-white/20 ${vertical ? 'w-px' : 'h-px'} ${className}`}
      initial={initialState}
      animate={trigger !== undefined ? (trigger ? animateState : initialState) : undefined}
      whileInView={trigger === undefined ? animateState : undefined}
      viewport={{ once: true }}
      transition={{ 
        duration: 1.2, 
        delay,
        ease: [0.16, 1, 0.3, 1]
      }}
      style={{ transformOrigin: vertical ? 'top' : 'left' }}
    />
  );
};
