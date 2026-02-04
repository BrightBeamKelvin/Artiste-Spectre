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
    <section className="min-h-screen flex flex-col justify-center py-16 md:py-24">
      <div className="w-full max-w-3xl mx-auto px-6 md:px-12">
        <DrawingLine className="w-full mb-10" delay={0.2} />

        <div className="space-y-4">
          {manifestoLines.map((line, index) => (
            <RevealText
              key={index}
              delay={index * 0.08}
              className={`text-xl md:text-2xl font-light leading-relaxed ${line === '' ? 'h-6' : ''}`}
            >
              {line}
            </RevealText>
          ))}
        </div>

        <DrawingLine className="w-48 mt-10" delay={0.6} />
      </div>
    </section>
  );
};
