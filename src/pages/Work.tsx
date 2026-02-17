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
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const anchorY = useRef<number | null>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const touchStartYRef = useRef(0);
  const touchDeltaRef = useRef(0);

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
    if (!isMobile) {
      // Desktop: capture anchor Y for scroll-based detection
      requestAnimationFrame(() => {
        if (anchorY.current === null) {
          const firstEl = itemRefs.current.get(projects[0].name);
          if (firstEl) {
            anchorY.current = firstEl.getBoundingClientRect().top;
          }
        }
        if (!activePreview) setActivePreview(projects[0].name);
      });
    } else {
      // Mobile: set preview from active index
      setMobileActiveIndex(0);
      setActivePreview(projects[0].name);
    }
  }, [data, filter, isMobile]);

  // Mobile: intercept touch/wheel events for virtual index-based scrolling
  useEffect(() => {
    if (!isMobile || projects.length === 0) return;
    const container = mobileContainerRef.current;
    if (!container) return;

    const SWIPE_THRESHOLD = 35; // pixels of touch movement to advance one item

    const advanceIndex = (direction: number) => {
      setMobileActiveIndex(prev => {
        const next = Math.max(0, Math.min(projects.length - 1, prev + direction));
        return next;
      });
    };

    // Touch handling
    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
      touchDeltaRef.current = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const currentY = e.touches[0].clientY;
      const delta = touchStartYRef.current - currentY;
      touchStartYRef.current = currentY;
      touchDeltaRef.current += delta;

      while (Math.abs(touchDeltaRef.current) >= SWIPE_THRESHOLD) {
        const dir = Math.sign(touchDeltaRef.current);
        touchDeltaRef.current -= dir * SWIPE_THRESHOLD;
        advanceIndex(dir);
      }
    };

    // Wheel handling (for desktop mobile-emulation / trackpad)
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      touchDeltaRef.current += e.deltaY;

      while (Math.abs(touchDeltaRef.current) >= SWIPE_THRESHOLD) {
        const dir = Math.sign(touchDeltaRef.current);
        touchDeltaRef.current -= dir * SWIPE_THRESHOLD;
        advanceIndex(dir);
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('wheel', handleWheel);
    };
  }, [isMobile, projects.length]);

  // Mobile: sync active index → preview + programmatic scroll position
  useEffect(() => {
    if (!isMobile || projects.length === 0) return;
    const listEl = listContainerRef.current;
    if (!listEl) return;

    // Update the preview
    setActivePreview(projects[mobileActiveIndex]?.name ?? null);

    // Calculate scroll position for three-phase behavior
    const items = listEl.querySelectorAll('[data-project]') as NodeListOf<HTMLElement>;
    if (items.length === 0) return;

    const itemHeight = items[0].offsetHeight;
    const containerHeight = listEl.clientHeight;
    const visibleCount = Math.floor(containerHeight / itemHeight);
    const midpoint = Math.floor(visibleCount / 2);
    const maxScroll = listEl.scrollHeight - containerHeight;

    // Phase 1: index < midpoint → scrollTop = 0 (highlight moves, list stays)
    // Phase 2: midpoint <= index <= (total - visible + midpoint) → scroll to center
    // Phase 3: index near end → scrollTop = max (highlight moves, list stays)
    let targetScroll: number;
    if (mobileActiveIndex <= midpoint) {
      targetScroll = 0;
    } else {
      targetScroll = (mobileActiveIndex - midpoint) * itemHeight;
    }
    targetScroll = Math.max(0, Math.min(maxScroll, targetScroll));

    listEl.scrollTop = targetScroll;
  }, [mobileActiveIndex, isMobile, projects]);

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

      {/* DESKTOP LAYOUT: names left, preview right */}
      {!isMobile && (
        <div className="px-6 md:px-12 flex gap-12">
          {/* Left: Header + project list */}
          <div className="w-1/2 pt-8">
            <div className="mb-12 md:mb-20">
              <div className="bg-border h-px w-32 mb-6" />
              <h1 className="text-3xl md:text-5xl font-light tracking-tight mb-8">
                Work
              </h1>

              {/* Filter tabs */}
              <div className="flex gap-6">
                {filters.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => { setFilter(f.key); setHoveredProject(null); setActivePreview(null); }}
                    className={`text-[10px] md:text-xs uppercase tracking-[0.2em] pb-1 border-b transition-all duration-300 ${filter === f.key
                      ? 'text-foreground border-foreground'
                      : 'text-muted-foreground/50 border-transparent hover:text-muted-foreground'
                      }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div key={filter}>
                {projects.map((project, index) => (
                  <div
                    key={project.name}
                    className=""
                  >
                    <button
                      className="w-full py-1 md:py-1.5 text-left group"
                      onMouseEnter={() => setHoveredProject(project.name)}
                      onMouseLeave={() => setHoveredProject(null)}
                      onClick={() => handleProjectClick(project)}
                    >
                      <span
                        className={`text-sm md:text-lg tracking-[0.1em] font-light ${hoveredProject === project.name
                          ? 'text-foreground'
                          : 'text-muted-foreground/70 group-hover:text-foreground'
                          }`}
                      >
                        {project.name}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: spacer for layout */}
          <div className="w-1/2" />

          {/* Right: fixed preview */}
          <div className="fixed top-16 right-0 h-[calc(100vh-4rem)] w-1/2 pr-12 pl-6 flex items-center justify-center z-[10000] pointer-events-none">
            {currentPreview && (
              <div
                className="w-full h-full flex items-center justify-center overflow-hidden"
              >
                {currentPreview.type === 'video' ? (
                  <video
                    key={currentPreview.pathname}
                    src={currentPreview.url}
                    muted
                    loop
                    autoPlay
                    playsInline
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

      {/* MOBILE LAYOUT: fixed viewport split — list scrolls internally */}
      {isMobile && (
        <div ref={mobileContainerRef} className="fixed inset-0 top-16 flex flex-col touch-none">
          {/* Header area */}
          <div className="px-6 pt-8 pb-4 flex-shrink-0">
            <div className="bg-border h-px w-32 mb-6" />
            <h1 className="text-3xl font-light tracking-tight mb-8">
              Work
            </h1>

            {/* Filter tabs */}
            <div className="flex gap-6">
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => { setFilter(f.key); setHoveredProject(null); setActivePreview(null); setMobileActiveIndex(0); }}
                  className={`text-[10px] uppercase tracking-[0.2em] pb-1 border-b transition-all duration-300 ${filter === f.key
                    ? 'text-foreground border-foreground'
                    : 'text-muted-foreground/50 border-transparent hover:text-muted-foreground'
                    }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Project list — overflow hidden, scroll controlled programmatically */}
          <div
            ref={listContainerRef}
            className="flex-1 overflow-hidden px-6 min-h-0"
          >
            {projects.map((project) => (
              <div
                key={project.name}
                ref={setItemRef(project.name)}
                data-project={project.name}
                className="min-h-0 flex items-center"
              >
                <div
                  className="py-1 text-left w-full"
                  onClick={() => handleProjectClick(project)}
                >
                  <span className={`text-sm tracking-[0.1em] font-light ${activePreview === project.name
                    ? 'text-foreground'
                    : 'text-muted-foreground/70'
                    }`}>
                    {project.name}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom preview */}
          <div className="flex-shrink-0 h-[40vh] flex items-center justify-center pointer-events-none">
            {currentPreview && (
              <div
                className="w-[60%] max-h-[36vh] overflow-hidden"
                onClick={() => {
                  const proj = projects.find(p => p.name === activePreview);
                  if (proj) handleProjectClick(proj);
                }}
              >
                {currentPreview.type === 'video' ? (
                  <video
                    key={currentPreview.pathname}
                    src={currentPreview.url}
                    muted
                    loop
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain pointer-events-auto"
                  />
                ) : (
                  <img
                    key={currentPreview.pathname}
                    src={currentPreview.url}
                    alt=""
                    className="w-full h-full object-contain pointer-events-auto"
                  />
                )}
              </div>
            )}
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
    </main>
  );
};

export default Work;
