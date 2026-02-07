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
      <div className="w-full max-w-7xl ml-auto px-6 md:px-12">
        <div className="max-w-2xl ml-auto">
          <DrawingLine className="w-48 mb-10" delay={0.2} />

          <div className="space-y-3">
            {manifestoLines.map((line, index) => (
              <RevealText
                key={index}
                delay={index * 0.08}
                className={`text-lg md:text-xl font-light leading-relaxed ${line === '' ? 'h-4' : ''}`}
              >
                {line}
              </RevealText>
            ))}
          </div>

          <DrawingLine className="w-32 mt-10" delay={0.6} />
        </div>
      </div>
    </section>
  );
};
