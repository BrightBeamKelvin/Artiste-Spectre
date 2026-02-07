import { motion } from 'framer-motion';
import { RevealText } from '@/components/RevealText';
import { DrawingLine } from '@/components/DrawingLine';

const projects = [
  {
    title: 'Campaign Films',
    description: 'Cinematic brand narratives designed for social-first distribution.',
    category: 'PRODUCTION',
  },
  {
    title: 'Creator Collaborations',
    description: 'Strategic partnerships between top-tier influencers and global brands.',
    category: 'MEDIATION',
  },
  {
    title: 'Experiential Activations',
    description: 'Physical-digital hybrid events that generate cultural moments.',
    category: 'ACTIVATION',
  },
  {
    title: 'Visual Identity Systems',
    description: 'Brand language development for the creator economy era.',
    category: 'CREATIVE',
  },
  {
    title: 'Social-Native Content',
    description: 'Premium UGC that outperforms traditional advertising.',
    category: 'PRODUCTION',
  },
];

const Work = () => {
  return (
    <main className="bg-background text-foreground min-h-screen pt-24 pb-16">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
        {/* Header - right aligned */}
        <div className="flex justify-end mb-20">
          <div className="max-w-xl">
            <DrawingLine className="w-48 mb-8" delay={0.3} />

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl md:text-6xl font-light tracking-tight mb-6"
            >
              Selected Work
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-sm text-muted-foreground"
            >
              A curated collection of campaigns, productions, and cultural interventions. Each project represents our commitment to designing influence, not chasing it.
            </motion.p>

            <DrawingLine className="w-24 mt-8" delay={0.7} />
          </div>
        </div>

        {/* Projects - alternating layout */}
        <div className="space-y-0">
          {projects.map((project, index) => (
            <RevealText key={index} delay={0.1 * index}>
              <motion.div
                className={`group py-12 border-b border-border/20 cursor-pointer ${index % 2 === 0 ? 'md:pr-32' : 'md:pl-32'
                  }`}
                whileHover={{ x: index % 2 === 0 ? 12 : -12 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className={`max-w-3xl ${index % 2 === 1 ? 'ml-auto' : ''}`}>
                  <div className={`flex items-baseline gap-4 mb-4 ${index % 2 === 1 ? 'justify-end' : ''}`}>
                    <span className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground/40 group-hover:text-muted-foreground transition-colors">
                      {project.category}
                    </span>
                    <span className="text-muted-foreground/20 text-[10px] font-mono">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className={`text-2xl md:text-3xl font-light tracking-tight mb-3 group-hover:text-foreground transition-colors ${index % 2 === 1 ? 'text-right' : ''
                    }`}>
                    {project.title}
                  </h3>
                  <p className={`text-sm text-muted-foreground max-w-md opacity-60 group-hover:opacity-100 transition-opacity duration-300 ${index % 2 === 1 ? 'text-right ml-auto' : ''
                    }`}>
                    {project.description}
                  </p>
                </div>
              </motion.div>
            </RevealText>
          ))}
        </div>

        <div className="mt-20 flex justify-center">
          <div>
            <DrawingLine className="w-64 mb-8" delay={0.5} />
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/30"
            >
              Additional case studies available upon request.
            </motion.p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Work;
