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
  trigger?: boolean;
  wrap?: boolean;
}

export const TypewriterText = ({
  text,
  delay = 0,
  speed = 40,
  className = '',
  onComplete,
  highlightWords = [],
  highlightClassName = 'selection-highlight',
  trigger = true,
  wrap = false
}: TypewriterTextProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const started = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!trigger || started.current) return;
    started.current = true;

    const timeout = setTimeout(() => {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
          setIsComplete(true);
          onCompleteRef.current?.();
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [trigger, text, speed, delay]);

  const cursor = !isComplete && (
    <span style={{ position: 'relative', display: 'inline-block', width: 0, height: 0 }}>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
        className="text-muted-foreground"
        style={{ position: 'absolute', left: '0.1em', top: '0', transform: 'translateY(-88%)', lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}
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
      const shouldShowCursorHere = trigger && (isCurrentlyTypingInThisPart || (isLastPart && displayedText.length >= text.length && !isComplete));

      currentPos += partLength;

      const isHighlighted = highlightWords.some(word => word.toLowerCase() === part.toLowerCase());

      const untypedSegment = part.slice(typedInPart);

      return (
        <span key={i} className="inline">
          <span className={isHighlighted && typedInPart > 0 ? highlightClassName : ''}>
            {typedSegment}
          </span>
          {shouldShowCursorHere && cursor}
        </span>
      );
    });
  };

  const alignmentClass = className.includes('text-right') ? 'text-right' : className.includes('text-center') ? 'text-center' : 'text-left';

  return (
    <span className={`relative block w-full ${className} ${wrap ? 'whitespace-pre-wrap' : ''} ${!wrap && !className.includes('whitespace-') ? 'whitespace-nowrap' : ''}`}>
      <span className={`grid shrink-0 ${alignmentClass}`}>
        {/* Ghost text to reserve space and anticipate layout */}
        <span className="invisible pointer-events-none select-none [grid-area:1/1/2/2]" aria-hidden="true">
          {text}
        </span>
        
        {/* Actual typewriter content */}
        <span className="[grid-area:1/1/2/2]">
          {renderText()}
        </span>
      </span>
    </span>
  );
};
