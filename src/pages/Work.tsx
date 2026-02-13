import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DrawingLine } from '@/components/DrawingLine';
import { WorkProjectRow } from '@/components/WorkProjectRow';
import { useWorkData } from '@/hooks/useWorkData';

type Filter = 'all' | 'brand' | 'albums';

const Work = () => {
  const { data, isLoading, error } = useWorkData();
  const [filter, setFilter] = useState<Filter>('all');
  const [openProject, setOpenProject] = useState<string | null>(null);

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'brand', label: 'Brand Work' },
    { key: 'albums', label: 'Album Covers' },
  ];

  const projects = (() => {
    if (!data) return [];
    if (filter === 'brand') return data.brandWork;
    if (filter === 'albums') return data.albumCovers;
    return [...data.brandWork, ...data.albumCovers];
  })();

  return (
    <main className="bg-background text-foreground min-h-screen pt-24 pb-16">
      {/* Header */}
      <div className="px-6 md:px-12 mb-12 md:mb-20">
        <DrawingLine className="w-32 mb-6" delay={0.3} />

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-3xl md:text-5xl font-light tracking-tight mb-8"
        >
          Work
        </motion.h1>

        {/* Filter tabs */}
        <motion.div
          className="flex gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => { setFilter(f.key); setOpenProject(null); }}
              className={`text-[10px] md:text-xs uppercase tracking-[0.2em] pb-1 border-b transition-all duration-300 ${
                filter === f.key
                  ? 'text-foreground border-foreground'
                  : 'text-muted-foreground/50 border-transparent hover:text-muted-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="px-6 md:px-12">
          <motion.p
            className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading work...
          </motion.p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="px-6 md:px-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-destructive/60">
            Failed to load work.
          </p>
        </div>
      )}

      {/* Project index list */}
      <div className="px-6 md:px-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {projects.map((project, index) => {
              const isOpen = openProject === project.name;
              return (
                <div key={project.name} className="border-b border-border/15">
                  {/* Project name row */}
                  <motion.button
                    className="w-full flex items-baseline justify-between py-4 md:py-5 group text-left"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    onClick={() => setOpenProject(isOpen ? null : project.name)}
                  >
                    <span
                      className={`text-sm md:text-lg tracking-[0.1em] font-light transition-colors duration-300 ${
                        isOpen ? 'text-foreground' : 'text-muted-foreground/70 group-hover:text-foreground'
                      }`}
                    >
                      {project.name}
                    </span>
                    <div className="flex items-baseline gap-3">
                      <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/30">
                        {project.category}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground/25">
                        {project.media.length}
                      </span>
                    </div>
                  </motion.button>

                  {/* Expandable media */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pb-6">
                          <WorkProjectRow project={project} index={0} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {!isLoading && !error && projects.length === 0 && (
        <div className="px-6 md:px-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/30">
            No work to display yet.
          </p>
        </div>
      )}

      {projects.length > 0 && (
        <div className="mt-16 px-6 md:px-12">
          <DrawingLine className="w-64" delay={0.5} />
        </div>
      )}
    </main>
  );
};

export default Work;
