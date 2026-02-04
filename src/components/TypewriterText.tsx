import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface TypewriterTextProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  highlightWords?: string[];
  highlightClassName?: string;
}

export const TypewriterText = ({
  text,
  delay = 0,
  speed = 40,
  className = '',
  onComplete,
  highlightWords = [],
  highlightClassName = 'selection-highlight'
}: TypewriterTextProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const timeout = setTimeout(() => {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
          setIsComplete(true);
          onComplete?.();
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, []);

  const cursor = !isComplete && (
    <span style={{ display: 'inline-block', width: 0, verticalAlign: 'middle', overflow: 'visible' }}>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
        className="text-muted-foreground ml-1"
      >
        ▌
      </motion.span>
    </span>
  );

  const renderText = () => {
    const escapeRegExp = (string: string) => {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    const sortedWords = [...highlightWords].sort((a, b) => b.length - a.length);
    const pattern = highlightWords.length > 0
      ? new RegExp(`(${sortedWords.map(escapeRegExp).join('|')})`, 'gi')
      : null;

    const parts = pattern ? text.split(pattern) : [text];
    let currentPos = 0;

    return parts.map((part, i) => {
      const partLength = part.length;
      const typedInPart = Math.max(0, Math.min(partLength, displayedText.length - currentPos));

      const typedSegment = part.slice(0, typedInPart);

      const isCurrentlyTypingInThisPart = displayedText.length >= currentPos && displayedText.length < currentPos + partLength;
      const isLastPart = i === parts.length - 1;
      const shouldShowCursorHere = isCurrentlyTypingInThisPart || (isLastPart && displayedText.length >= text.length && !isComplete);

      currentPos += partLength;

      const isHighlighted = highlightWords.some(word => word.toLowerCase() === part.toLowerCase());

      return (
        <span key={i} className="relative inline">
          {/* Reservation layer: maintains layout space */}
          <span className="opacity-0 select-none" aria-hidden="true">
            {part}
          </span>

          {/* Visual layer: types text and shows highlight */}
          <span className="absolute left-0 top-0 whitespace-nowrap">
            <span className={isHighlighted && typedInPart > 0 ? highlightClassName : ''}>
              {typedSegment}
            </span>
            {shouldShowCursorHere && cursor}
          </span>
        </span>
      );
    });
  };

  return (
    <span className={className}>
      {renderText()}
    </span>
  );
};
