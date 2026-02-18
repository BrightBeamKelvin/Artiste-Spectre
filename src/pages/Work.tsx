import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DrawingLine } from '@/components/DrawingLine';
import { ProjectDetail } from '@/components/ProjectDetail';
import { useWorkData, WorkProject } from '@/hooks/useWorkData';
import { useIsMobile } from '@/hooks/use-mobile';

type Filter = 'all' | 'brand' | 'albums';

const Work = () => {
  const { data, isLoading, error } = useWorkData();
  const [filter, setFilter] = useState<Filter>('all');
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [activePreview, setActivePreview] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<WorkProject | null>(null);
  const isMobile = useIsMobile();
  const [mobileView, setMobileView] = useState<'index' | 'grid'>('grid');
  const [desktopView, setDesktopView] = useState<'index' | 'grid'>('grid');
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const anchorY = useRef<number | null>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'brand', label: 'Brand Work' },
    { key: 'albums', label: 'Album Covers' },
  ];

  const projects = useMemo(() => {
    if (!data) return [];
    if (filter === 'brand') return data.brandWork;
    if (filter === 'albums') return data.albumCovers;
    return [...data.brandWork, ...data.albumCovers];
  }, [data, filter]);
  // Set initial active preview
  useEffect(() => {
    if (projects.length === 0) return;
    if (!activePreview) setActivePreview(projects[0].name);
    if (!isMobile) {
      requestAnimationFrame(() => {
        if (anchorY.current === null) {
          const firstEl = itemRefs.current.get(projects[0].name);
          if (firstEl) {
            anchorY.current = firstEl.getBoundingClientRect().top;
          }
        }
      });
    }
  }, [data, filter, isMobile]);

  // Mobile: detect which item is closest to viewport center on scroll
  useEffect(() => {
    if (!isMobile || projects.length === 0) return;

    const handleScroll = () => {
      // With preview at the top, we want to detect items in the lower portion
      const detectionY = window.innerHeight * 0.75;
      let closestName: string | null = null;
      let closestDist = Infinity;

      itemRefs.current.forEach((el, name) => {
        const rect = el.getBoundingClientRect();
        const itemCenter = rect.top + rect.height / 2;
        const dist = Math.abs(itemCenter - detectionY);
        if (dist < closestDist) {
          closestDist = dist;
          closestName = name;
        }
      });

      if (closestName) {
        setActivePreview(closestName);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run once on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, projects]);

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

  const handleProjectClick = (project: WorkProject) => {
    setSelectedProject(project);
  };

  const handleNextProject = () => {
    if (!selectedProject) return;
    const currentIndex = projects.findIndex(p => p.name === selectedProject.name);
    const nextIndex = (currentIndex + 1) % projects.length;
    setSelectedProject(projects[nextIndex]);
  };

  const handlePrevProject = () => {
    if (!selectedProject) return;
    const currentIndex = projects.findIndex(p => p.name === selectedProject.name);
    const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
    setSelectedProject(projects[prevIndex]);
  };

  // Preload logic: identify neighbors of the currently active/hovered preview
  const neighbors = useMemo(() => {
    const currentName = isMobile ? activePreview : hoveredProject;
    if (!currentName || projects.length === 0) return [];

    const currentIndex = projects.findIndex(p => p.name === currentName);
    if (currentIndex === -1) return [];

    const indices = [
      (currentIndex - 1 + projects.length) % projects.length,
      (currentIndex + 1) % projects.length
    ];

    return indices
      .map(i => projects[i])
      .filter(p => p.media[0]?.type === 'video');
  }, [isMobile, activePreview, hoveredProject, projects]);


  return (
    <main className="bg-background text-foreground min-h-screen pt-16 pb-16">
      {/* Loading */}
      {isLoading && (
        <div className="px-6 md:px-12 mb-8">
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
        <div className="px-6 md:px-12 mb-8">
          <p className="text-[10px] uppercase tracking-[0.3em] text-destructive/60">
            Failed to load work.
          </p>
        </div>
      )}

      {/* DESKTOP LAYOUT */}
      {!isMobile && (
        <>
          {/* Desktop toggle */}
          <div className="px-6 md:px-12 pt-8 flex justify-start">
            <button
              onClick={() => { setDesktopView(desktopView === 'index' ? 'grid' : 'index'); window.scrollTo(0, 0); }}
              className="text-xs uppercase tracking-[0.2em] text-foreground/80 hover:text-foreground transition-colors duration-300 pb-1 border-b border-transparent hover:border-foreground"
            >
              {desktopView === 'index' ? 'Grid' : 'Index'}
            </button>
          </div>

          {/* DESKTOP INDEX VIEW: names left, preview right */}
          {desktopView === 'index' && (
            <div className="px-6 md:px-12 flex gap-12 mt-12">
              <div className="w-1/2">
                <div>
                  <div key={filter}>
                    {projects.map((project, index) => {
                      const isActive = hoveredProject === project.name;
                      return (
                        <div
                          key={project.name}
                          className="relative"
                        >
                          <button
                            className="w-full py-1 md:py-1.5 text-left group flex items-center gap-0"
                            onMouseEnter={() => setHoveredProject(project.name)}
                            onMouseLeave={() => setHoveredProject(null)}
                            onClick={() => handleProjectClick(project)}
                          >
                            {/* Animated bracket left */}
                            <span className="inline-block w-4 text-foreground/60 font-light text-lg overflow-hidden">
                              <motion.span
                                className="inline-block"
                                initial={false}
                                animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -8 }}
                                transition={{ duration: 0.25, ease: 'easeOut' }}
                              >
                                [
                              </motion.span>
                            </span>

                            <span
                              className={`text-sm md:text-lg tracking-[0.1em] font-light transition-colors duration-200 ${isActive
                                ? 'text-foreground'
                                : 'text-muted-foreground/70 group-hover:text-foreground'
                                }`}
                            >
                              {project.name}
                            </span>

                            {/* Animated bracket right */}
                            <span className="inline-block w-4 text-foreground/60 font-light text-lg overflow-hidden ml-1">
                              <motion.span
                                className="inline-block"
                                initial={false}
                                animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : 8 }}
                                transition={{ duration: 0.25, ease: 'easeOut' }}
                              >
                                ]
                              </motion.span>
                            </span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="w-1/2" />

              <div className="fixed top-16 right-0 h-[calc(100vh-4rem)] w-1/2 pr-12 pl-6 flex items-center justify-center z-[10000] pointer-events-none">
                {currentPreview && (
                  <div className="w-full h-full flex items-center justify-center overflow-hidden">
                    {currentPreview.type === 'video' ? (
                      <video
                        src={currentPreview.url}
                        muted
                        loop
                        autoPlay
                        playsInline
                        preload="auto"
                        className="max-h-[90%] max-w-full object-contain"
                      />
                    ) : (
                      <img
                        key={currentPreview.pathname}
                        src={currentPreview.url}
                        alt=""
                        className="max-h-[90%] max-w-full object-contain"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* DESKTOP GRID VIEW: artsy masonry layout */}
          {desktopView === 'grid' && (
            <div className="px-6 md:px-12 mt-12 pb-24">
              <div className="columns-2 lg:columns-3 gap-4">
                {projects.map((project, index) => {
                  const firstMedia = project.media[0];
                  if (!firstMedia) return null;
                  // Alternate sizing for visual rhythm
                  const isFeature = index % 5 === 0;
                  return (
                    <motion.div
                      key={project.name}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.04 }}
                      className={`mb-4 break-inside-avoid cursor-pointer group relative overflow-hidden ${isFeature ? 'lg:col-span-2' : ''
                        }`}
                      onClick={() => handleProjectClick(project)}
                    >
                      {/* Media */}
                      <div className="relative overflow-hidden">
                        {firstMedia.type === 'video' ? (
                          <video
                            src={firstMedia.url}
                            muted
                            loop
                            autoPlay
                            playsInline
                            className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                        ) : (
                          <img
                            src={firstMedia.url}
                            alt={project.name}
                            className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            loading="lazy"
                          />
                        )}
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-end">
                          <div className="p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                            <p className="text-white text-xs tracking-[0.15em] uppercase font-light">
                              {project.name}
                            </p>
                            <p className="text-white/50 text-[10px] tracking-[0.2em] uppercase mt-1">
                              {project.category}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* MOBILE LAYOUT */}
      {isMobile && (
        <>

          {/* INDEX VIEW: fixed preview + scrollable list */}
          {mobileView === 'index' && (
            <>
              {/* Fixed top preview area — below toggle bar */}
              <div
                className="fixed top-[calc(4rem+44px)] left-0 right-0 z-20 flex items-center justify-center pointer-events-none"
                style={{ height: '48vh' }}
              >
                {currentPreview && (
                  <div
                    className="w-full px-4 max-h-full overflow-hidden flex items-center justify-center pointer-events-auto"
                    onClick={() => {
                      const proj = projects.find(p => p.name === activePreview);
                      if (proj) handleProjectClick(proj);
                    }}
                  >
                    {currentPreview.type === 'video' ? (
                      <video
                        src={currentPreview.url}
                        muted
                        loop
                        autoPlay
                        playsInline
                        preload="auto"
                        className="max-w-full max-h-[48vh] object-contain"
                      />
                    ) : (
                      <img
                        key={currentPreview.pathname}
                        src={currentPreview.url}
                        alt=""
                        className="max-w-full max-h-[48vh] object-contain"
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Scrollable list */}
              <div className="relative z-10 px-6">
                {/* Top spacer to push content below the fixed preview */}
                <div style={{ height: '62vh' }} />

                {projects.map((project) => {
                  const isActive = activePreview === project.name;
                  return (
                    <div
                      key={project.name}
                      ref={setItemRef(project.name)}
                      data-project={project.name}
                      className="flex items-center"
                    >
                      <div
                        className="py-1.5 text-left w-full flex items-center gap-0"
                        onClick={() => handleProjectClick(project)}
                      >
                        {/* Animated bracket left */}
                        <span className="inline-block w-3 text-foreground/60 font-light text-sm overflow-hidden">
                          <motion.span
                            className="inline-block"
                            initial={false}
                            animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -6 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                          >
                            [
                          </motion.span>
                        </span>

                        <span className={`text-sm tracking-[0.1em] font-light transition-colors duration-200 ${isActive
                          ? 'text-foreground'
                          : 'text-muted-foreground/30'
                          }`}>
                          {project.name}
                        </span>

                        {/* Animated bracket right */}
                        <span className="inline-block w-3 text-foreground/60 font-light text-sm overflow-hidden ml-0.5">
                          <motion.span
                            className="inline-block"
                            initial={false}
                            animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : 6 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                          >
                            ]
                          </motion.span>
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Bottom spacer for scrollability */}
                <div style={{ height: '40vh' }} />
              </div>
            </>
          )}

          {/* GRID VIEW: single-column image gallery */}
          {mobileView === 'grid' && (
            <div className="px-6 pt-24 pb-16">
              {projects.map((project) => {
                const firstMedia = project.media[0];
                if (!firstMedia) return null;
                return (
                  <div
                    key={project.name}
                    className="mb-24 cursor-pointer"
                    onClick={() => handleProjectClick(project)}
                  >
                    <div className="w-full overflow-hidden">
                      {firstMedia.type === 'video' ? (
                        <video
                          src={firstMedia.url}
                          muted
                          loop
                          autoPlay
                          playsInline
                          className="w-full object-contain"
                        />
                      ) : (
                        <img
                          src={firstMedia.url}
                          alt={project.name}
                          className="w-full object-contain"
                          loading="lazy"
                        />
                      )}
                    </div>
                    <p className="mt-3 text-xs tracking-[0.1em] font-light text-muted-foreground/60">
                      {project.name}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </>
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
          <div className="bg-border h-px w-64" />
        </div>
      )}

      {/* Project Detail Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetail
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            onNext={handleNextProject}
            onPrev={handlePrevProject}
          />
        )}
      </AnimatePresence>

      {/* Neighbor Preloader: invisible videos to force browser buffering */}
      <div className="hidden pointer-events-none" aria-hidden="true">
        {neighbors.map((project) => (
          <video
            key={`preload-${project.name}`}
            src={project.media[0].url}
            preload="auto"
            muted
          />
        ))}
      </div>
    </main>
  );
};

export default Work;
