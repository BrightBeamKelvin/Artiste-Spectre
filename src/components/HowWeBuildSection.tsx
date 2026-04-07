import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { TypewriterText } from './TypewriterText';
import { useNavigate } from 'react-router-dom';
import { NetCanvas } from './NetCanvas';

const pillars = [
  {
    num: '01',
    title: 'End to End Production Execution',
    sub: 'Production',
  },
  {
    num: '02',
    title: 'Strategic Narrative Development',
    sub: 'Strategy',
  },
  {
    num: '03',
    title: 'Creator and Talent Management',
    sub: 'Talent',
  },
  {
    num: '04',
    title: 'Audience Activation & Distribution',
    sub: 'Activation',
  },
];

export const HowWeBuildSection = () => {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 1440);
  const isLocked = windowWidth >= 765 && windowWidth <= 1311;
  const isMobileLayout = isLocked || windowWidth < 1024;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <motion.section
      className="relative w-full bg-background overflow-hidden flex flex-col h-full min-h-0"
    >
      {/* Mobile Neural Net Background */}
      {isMobileLayout && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <NetCanvas className="w-full h-full opacity-40" />
        </div>
      )}
      {/* Top rule */}
      <div className="w-full h-px bg-white/10" />

      {/* Main Container - Pushed towards bottom to reduce the gap to footer */}
      <div className="flex-1 w-full flex flex-col justify-center pb-4 lg:pb-8 pt-8 md:pt-10 relative z-[60] min-h-0 overflow-hidden">
        <div className="w-full max-w-[90rem] mx-auto px-6 md:px-12">
          {/* Header row */}
        <HeaderRow />

        {/* Pillars list */}
        <div className="mt-5 md:mt-8 space-y-0">
          {pillars.map((p, i) => (
            <PillarRow key={p.num} pillar={p} index={i} />
          ))}
        </div>

        {/* CTA */}
        <CTARow navigate={navigate} />
        </div>
      </div>

    </motion.section>
  );
};

/* ─── Sub-components ─────────────────────────────────────────── */

function HeaderRow() {
  const [showPart2, setShowPart2] = useState(false);

  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 md:gap-8">
      {/* Section label */}
      <div className="flex items-center gap-4">
        <span className="text-[10px] uppercase tracking-[0.45em] text-white/30 font-mono font-light">
          Framework
        </span>
        <div className="w-8 h-px bg-white/20" />
      </div>

      {/* Big heading */}
      <h2 className="text-[clamp(2.2rem,min(6vw,8vh),4.5rem)] tracking-tight leading-[0.95] text-foreground flex flex-col md:block">
        <span className="font-normal font-mono">
          <TypewriterText text="How We" speed={40} delay={400} onComplete={() => setShowPart2(true)} />
        </span>{' '}
        <span className="font-light italic text-white/70 font-sans">
          <TypewriterText text="Build" speed={40} trigger={showPart2} />
        </span>
      </h2>
    </div>
  );
}

function PillarRow({
  pillar,
  index,
}: {
  pillar: (typeof pillars)[0];
  index: number;
}) {
  return (
    <div className="group relative">
      {/* Separator line */}
      <div className="w-full h-px bg-white/8" />

      <div className="flex items-center justify-between py-3 md:py-4 cursor-default group-hover:px-2 transition-all duration-500">
        {/* Number */}
        <span className="text-[11px] md:text-[12px] uppercase tracking-[0.35em] text-white/25 font-mono w-10 flex-shrink-0">
          {pillar.num}
        </span>

        {/* Title */}
        <p className="flex-1 mx-6 md:mx-10 text-[clamp(1.1rem,min(2.8vw,4vh),2.4rem)] font-light tracking-tight text-foreground leading-none group-hover:text-white transition-colors duration-300">
          {pillar.title}
        </p>

        {/* Sub-tag */}
        <span className="hidden md:block text-[10px] uppercase tracking-[0.4em] text-white/20 font-mono group-hover:text-white/50 transition-colors duration-300 w-28 text-right">
          {pillar.sub}
        </span>

        {/* Arrow glyph */}
        <div className="ml-6 md:ml-10 w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0">
          <svg
            viewBox="0 0 16 16"
            fill="none"
            className="w-4 h-4 text-white/50"
          >
            <path
              d="M2 8h12M9 4l5 4-5 4"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="square"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function CTARow({
  navigate,
}: {
  navigate: ReturnType<typeof useNavigate>;
}) {
  return (
    <div className="mt-6 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-2">
      <motion.a
        href="/about"
        onClick={(e) => {
          e.preventDefault();
          navigate('/about');
        }}
        className="w-full sm:w-auto text-center py-3 px-10 bg-foreground text-background text-[11px] uppercase tracking-[0.3em] font-medium border border-foreground hover:bg-transparent hover:text-foreground transition-all duration-300"
        whileTap={{ scale: 0.98 }}
      >
        <span className="relative z-10">About Us</span>
      </motion.a>

      <motion.a
        href="/work"
        onClick={(e) => {
          e.preventDefault();
          navigate('/work');
        }}
        className="w-full sm:w-auto text-center py-3 px-10 border border-foreground/30 text-muted-foreground text-[11px] uppercase tracking-[0.3em] font-medium hover:border-foreground hover:text-foreground transition-all duration-300"
        whileTap={{ scale: 0.98 }}
      >
        <span className="relative z-10">View our work</span>
      </motion.a>
    </div>
  );
}
