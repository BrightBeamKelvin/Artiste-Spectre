import { HeroSection } from '@/components/HeroSection';
import { ManifestoSection } from '@/components/ManifestoSection';
import { HowWeBuildSection } from '@/components/HowWeBuildSection';
import { FooterSection } from '@/components/FooterSection';
import { NetCanvas } from '@/components/NetCanvas';
import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useMotionValue, animate, useMotionValueEvent, useTransform } from 'framer-motion';

const Index = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Event-driven Milestone Management
  const [direction, setDirection] = useState<'none' | 'forward' | 'reverse'>('none');
  const timelineProgress = useMotionValue(0);
  const controlsRef = useRef<any>(null);
  const lastTargetRef = useRef<number>(0);
  const isAnimatingRef = useRef(false);
  const lastEventTime = useRef(0);
  const directionRef = useRef<'none' | 'forward' | 'reverse'>('none');
  const lastDeltaYRef = useRef(0);

  const milestones = [0, 0.2, 0.7];

  const handleScrollIntent = (deltaY: number) => {
    const now = Date.now();
    if (Math.abs(deltaY) < 15) return; // Slightly higher threshold for decisiveness

    const intentDirection = deltaY > 0 ? 'forward' : 'reverse';
    const timeSinceLastEvent = now - lastEventTime.current;

    // Strict cooldown to absorb inertia, but ONLY if continuing in the same direction.
    // We use a ref for direction because state updates are asynchronous and too slow
    // for high-frequency wheel events.
    // We also check for a "velocity spike" (deltaY jump) which signals a new user flick
    // versus decaying inertia from a previous one.
    const isVelocitySpike = Math.abs(deltaY) > Math.abs(lastDeltaYRef.current) * 1.5;
    
    if (directionRef.current === intentDirection && !isVelocitySpike) {
      if (isAnimatingRef.current || timeSinceLastEvent < 300) {
        lastEventTime.current = now; // Continuous input/inertia refreshes cooldown
        lastDeltaYRef.current = deltaY;
        return;
      }
    }

    lastEventTime.current = now;
    lastDeltaYRef.current = deltaY;

    const currentProgress = timelineProgress.get();
    let nextTarget = -1;

    if (intentDirection === 'forward') {
      nextTarget = milestones.find(m => m > currentProgress + 0.01) ?? -1;
      if (nextTarget !== -1) {
        setDirection('forward');
        directionRef.current = 'forward';
      }
    } else {
      nextTarget = [...milestones].reverse().find(m => m < currentProgress - 0.01) ?? -1;
      if (nextTarget !== -1) {
        setDirection('reverse');
        directionRef.current = 'reverse';
      }
    }

    if (nextTarget !== -1) {
      lastTargetRef.current = nextTarget;
      lastEventTime.current = now;
      isAnimatingRef.current = true;
      
      controlsRef.current?.stop();
      
      const distance = Math.abs(nextTarget - currentProgress);
      const baseDuration = nextTarget === 0.7 ? 1.0 : 0.8;
      // Proportional duration scaling based on distance.
      // Expected typical distance step is roughly 0.2 to 0.5.
      const duration = Math.max(0.35, baseDuration * Math.min(1, distance / 0.2));

      controlsRef.current = animate(timelineProgress, nextTarget, {
        duration,
        ease: [0.22, 1, 0.36, 1],
        onComplete: () => {
          // Add a small extra delay before allowing the next intent to absorb leftover inertia
          setTimeout(() => {
            isAnimatingRef.current = false;
            // We DON'T reset directionRef here because the inertia might still be firing
            // in the same direction, and we want to keep blocking it until it stops.
          }, 150); // Tighter safety buffer
        }
      });
    }
  };

  // Add event listeners for wheel and touch
  useEffect(() => {
    // Aggressive overrides to prevent iOS Safari rubber banding and URL bar shifting
    const originalOverflow = document.documentElement.style.overflow;
    const originalOverscroll = document.documentElement.style.overscrollBehavior;
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.overscrollBehavior = 'none';
    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';

    let touchStartY = 0;

    const onWheel = (e: WheelEvent) => {
      if (e.cancelable) e.preventDefault(); // Unconditionally block native scroll
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) { // Prioritize vertical
        handleScrollIntent(e.deltaY);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY; // Swiping up is positive delta (scrolling down)
      handleScrollIntent(deltaY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault(); // Unconditionally block native swipe scrolling
    }

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    
    return () => {
      document.documentElement.style.overflow = originalOverflow;
      document.documentElement.style.overscrollBehavior = originalOverscroll;
      document.body.style.overflow = originalOverflow;
      document.body.style.overscrollBehavior = originalOverscroll;
      
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <div className="bg-background text-foreground relative h-[100svh] overflow-hidden">
      {/* The REAL page content. It sits natively at scrollY=0.
          We use a flex column to perfectly fit the content and footer into 100svh. */}
      <div className="w-full h-full relative z-10 flex flex-col">
        <div className="flex-1 overflow-hidden">
          <HowWeBuildSection />
        </div>
        <div className="hidden md:block">
          <FooterSection />
        </div>
      </div>

      {/* Fixed Transition Overlay for Hero and Manifesto */}
      {/* We use pointerEvents to pass interactivity to the real page once timeline reaches 0.7 */}
      <motion.div 
        className="fixed top-0 left-0 w-full h-[100svh] overflow-hidden z-20"
        style={{ 
          pointerEvents: useTransform(timelineProgress, v => v < 0.65 ? "auto" : "none")
        }}
      >
        {/* Manifesto layer: WIPES OFF (top-to-bottom) to reveal HowWeBuild underneath */}
        <div className="absolute inset-0 z-10">
          <ManifestoSection scrollProgress={timelineProgress} onTargetMeasure={setTargetRect} />
        </div>

        {/* Hero layer */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="h-full w-full">
            <HeroSection scrollProgress={timelineProgress} targetRect={targetRect} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
