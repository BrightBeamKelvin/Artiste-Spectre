import { motion } from 'framer-motion';
import { RevealText } from './RevealText';
import { DrawingLine } from './DrawingLine';

const manifestoLines = [
  "We don't follow culture.",
  "We design it.",
  "",
  "Artiste Spectre was built for a world",
  "where attention is currency",
  "and authenticity is the cost of entry.",
  "",
  "We believe influence isn't found in algorithms.",
  "It's built through clarity, craft, and control.",
];

export const ManifestoSection = () => {
  return (
    <section className="min-h-screen flex items-center py-24">
      <div className="w-full max-w-3xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <span className="scene-heading">MANIFESTO</span>
        </motion.div>
        
        <DrawingLine className="w-full mb-16" delay={0.2} />
        
        <div className="space-y-2">
          {manifestoLines.map((line, index) => (
            <RevealText 
              key={index} 
              delay={index * 0.08}
              className={`screenplay-line ${line === '' ? 'h-6' : ''}`}
            >
              {line}
            </RevealText>
          ))}
        </div>
        
        <DrawingLine className="w-48 mt-16" delay={0.6} />
      </div>
    </section>
  );
};
