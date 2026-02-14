import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DrawingLine } from '@/components/DrawingLine';
import { useWorkData } from '@/hooks/useWorkData';
import { useIsMobile } from '@/hooks/use-mobile';

type Filter = 'all' | 'brand' | 'albums';

const Work = () => {
  const { data, isLoading, error } = useWorkData();
  const [filter, setFilter] = useState<Filter>('all');
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [activePreview, setActivePreview] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);

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

  // Set first project as default active on mobile
  useEffect(() => {
    if (isMobile && projects.length > 0 && !activePreview) {
      setActivePreview(projects[0].name);
    }
  }, [isMobile, projects, activePreview]);

  // Mobile: IntersectionObserver to track which project name is in center of screen
  useEffect(() => {
    if (!isMobile || projects.length === 0) return;

    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the most intersecting entry
        let bestEntry: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio) {
              bestEntry = entry;
            }
          }
        }
        if (bestEntry) {
          const name = bestEntry.target.getAttribute('data-project');
          if (name) setActivePreview(name);
        }
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: [0, 0.5, 1] }
    );

    // Observe all current items
    itemRefs.current.forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [isMobile, projects, filter]);

  const setItemRef = useCallback((name: string) => (el: HTMLDivElement | null) => {
    if (el) {
      itemRefs.current.set(name, el);
    } else {
      itemRefs.current.delete(name);
    }
  }, []);

  // Get the first media item for a given project name
  const getPreviewItem = (projectName: string | null) => {
    if (!projectName) return null;
    const project = projects.find((p) => p.name === projectName);
    return project?.media[0] ?? null;
  };

  const currentPreview = getPreviewItem(isMobile ? activePreview : hoveredProject);

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
              onClick={() => { setFilter(f.key); setHoveredProject(null); setActivePreview(null); }}
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

      {/* DESKTOP LAYOUT: names left, preview right */}
      {!isMobile && (
        <div className="px-6 md:px-12 flex gap-12">
          {/* Left: project list */}
          <div className="w-1/2">
            <AnimatePresence mode="wait">
              <motion.div
                key={filter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {projects.map((project, index) => (
                  <motion.div
                    key={project.name}
                    className="border-b border-border/15"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <button
                      className="w-full py-4 md:py-5 text-left group"
                      onMouseEnter={() => setHoveredProject(project.name)}
                      onMouseLeave={() => setHoveredProject(null)}
                    >
                      <span
                        className={`text-sm md:text-lg tracking-[0.1em] font-light transition-colors duration-300 ${
                          hoveredProject === project.name
                            ? 'text-foreground'
                            : 'text-muted-foreground/70 group-hover:text-foreground'
                        }`}
                      >
                        {project.name}
                      </span>
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: sticky preview */}
          <div className="w-1/2 relative">
            <div className="sticky top-24">
              <AnimatePresence mode="wait">
                {currentPreview && (
                  <motion.div
                    key={currentPreview.pathname}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="aspect-[4/5] overflow-hidden"
                  >
                    {currentPreview.type === 'video' ? (
                      <video
                        src={currentPreview.url}
                        muted
                        loop
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={currentPreview.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE LAYOUT: list with scaled preview at bottom */}
      {isMobile && (
        <div className="relative pb-[45vh]">
          {/* Project list */}
          <div className="px-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={filter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {projects.map((project, index) => (
                  <motion.div
                    key={project.name}
                    ref={setItemRef(project.name)}
                    data-project={project.name}
                    className="border-b border-border/15"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <div className="py-4 text-left">
                      <span className={`text-sm tracking-[0.1em] font-light transition-colors duration-300 ${
                        activePreview === project.name
                          ? 'text-foreground'
                          : 'text-muted-foreground/70'
                      }`}>
                        {project.name}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Fixed bottom preview — scaled/contained image, not full bleed */}
          <div className="fixed bottom-0 left-0 right-0 h-[40vh] flex items-center justify-center pointer-events-none z-10">
            {/* Top gradient fade */}
            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background to-transparent z-20" />
            
            <AnimatePresence mode="wait">
              {currentPreview && (
                <motion.div
                  key={currentPreview.pathname}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="w-[60%] max-h-[36vh] overflow-hidden"
                >
                  {currentPreview.type === 'video' ? (
                    <video
                      src={currentPreview.url}
                      muted
                      loop
                      autoPlay
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <img
                      src={currentPreview.url}
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && projects.length === 0 && (
        <div className="px-6 md:px-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/30">
            No work to display yet.
          </p>
        </div>
      )}

      {projects.length > 0 && !isMobile && (
        <div className="mt-16 px-6 md:px-12">
          <DrawingLine className="w-64" delay={0.5} />
        </div>
      )}
    </main>
  );
};

export default Work;
