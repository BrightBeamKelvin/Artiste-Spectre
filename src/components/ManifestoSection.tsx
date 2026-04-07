import { useEffect, useRef, useState } from 'react';
import { motion, useTransform, MotionValue, useMotionValueEvent } from 'framer-motion';
import { RevealText } from './RevealText';
import { TypewriterText } from './TypewriterText';
import { NetCanvas } from './NetCanvas';

const manifestoLines = [
  "We build culture with intention.",
  "Machina delivers high quality, digital first campaigns.",
  "We believe influence is built through strategy, precision, and execution.",
];

const RotatingManifesto = ({ trigger }: { trigger: boolean }) => {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    if (!trigger) return;

    const currentLine = manifestoLines[index];
    const typingSpeed = isDeleting ? 25 : 55;
    const pauseDuration = 3000;

    const timeout = setTimeout(() => {
      if (!isDeleting && !pause) {
        // Typing
        if (displayText.length < currentLine.length) {
          setDisplayText(currentLine.slice(0, displayText.length + 1));
        } else {
          setPause(true);
          setTimeout(() => {
            setPause(false);
            setIsDeleting(true);
          }, pauseDuration);
        }
      } else if (isDeleting && !pause) {
        // Deleting
        if (displayText.length > 0) {
          setDisplayText(currentLine.slice(0, displayText.length - 1));
        } else {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % manifestoLines.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, index, pause, trigger]);

  return (
    <div className="text-[7.5vw] font-light leading-tight tracking-tight px-2 text-center h-[12vh] flex items-center justify-center">
      <span className="relative">
        {displayText}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
          className="inline-block w-[2px] h-[1em] bg-white align-middle ml-1"
        />
      </span>
    </div>
  );
};

interface ManifestoSectionProps {
  scrollProgress: MotionValue<number>;
  onTargetMeasure?: (rect: DOMRect) => void;
}

export const ManifestoSection = ({ scrollProgress, onTargetMeasure }: ManifestoSectionProps) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [textActive, setTextActive] = useState(false);

  const [windowWidth, setWindowWidth] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 1440);
  const isLocked = windowWidth >= 765 && windowWidth <= 1311;
  const isMobileLayout = isLocked || windowWidth < 1024;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useMotionValueEvent(scrollProgress, "change", (latest: number) => {
    if (latest >= 0.18 && !isActive) {
      setIsActive(true);
      setTextActive(true);
    } else if (latest < 0.1 && isActive) {
      setIsActive(false);
    }
  });

  useEffect(() => {
    if (!targetRef.current || !onTargetMeasure) return;
    
    let lastRect: DOMRect | null = null;
    
    const measure = () => {
      const currentRect = targetRef.current!.getBoundingClientRect();
      if (!lastRect || 
          Math.abs(lastRect.width - currentRect.width) > 1 || 
          Math.abs(lastRect.height - currentRect.height) > 1 ||
          Math.abs(lastRect.top - currentRect.top) > 1 ||
          Math.abs(lastRect.left - currentRect.left) > 1) {
        lastRect = currentRect;
        onTargetMeasure(currentRect);
      }
    };
    
    measure();
    window.addEventListener('resize', measure);
    const observer = new ResizeObserver(measure);
    observer.observe(targetRef.current);

    const video = videoRef.current;
    if (video) {
      video.addEventListener('loadedmetadata', measure);
    }

    return () => {
      window.removeEventListener('resize', measure);
      observer.disconnect();
      if (video) {
        video.removeEventListener('loadedmetadata', measure);
      }
    };
  }, [onTargetMeasure]);

  const sectionOpacity = useTransform(scrollProgress, [0.7, 0.75], [1, 0]);
  const wipeClipPath = useTransform(scrollProgress, [0.22, 0.65], ["inset(0% 0 0 0)", "inset(100% 0 0 0)"]);
  const mediaOpacity = useTransform(scrollProgress, [0.10, 0.20, 0.48, 0.68], [0, 1, 1, 0]);
  const mediaX = useTransform(scrollProgress, [0.10, 0.20, 0.48, 0.68], [-24, 0, 0, 48]);

  return (
    <motion.section 
      id="manifesto" 
      style={{ opacity: sectionOpacity, clipPath: wipeClipPath }}
      className="flex flex-col justify-center h-[100svh] w-full overflow-hidden bg-background relative"
    >
      {isMobileLayout && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <NetCanvas className="w-full h-full opacity-40" />
        </div>
      )}
      <div className="w-full h-[100svh] flex flex-col px-6 md:px-12 pt-16 md:pt-32 pb-8 md:pb-32 mx-auto max-w-[90rem]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12 w-full h-full ml-auto">
          <div className="order-2 md:order-1 w-full md:w-auto w-[85%] min-[400px]:w-[95%] max-w-sm sm:max-w-md mx-auto md:max-w-xl md:mx-0 relative z-[60]">
            <div ref={targetRef} className="relative w-full max-w-xl overflow-hidden">
              <motion.div style={{ opacity: mediaOpacity, x: mediaX }}>
                <video
                  ref={videoRef}
                  src="https://cjortzrbfxpqnq4i.public.blob.vercel-storage.com/Album%20Covers/Alison%20Wonderland/alison%201.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-auto shadow-2xl"
                />
              </motion.div>
              <div className="absolute inset-0 bg-background/5 mix-blend-overlay pointer-events-none" />
            </div>
          </div>

          <div className="order-1 md:order-2 max-w-2xl ml-auto md:mr-24 w-full relative z-[60] flex-grow flex flex-col justify-center">
            <div className="md:hidden">
              <RotatingManifesto trigger={textActive} />
            </div>

            <div className="hidden md:flex flex-col space-y-16 py-8">
              <TypewriterText
                text={manifestoLines[0]}
                delay={400}
                speed={45}
                trigger={textActive}
                className="text-4xl lg:text-5xl font-light tracking-tight leading-tight"
                wrap={true}
              />
              <div className="flex flex-col space-y-8">
                <RevealText delay={2.2} trigger={textActive} className="text-2xl lg:text-3xl font-light leading-relaxed text-muted-foreground/80">
                  {manifestoLines[1]}
                </RevealText>
                <RevealText delay={2.6} trigger={textActive} className="text-2xl lg:text-3xl font-light leading-relaxed text-muted-foreground/80">
                  {manifestoLines[2]}
                </RevealText>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
