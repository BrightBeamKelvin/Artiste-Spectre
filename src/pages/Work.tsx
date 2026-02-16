import { useState, useRef, useEffect, useCallback } from 'react';
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
  // Capture the viewport Y position of the first item ONCE (fixed screen position)
  useEffect(() => {
    if (projects.length === 0) return;
    requestAnimationFrame(() => {
      if (anchorY.current === null) {
        const firstEl = itemRefs.current.get(projects[0].name);
        if (firstEl) {
          anchorY.current = firstEl.getBoundingClientRect().top;
        }
      }
      if (!activePreview) setActivePreview(projects[0].name);
    });
  }, [projects, filter]);

  // Scroll handler: whichever item center is closest to the fixed anchor viewport Y
  useEffect(() => {
    if (!isMobile || projects.length === 0) return;

    const handleScroll = () => {
      if (anchorY.current === null) return;
      const fixedY = anchorY.current; // This is a constant viewport Y

      let closestName: string | null = null;
      let closestDist = Infinity;

      itemRefs.current.forEach((el, name) => {
        const rect = el.getBoundingClientRect();
        const itemCenter = rect.top + rect.height / 2;
        const dist = Math.abs(itemCenter - fixedY);
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

      {/* MOBILE LAYOUT: list with scaled preview at bottom */}
      {isMobile && (
        <div className="relative" style={{ paddingBottom: '60vh' }}>
          <div className="px-6 md:px-12 mb-12 md:mb-20">
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
          {/* Project list */}
          <div className="px-6">
            {projects.map((project, index) => (
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

          {/* Fixed bottom preview — scaled/contained image, not full bleed */}
          <div className="fixed bottom-0 left-0 right-0 h-[40vh] flex items-center justify-center pointer-events-none z-[10000]">


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
