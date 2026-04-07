import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WorkProject } from '@/hooks/useWorkData';
import { useIsMobile } from '@/hooks/use-mobile';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';

interface ProjectDetailProps {
    project: WorkProject;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
}

export const ProjectDetail = ({ project, onClose, onNext, onPrev }: ProjectDetailProps) => {
    const isMobile = useIsMobile();
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Sync scroll position when project changes
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollLeft = 0;
        }
        setCurrentIndex(0);
    }, [project.name]);

    const handleNext = () => {
        if (!containerRef.current) return;
        const width = containerRef.current.clientWidth;
        const currentScroll = containerRef.current.scrollLeft;
        const maxScroll = containerRef.current.scrollWidth - width;

        if (currentScroll < maxScroll - 10) {
            containerRef.current.scrollTo({
                left: (Math.round(currentScroll / width) + 1) * width,
                behavior: 'smooth'
            });
        } else {
            onNext();
        }
    };

    const handlePrev = () => {
        if (!containerRef.current) return;
        const width = containerRef.current.clientWidth;
        const currentScroll = containerRef.current.scrollLeft;

        if (currentScroll > 10) {
            containerRef.current.scrollTo({
                left: (Math.round(currentScroll / width) - 1) * width,
                behavior: 'smooth'
            });
        } else {
            onPrev();
        }
    };

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, onNext, onPrev]);

    const handleScroll = () => {
        if (!containerRef.current) return;
        const scrollLeft = containerRef.current.scrollLeft;
        const width = containerRef.current.clientWidth;
        const newIndex = Math.round(scrollLeft / width);
        if (newIndex !== currentIndex) {
            setCurrentIndex(newIndex);
        }
    };

    // Background Scroll Lock
    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    return (
        <motion.div
            className="fixed inset-0 z-[11000] bg-background text-foreground flex flex-col overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Header / Controls */}
            <div className={`absolute top-0 left-0 right-0 px-6 md:px-12 pt-6 md:pt-8 flex items-start justify-between z-[11001] pointer-events-none ${isMobile ? 'bg-gradient-to-b from-black/60 to-transparent pb-12' : ''}`}>
                {/* Project Info Block */}
                <div className="flex flex-col gap-1.5 pointer-events-auto">
                    <span className="text-[12px] md:text-sm tracking-[0.2em] font-medium text-white uppercase">
                        {project.name}
                        {!isMobile && project.year && (
                            <span className="text-white/30 ml-2 font-mono text-[10px]">[{project.year}]</span>
                        )}
                    </span>
                    
                    {project.role && (
                        <p className="text-[10px] tracking-[0.15em] uppercase text-white/80 font-normal leading-tight">
                            {project.role}
                        </p>
                    )}
                    
                    {!isMobile && project.services.length > 0 && (
                        <div className="flex flex-col gap-0.5">
                            {project.services.map((service, idx) => (
                                <p key={idx} className="text-[9px] tracking-[0.12em] uppercase text-white/40 font-normal leading-tight">
                                    {service}
                                </p>
                            ))}
                        </div>
                    )}
                    
                    {isMobile && project.services.length > 0 && (
                        <div className="flex flex-col gap-0.5">
                            {project.services.map((service, idx) => (
                                <p key={idx} className="text-[9px] tracking-[0.12em] uppercase text-white/50 font-normal leading-tight">
                                    {service}
                                </p>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    onClick={onClose}
                    className="pointer-events-auto w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
                    aria-label="Close preview"
                >
                    <X className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </button>
            </div>

            {/* Main Content - Horizontal Scroll Snap */}
            <div
                ref={containerRef}
                className="flex-1 flex overflow-x-auto snap-x snap-mandatory scrollbar-hide items-center"
                onScroll={handleScroll}
            >
                {project.media.map((media, index) => (
                    <div
                        key={media.pathname}
                        className="w-full h-full flex-shrink-0 snap-center flex items-center justify-center px-4 py-20 md:px-12 md:py-24"
                    >
                        <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
                            {media.type === 'video' ? (
                                <video
                                    src={media.url}
                                    muted
                                    loop
                                    autoPlay={index === currentIndex}
                                    playsInline
                                    className="max-w-full max-h-full object-contain shadow-2xl"
                                />
                            ) : (
                                <img
                                    src={media.url}
                                    alt={`${project.name} - ${index + 1}`}
                                    className="max-w-full max-h-full object-contain shadow-2xl"
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Info */}
            <div className="absolute bottom-6 md:bottom-8 left-0 right-0 px-6 md:px-12 flex justify-end items-end pointer-events-none text-xs md:text-sm tracking-[0.2em] font-mono">
                <div className={`${isMobile ? 'w-full text-center' : 'text-white/30'}`}>
                    {currentIndex + 1} / {project.media.length}
                </div>
            </div>

            {/* Click zones for Previous/Next Project (Desktop) */}
            {!isMobile && (
                <>
                    <div className="absolute top-1/2 left-4 -translate-y-1/2 pointer-events-auto">
                        <button onClick={handlePrev} className="p-4 hover:opacity-50 transition-opacity">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-auto">
                        <button onClick={handleNext} className="p-4 hover:opacity-50 transition-opacity">
                            <ArrowRight className="w-6 h-6" />
                        </button>
                    </div>
                </>
            )}

        </motion.div>
    );
};
