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
    <section className="min-h-screen flex flex-col justify-center py-16 md:py-24">
      <div className="w-full max-w-5xl mx-auto px-6 md:px-12">
        <DrawingLine className="w-32 mb-20" delay={0.2} />

        <div className="space-y-8 md:space-y-12">
          {beliefs.map((belief, index) => (
            <RevealText
              key={index}
              delay={index * 0.1}
              className="group"
            >
              <div className="flex items-start gap-6 md:gap-8">
                <span className="text-[10px] text-muted-foreground/20 font-mono pt-2 select-none min-w-[24px]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <motion.h3
                  className="text-xl md:text-3xl lg:text-4xl font-light leading-tight tracking-tight max-w-4xl"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  {belief}
                </motion.h3>
              </div>
            </RevealText>
          ))}
        </div>
      </div>
    </section>
  );
};
