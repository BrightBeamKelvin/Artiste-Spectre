import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { MediaItem } from '@/hooks/useWorkData';

interface WorkMediaItemProps {
  item: MediaItem;
  index: number;
}

export const WorkMediaItem = ({ item, index }: WorkMediaItemProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (item.type === 'video' && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (item.type === 'video' && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <motion.div
      className="flex-shrink-0 h-[280px] md:h-[400px] relative overflow-hidden cursor-pointer group"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {item.type === 'video' ? (
        <video
          ref={videoRef}
          src={item.url}
          muted
          loop
          playsInline
          preload="metadata"
          className="h-full w-auto max-w-none object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      ) : (
        <img
          src={item.url}
          alt=""
          loading="lazy"
          className="h-full w-auto max-w-none object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      )}

      {/* Subtle overlay on hover */}
      <motion.div
        className="absolute inset-0 bg-background/10 pointer-events-none"
        animate={{ opacity: isHovered ? 0 : 0.15 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};
