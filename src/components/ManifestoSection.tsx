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
    <section className="min-h-screen flex flex-col justify-center py-16 md:py-24 overflow-hidden">
      <div className="w-full max-w-[90rem] ml-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">

          {/* Video Content - Left on Desktop, Below on Mobile */}
          <motion.div
            className="order-2 md:order-1 w-full md:w-auto"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative w-full max-w-xl overflow-hidden">
              <video
                src="https://cjortzrbfxpqnq4i.public.blob.vercel-storage.com/Album%20Covers/Alison%20Wonderland/alison%201.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-auto shadow-2xl"
              />
              <div className="absolute inset-0 bg-background/5 mix-blend-overlay pointer-events-none" />
            </div>
          </motion.div>

          {/* Text Content - Original Layout & Wrapping */}
          <div className="order-1 md:order-2 max-w-2xl ml-auto md:mr-24">
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
      </div>
    </section>
  );
};
