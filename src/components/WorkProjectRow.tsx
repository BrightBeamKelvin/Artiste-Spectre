import { useRef } from 'react';
import { motion } from 'framer-motion';
import { WorkMediaItem } from '@/components/WorkMediaItem';
import type { WorkProject } from '@/hooks/useWorkData';

interface WorkProjectRowProps {
  project: WorkProject;
  index: number;
}

export const WorkProjectRow = ({ project, index }: WorkProjectRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <motion.section
      className="mb-16 md:mb-24"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      {/* Project header — Alastair Strong inspired */}
      <div className="flex items-baseline gap-4 mb-6 px-6 md:px-12">
        <h3 className="text-xs md:text-sm uppercase tracking-[0.2em] font-light text-foreground">
          {project.name}
        </h3>
        <span className="text-[10px] tracking-[0.15em] text-muted-foreground/40 font-mono">
          [ {project.media.length} ]
        </span>
      </div>

      {/* Desktop: horizontal scroll row */}
      <div className="hidden md:block">
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto px-6 md:px-12 pb-4 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {project.media.map((item, i) => (
            <WorkMediaItem key={item.pathname} item={item} index={i} />
          ))}
        </div>
      </div>

      {/* Mobile: stacked grid */}
      <div className="md:hidden grid grid-cols-2 gap-2 px-4">
        {project.media.map((item, i) => (
          <div key={item.pathname} className="aspect-[3/4] overflow-hidden">
            {item.type === 'video' ? (
              <video
                src={item.url}
                muted
                loop
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={item.url}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        ))}
      </div>
    </motion.section>
  );
};
