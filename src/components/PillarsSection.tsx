import { motion } from 'framer-motion';
import { RevealText } from './RevealText';
import { DrawingLine } from './DrawingLine';

const pillars = [
  { num: '01', title: 'Cultural Intelligence', desc: 'We understand internet-native behavior and design work that speaks fluently across platforms.' },
  { num: '02', title: 'Premium Execution', desc: 'Every output meets commercial, luxury, and cinematic standards.' },
  { num: '03', title: 'End-to-End Control', desc: 'Strategy, creative, production, and activation live under one vision.' },
  { num: '04', title: 'Creator-First', desc: 'Systems that allow creators to operate at enterprise scale.' },
  { num: '05', title: 'Longevity', desc: 'Work that compounds brand value, not just short-term metrics.' },
];

export const PillarsSection = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center py-16 md:py-24">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
        <DrawingLine className="w-96 mb-16" delay={0.2} />

        <div className="grid md:grid-cols-2 gap-x-24 gap-y-0">
          {pillars.map((pillar, index) => (
            <RevealText key={pillar.num} delay={index * 0.1}>
              <motion.div
                className={`group py-12 border-b border-border cursor-default ${index % 2 === 0 ? '' : 'md:ml-12'}`}
                whileHover={{ x: index % 2 === 0 ? 8 : -8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start gap-6 md:gap-12">
                  <span className="text-[10px] text-muted-foreground/20 font-mono pt-1">
                    {pillar.num}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-base md:text-lg mb-2 font-light">
                      {pillar.title}
                    </h3>
                    <p className="max-w-lg text-sm text-muted-foreground transition-opacity duration-500">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            </RevealText>
          ))}
        </div>
      </div>
    </section>
  );
};
