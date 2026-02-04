import { motion } from 'framer-motion';
import { RevealText } from '@/components/RevealText';
import { DrawingLine } from '@/components/DrawingLine';
import { useState } from 'react';

const services = [
  {
    category: 'CREATOR REPRESENTATION',
    items: [
      'Strategic brand partnerships',
      'Campaign ideation & packaging',
      'Contract negotiation',
      'Brand safety & creative oversight',
    ],
  },
  {
    category: 'CREATIVE & PRODUCTION',
    items: [
      'Social-native UGC',
      'Campaign films',
      'Still photography',
      'Branded content series',
      'Launch assets',
    ],
  },
  {
    category: 'GROWTH SERVICES',
    items: [
      'Content calendars',
      'Platform-specific strategies',
      'Analytics & reporting',
      'Community engagement',
    ],
  },
  {
    category: 'EXPERIENTIAL',
    items: [
      'Pop-up retail experiences',
      'Brand activations',
      'Product launches',
      'Hybrid physical-digital events',
    ],
  },
];

const verticals = [
  'Makeup & Beauty',
  'Sportswear & Performance',
  'High Fashion & Luxury',
  'Motorsports',
  'E-Bike & Mobility',
];

const Expertise = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <main className="bg-background text-foreground min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <DrawingLine className="w-full mb-12" delay={0.3} />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-3xl md:text-5xl font-light tracking-tight mb-6"
        >
          Capabilities
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-sm text-muted-foreground max-w-xl mb-16"
        >
          Full-stack creative and production services. From strategy through execution—no fragmentation, no handoffs, no compromises.
        </motion.p>

        <DrawingLine className="w-24 mb-16" delay={0.7} />

        {/* Services accordion */}
        <div className="mb-20">
          {services.map((service, index) => (
            <RevealText key={index} delay={0.1 * index}>
              <motion.div
                className="border-b border-border/30 overflow-hidden"
                initial={false}
              >
                <button
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  className="w-full py-6 flex items-center justify-between group"
                >
                  <span className="text-sm uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
                    {service.category}
                  </span>
                  <motion.span
                    className="text-muted-foreground text-xl"
                    animate={{ rotate: expandedIndex === index ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    +
                  </motion.span>
                </button>

                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: expandedIndex === index ? 'auto' : 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pb-6 pl-4">
                    {service.items.map((item, itemIndex) => (
                      <motion.p
                        key={itemIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{
                          opacity: expandedIndex === index ? 1 : 0,
                          x: expandedIndex === index ? 0 : -10,
                        }}
                        transition={{ delay: itemIndex * 0.05, duration: 0.3 }}
                        className="text-sm py-2 text-muted-foreground"
                      >
                        {item}
                      </motion.p>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </RevealText>
          ))}
        </div>

        <DrawingLine className="w-full mb-16" delay={0.5} />

        <div className="flex flex-wrap gap-4 mb-16">
          {verticals.map((vertical, index) => (
            <RevealText key={index} delay={0.05 * index}>
              <motion.span
                className="px-4 py-2 border border-border/50 text-sm tracking-wide text-muted-foreground hover:text-foreground hover:border-foreground/50 transition-all duration-300 cursor-default"
                whileHover={{ x: 4 }}
              >
                {vertical}
              </motion.span>
            </RevealText>
          ))}
        </div>

        <DrawingLine className="w-48" delay={0.7} />
      </div>
    </main>
  );
};

export default Expertise;
