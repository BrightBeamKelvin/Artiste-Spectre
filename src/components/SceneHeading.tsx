import { motion } from 'framer-motion';

interface SceneHeadingProps {
  location: string;
  time?: string;
  number?: string;
}

export const SceneHeading = ({ location, time = 'CONTINUOUS', number }: SceneHeadingProps) => {
  return (
    <motion.div 
      className="flex items-center gap-4 mb-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {number && (
        <span className="scene-heading text-muted-foreground/50">{number}</span>
      )}
      <span className="scene-heading">INT. {location}</span>
      <div className="flex-1 h-px bg-border origin-left" />
      <span className="scene-heading text-muted-foreground/50">{time}</span>
    </motion.div>
  );
};
