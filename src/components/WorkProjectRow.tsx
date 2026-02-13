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
    <div>
      {/* Desktop: horizontal scroll row */}
      <div className="hidden md:block">
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {project.media.map((item, i) => (
            <WorkMediaItem key={item.pathname} item={item} index={i} />
          ))}
        </div>
      </div>

      {/* Mobile: stacked grid */}
      <div className="md:hidden grid grid-cols-2 gap-2">
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
    </div>
  );
};
