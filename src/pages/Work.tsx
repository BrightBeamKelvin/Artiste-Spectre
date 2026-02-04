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
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <DrawingLine className="w-full mb-12" delay={0.3} />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-3xl md:text-5xl font-light tracking-tight mb-6"
        >
          Selected Work
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-sm text-muted-foreground max-w-xl mb-16"
        >
          A curated collection of campaigns, productions, and cultural interventions. Each project represents our commitment to designing influence, not chasing it.
        </motion.p>

        <DrawingLine className="w-24 mb-16" delay={0.7} />

        <div className="space-y-1">
          {projects.map((project, index) => (
            <RevealText key={index} delay={0.1 * index}>
              <motion.div
                className="group py-8 border-b border-border/30 cursor-pointer"
                whileHover={{ x: 8 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-baseline justify-between gap-4 mb-3">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground/50 group-hover:text-muted-foreground transition-colors">
                    {project.category}
                  </span>
                  <span className="text-muted-foreground/30 text-[10px]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-light tracking-tight group-hover:text-foreground transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {project.description}
                </p>
              </motion.div>
            </RevealText>
          ))}
        </div>

        <DrawingLine className="w-full mt-16" delay={0.5} />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-xs text-center mt-12 text-muted-foreground/30"
        >
          Additional case studies available upon request.
        </motion.p>
      </div>
    </main>
  );
};

export default Work;
