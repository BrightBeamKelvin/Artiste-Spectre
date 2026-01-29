import { motion } from 'framer-motion';
import { RevealText } from './RevealText';
import { DrawingLine } from './DrawingLine';

const beliefs = [
  "Influence is engineered, not accidental",
  "Quality scales when strategy leads execution",
  "Culture moves faster than advertising",
  "Creators are modern media companies",
  "Brands must earn attention, not buy it",
];

export const BeliefsSection = () => {
  return (
    <section className="min-h-screen flex items-center py-24">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <span className="scene-heading">WHAT WE BELIEVE</span>
        </motion.div>
        
        <DrawingLine className="w-full mb-16" delay={0.2} />
        
        <div className="space-y-6">
          {beliefs.map((belief, index) => (
            <RevealText 
              key={index} 
              delay={index * 0.1}
              className="flex items-baseline gap-4"
            >
              <motion.span 
                className="text-muted-foreground/30 text-xs select-none"
                whileHover={{ opacity: 1 }}
              >
                ●
              </motion.span>
              <p className="screenplay-line">{belief}</p>
            </RevealText>
          ))}
        </div>
      </div>
    </section>
  );
};
