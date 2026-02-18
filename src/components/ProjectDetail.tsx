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

    // Reset scroll position and index when the project changes
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollLeft = 0;
        }
        setCurrentIndex(0);
    }, [project.name]);

    // Handle navigation: Internal index switch first, then project switch
    const handleNext = () => {
        if (currentIndex < project.media.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            // At end, go to next project
            onNext();
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        } else {
            // At start, go to prev project
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
    }, [currentIndex, project.media.length, onClose, onNext, onPrev]);

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
            <div className={`absolute top-0 left-0 right-0 h-16 px-6 md:px-12 flex items-center justify-between z-[11001] pointer-events-none ${isMobile ? '' : 'pointer-events-auto'}`}>
                {/* Project name */}
                <span className="text-[10px] md:text-xs tracking-[0.2em] font-light text-foreground truncate max-w-[70%]">
                    {project.name}
                </span>

                <button
                    onClick={onClose}
                    className="pointer-events-auto w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors ml-auto"
                    aria-label="Close preview"
                >
                    <X className="w-5 h-5 md:w-6 md:h-6" />
                </button>
            </div>

            {/* Main Content - Framer Motion Transform Carousel */}
            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                <motion.div
                    className="flex h-full w-full"
                    initial={false}
                    animate={{ x: `-${currentIndex * 100}%` }}
                    transition={{
                        type: "spring",
                        damping: 30,
                        stiffness: 200,
                        mass: 1
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(_, info) => {
                        const threshold = 50;
                        if (info.offset.x < -threshold) handleNext();
                        else if (info.offset.x > threshold) handlePrev();
                    }}
                >
                    {project.media.map((media, index) => (
                        <div
                            key={media.pathname}
                            className="w-full h-full flex-shrink-0 flex items-center justify-center px-4 py-20 md:px-12 md:py-24"
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
                </motion.div>
            </div>

            {/* Footer Info */}
            <div className="absolute bottom-6 md:bottom-8 left-0 right-0 px-6 md:px-12 flex justify-between items-end pointer-events-none text-xs md:text-sm tracking-[0.2em] font-mono">
                {!isMobile && (
                    <div className="text-muted-foreground">
                        {project.category}
                    </div>
                )}

                {!isMobile && (
                    <div className="absolute left-1/2 -translate-x-1/2 text-center">
                        <span className="text-foreground">{project.name}</span>
                    </div>
                )}

                <div className={`${isMobile ? 'w-full text-center' : 'text-muted-foreground'}`}>
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
