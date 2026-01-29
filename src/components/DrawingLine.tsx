import { motion } from 'framer-motion';

interface DrawingLineProps {
  className?: string;
  delay?: number;
  vertical?: boolean;
}

export const DrawingLine = ({ className = '', delay = 0, vertical = false }: DrawingLineProps) => {
  return (
    <motion.div
      className={`bg-border ${vertical ? 'w-px' : 'h-px'} ${className}`}
      initial={{ scaleX: vertical ? 1 : 0, scaleY: vertical ? 0 : 1 }}
      whileInView={{ scaleX: 1, scaleY: 1 }}
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
