import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useTransform, MotionValue, useMotionValueEvent } from 'framer-motion';
import { TypewriterText } from './TypewriterText';
import { useNavigate } from 'react-router-dom';
import { Viewfinder } from './Viewfinder';
import { GlitchOverlay } from './GlitchOverlay';
import { NetCanvas } from './NetCanvas';
import { HeroSymbol } from './HeroSymbol';

interface HeroSectionProps {
  scrollProgress: MotionValue<number>;
  targetRect?: DOMRect | null;
}

export const HeroSection = ({ scrollProgress, targetRect }: HeroSectionProps) => {
  const [showSubtext, setShowSubtext] = useState(false);
  const [showPart2, setShowPart2] = useState(false);
  const [showPart3, setShowPart3] = useState(false);
  const [showPart4, setShowPart4] = useState(false);
  const [showPart5, setShowPart5] = useState(false);
  const [showCtas, setShowCtas] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const [isViewfinderReady, setIsViewfinderReady] = useState(false);
  const [isGlitchActive, setIsGlitchActive] = useState(false);
  const navigate = useNavigate();

  useMotionValueEvent(scrollProgress, "change", (p) => {
    // Active during Hero->Manifesto [0.01-0.2] AND Manifesto->HowWeBuild [0.5-0.7]
    const active = (p > 0.01 && p < 0.20) || (p > 0.5 && p < 0.70);
    if (active !== isGlitchActive) setIsGlitchActive(active);
  });

  useEffect(() => {
    setIsGlitchActive(scrollProgress.get() > 0.08);
  }, []);

  const [windowWidth, setWindowWidth] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 1440);
  const [windowHeight, setWindowHeight] = useState(() => typeof window !== 'undefined' ? window.innerHeight : 900);
  const isLocked = windowWidth >= 765 && windowWidth <= 1311;
  const isMobileLayout = isLocked || windowWidth < 1024;
  const isShortScreen = windowHeight < 800;
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [sourceRect, setSourceRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const measure = () => {
      const horizontalMargin = window.innerWidth >= 768 ? 48 : 16;
      const headerHeight = 64; // Based on h-16 in Navigation.tsx
      const topOffset = horizontalMargin * 0.5;
      const bottomMargin = horizontalMargin;
      
      const absoluteTop = headerHeight + topOffset;
      
      const rect = {
        left: horizontalMargin,
        top: absoluteTop,
        width: window.innerWidth - (horizontalMargin * 2),
        height: window.innerHeight - absoluteTop - bottomMargin,
        right: window.innerWidth - horizontalMargin,
        bottom: window.innerHeight - bottomMargin,
        x: horizontalMargin,
        y: absoluteTop,
        toJSON: () => {}
      } as DOMRect;
      
      setSourceRect(rect);
    };
    
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [windowWidth]);



  // Dynamic Transform Calculations
  const sourceCenterX = sourceRect ? sourceRect.left + sourceRect.width / 2 : 0;
  const sourceCenterY = sourceRect ? sourceRect.top + sourceRect.height / 2 : 0;
  
  const targetCenterX = targetRect ? targetRect.left + targetRect.width / 2 : 0;
  const targetCenterY = targetRect ? targetRect.top + targetRect.height / 2 : 0;

  const deltaX = targetCenterX - sourceCenterX;
  const deltaY = targetCenterY - sourceCenterY;

  const targetWidth = targetRect ? targetRect.width : 0;
  const targetHeight = targetRect ? targetRect.height : 0;

  const vBoxWidth = useTransform(
    scrollProgress, 
    [0, 0.15, 0.4, 0.5], 
    [sourceRect ? `${sourceRect.width}px` : "100%", targetWidth ? `${targetWidth}px` : "100%", targetWidth ? `${targetWidth}px` : "100%", "100%"]
  );
  const vBoxX = useTransform(
    scrollProgress, 
    [0, 0.15, 0.4, 0.5], 
    [sourceRect ? sourceRect.left : 0, targetRect ? targetRect.left : 0, targetRect ? targetRect.left : 0, 0]
  );
  const inverseX = useTransform(scrollProgress, [0, 0.15, 0.4, 0.5], [0, deltaX * -1, deltaX * -1, 0]);
  
  // Height shrinking sequence (slightly overlaps width)
  const vBoxHeight = useTransform(
    scrollProgress, 
    [0.1, 0.2, 0.39, 0.40], 
    [sourceRect ? `${sourceRect.height}px` : "40vh", targetHeight ? `${targetHeight}px` : "100%", targetHeight ? `${targetHeight}px` : "100%", "2px"]
  ); 
  const vBoxY = useTransform(
    scrollProgress, 
    [0.1, 0.2, 0.50, 0.70], 
    [sourceRect ? sourceRect.top : 0, targetRect ? targetRect.top : 0, targetRect ? targetRect.top : 0, typeof window !== 'undefined' ? window.innerHeight : 1000]
  );
  const inverseY = useTransform(scrollProgress, [0.1, 0.2, 0.50, 0.70], [0, deltaY * -1, deltaY * -1, 0]);

  const boxOpacity = useTransform(scrollProgress, [0.1, 0.2, 0.4, 0.43, 0.68, 0.70], [1, 0, 0, 1, 1, 0]); // Fade in for scanline
  
  // Transition-specific content removal - Starting at 0 for immediate response
  const contentOpacity = useTransform(scrollProgress, [0, 0.15], [1, 0]);
  const glitchIntensity = useTransform(scrollProgress, [0.01, 0.15, 0.20, 0.42, 0.55, 0.70], [0, 1, 0, 0, 1, 0]);
  const glitchScale = useTransform(scrollProgress, [0.01, 0.15, 0.20, 0.42, 0.55, 0.70], [0, 60, 0, 0, 110, 0]);
  const rgbOffset = useTransform(scrollProgress, [0.01, 0.15, 0.20, 0.42, 0.55, 0.70], [0, 5, 0, 0, 20, 0]);
  const negativeRgbOffset = useTransform(rgbOffset, (v) => -v);
  
  // A solid floor that fades out EXACTLY as Manifesto fades in, keeping the overlay 100% opaque
  const heroFloorOpacity = useTransform(scrollProgress, [0.08, 0.18], [1, 0]);

  // Note: Viewfinder itself is NOT faded out via a transform here, 
  // because we want the box/corners to permanently frame the Manifesto video.

  useEffect(() => {
    const timer = setTimeout(() => setShowScroll(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.section 
      ref={sectionRef}
      className={`h-[100svh] relative overflow-hidden ${isLocked ? 'px-4' : 'px-4 md:px-12'}`}
    >
      {/* Solid Floor Layer to block content bleeding through from z-0 */}
      <motion.div 
        className="absolute inset-0 bg-background z-0 pointer-events-none"
        style={{ opacity: heroFloorOpacity }}
      >
        {/* Mobile Neural Net Background */}
        {isMobileLayout && (
          <div className="absolute inset-0 pointer-events-none z-[-1]">
            <NetCanvas className="w-full h-full opacity-40" />
          </div>
        )}
      </motion.div>

      {/* Viewfinder Layer (Absolute Coordinates) */}
      <div className="absolute inset-0 z-10 pointer-events-none">
            <Viewfinder 
              layoutId="hero-viewfinder-main"
              onReady={() => setIsViewfinderReady(true)}
              style={{ 
                width: vBoxWidth,
                height: vBoxHeight, 
                left: vBoxX,
                top: vBoxY,
                position: 'absolute'
              }}
              inverseX={inverseX}
              inverseY={inverseY}
              sourceWidth={sourceRect ? sourceRect.width : "100%"}
              sourceHeight={sourceRect ? sourceRect.height : "100%"}
              boxOpacity={boxOpacity}
              className={`pointer-events-auto`}
            >
              <AnimatePresence>
                {isGlitchActive && <GlitchOverlay intensity={glitchIntensity} />}
              </AnimatePresence>
              
              <motion.div 
                style={{ 
                  opacity: contentOpacity,
                  filter: isGlitchActive ? "url(#hero-morph-filter)" : "none"
                }}
                className={`w-full h-full flex flex-col ${isLocked ? 'p-[20px] md:pb-0' : 'p-[3vw] pb-[8vw] md:p-[6vw] lg:p-[7vh] md:pb-0 lg:pb-0'}`}
              >
                {/* ── Primary content: title + description + CTAs ── */}
                <div className={`${isMobileLayout ? 'flex-1 flex flex-col justify-end relative z-[60]' : 'pt-[10vh]'}`}>
                  {/* Top/Middle: symbol + heading + CTAs grouped to stay together */}
                  <div className={isMobileLayout ? "flex flex-col w-full" : ""}>
                    {isMobileLayout ? (
                      /* ── Mobile Typography: Left-Aligned Editorial ── */
                      <div className="flex flex-col w-full mb-2">
                        <h2 className="text-[min(9vw,6vh)] sm:text-[min(10vw,7vh)] font-mono font-light tracking-tight text-white/90 leading-none mb-2">
                          <TypewriterText text="Production" delay={300} speed={40} trigger={isViewfinderReady} wrap={true} onComplete={() => setShowPart2(true)} fixedPositioning={true} />
                        </h2>
                        <p className="text-[min(3.8vw,3vh)] font-sans font-light text-white/40 uppercase tracking-[0.3em] mb-3 pl-1">
                          <TypewriterText text="for Brands that" delay={0} speed={40} trigger={showPart2} wrap={true} onComplete={() => setShowPart3(true)} fixedPositioning={true} />
                        </p>
                        <div className="flex flex-col -space-y-[1vh]">
                          <h1 className="text-[min(18vw,11vh)] sm:text-[min(20vw,12vh)] font-sans font-light text-white leading-[0.85] tracking-tighter">
                            <TypewriterText text="Define" delay={0} speed={35} trigger={showPart3} wrap={true} onComplete={() => setShowPart4(true)} fixedPositioning={true} />
                          </h1>
                          <h1 className="text-[min(18vw,11vh)] sm:text-[min(20vw,12vh)] font-sans font-light text-white leading-[0.85] tracking-tighter">
                            <TypewriterText text="Culture." delay={0} speed={40} trigger={showPart4} wrap={true} onComplete={() => setShowSubtext(true)} fixedPositioning={true} />
                          </h1>
                        </div>
                      </div>
                    ) : (
                      /* ── Original Desktop Typography Layer ── */
                      <div className="mb-2 md:mb-[3vh] w-full relative" ref={containerRef}>
                        <h1 className="text-[min(7.5vw,9vh)] lg:text-[min(6.2vw,8.5vh)] xl:text-[min(84px,9vh)] leading-[1.08] text-left font-normal tracking-tight font-mono whitespace-nowrap">
                          <TypewriterText 
                            text={"High\u2009Impact Production"} 
                            delay={300} 
                            speed={35} 
                            trigger={isViewfinderReady} 
                            wrap={false} 
                            onComplete={() => setShowPart3(true)} 
                          />
                        </h1>

                        <div className="mt-4 md:mt-6 flex justify-end relative w-full">
                          <h1 className="text-[min(6.2vw,8vh)] lg:text-[min(5.2vw,7.5vh)] xl:text-[min(68px,8vh)] leading-[1.1] font-light tracking-tight flex flex-wrap justify-end w-full font-sans text-white/70 gap-[0.3em] text-right">
                            <span className="inline"><TypewriterText text={"for"} delay={100} speed={30} trigger={showPart3} wrap={true} onComplete={() => setShowPart4(true)} /></span>
                            <span className="inline font-mono"><TypewriterText text={"Culture\u2009Defining"} delay={0} speed={30} trigger={showPart4} wrap={true} onComplete={() => setShowPart5(true)} className="italic" /></span>
                            <span className="inline font-sans"><TypewriterText text={"Brands."} delay={0} speed={30} trigger={showPart5} wrap={true} onComplete={() => setShowSubtext(true)} /></span>
                          </h1>
                        </div>
                      </div>
                    )}

                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: showSubtext ? 1 : 0 }} 
                      className={`md:max-w-2xl md:mt-[6vh] ${isMobileLayout ? 'flex flex-col w-full ml-0 mr-auto md:pb-0' : 'mt-2 sm:mt-5 text-right ml-auto mr-0'}`}
                    >
                      <p className={`hidden md:block leading-relaxed text-muted-foreground font-light ${isLocked ? '!text-[14px]' : 'text-sm sm:text-base md:text-lg lg:text-xl'}`}>
                        Building digital first campaigns powered by <br className={isLocked ? 'block' : 'hidden'} /> curated talent and strategic execution.
                      </p>
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: showSubtext ? 1 : 0 }} 
                        transition={{ duration: 0.8, delay: 1.0 }} 
                        className={`flex flex-col sm:flex-row w-full ${isMobileLayout ? 'mt-2 justify-start items-stretch' : 'mt-4 sm:mt-5 md:mt-[4vh] justify-end items-end sm:items-center'} ${isLocked ? '!gap-3' : 'gap-2 md:gap-5'}`}
                      >
                        <motion.a href="/contact" onClick={(e) => { e.preventDefault(); navigate('/contact'); }} className={`w-full sm:w-auto text-center py-4 md:py-3.5 bg-foreground text-background uppercase hover:bg-transparent hover:text-foreground border border-foreground transition-all duration-300 font-medium whitespace-nowrap tracking-[0.3em] ${isLocked ? '!text-[12px] !px-6' : 'text-[12px] md:text-[14px] px-6 md:px-8'}`} whileTap={{ scale: 0.97 }}>Book a Discovery Call</motion.a>
                        <motion.a href="/work" onClick={(e) => { e.preventDefault(); navigate('/work'); }} className={`w-full sm:w-auto text-center py-4 md:py-3.5 border border-foreground/30 text-muted-foreground uppercase hover:border-foreground hover:text-foreground transition-all duration-300 font-medium whitespace-nowrap tracking-[0.3em] ${isLocked ? '!text-[12px] !px-6' : 'text-[12px] md:text-[14px] px-6 md:px-8'}`} whileTap={{ scale: 0.97 }}>View Work</motion.a>
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Bottom: scroll indicator pins to bottom boundary */}
                  {isMobileLayout && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: showScroll ? 1 : 0 }}
                      transition={{ duration: 0.8 }}
                      className="flex flex-col items-center pb-3 pt-4 md:pb-0"
                    >
                      <div className="flex flex-col items-center -space-y-1">
                        {[0, 1, 2, 3].map((i) => (
                          <motion.svg
                            key={i}
                            width="28"
                            height="16"
                            viewBox="0 0 24 12"
                            fill="none"
                            initial={{ opacity: 0.1 }}
                            animate={{ opacity: [0.1, 0.5, 0.1] }}
                            transition={{
                              duration: 1.4,
                              repeat: Infinity,
                              repeatDelay: 0.6,
                              delay: i * 0.2,
                              ease: "easeInOut"
                            }}
                            className="text-white/40 drop-shadow-[0_0_3px_rgba(255,255,255,0.2)]"
                          >
                            <path
                              d="M4 2L12 10L20 2"
                              stroke="currentColor"
                              strokeWidth="1.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </motion.svg>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* ── Footer: brand tagline + divider ── */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: showSubtext ? 1 : 0, y: showSubtext ? 0 : 10 }}
                  transition={{ duration: 0.8, delay: 1.0 }}
                  className="relative mt-auto md:my-auto"
                >
                  {/* Scroll indicator — floats above the divider on the left, only desktop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: (showScroll && !isShortScreen) ? 1 : 0 }}
                    transition={{ duration: 0.8 }}
                    className={`hidden ${!isShortScreen ? 'md:block' : ''} absolute -left-4 top-1/2 -translate-y-1/2 z-20`}
                  >
                    <div className="flex items-center gap-2">
                      <span 
                        className="text-[10px] uppercase tracking-[0.3em] font-light text-muted-foreground"
                        style={{ writingMode: 'vertical-rl' }}
                      >
                        SCROLL
                      </span>
                      <div className="flex flex-col items-center">
                        <div className="flex flex-col gap-[1px]">
                          {[...Array(8)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-[4px] h-[4px] bg-white"
                              initial={{ opacity: 0.1 }}
                              animate={{ 
                                opacity: [0.1, 1, 0.1],
                              }}
                              transition={{
                                duration: 0.4,
                                repeat: Infinity,
                                repeatDelay: 1.1,
                                delay: i * 0.1,
                                ease: "circIn"
                              }}
                            />
                          ))}
                        </div>
                        <motion.div 
                          className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-white mt-[1px]"
                          initial={{ opacity: 0.1 }}
                          animate={{ 
                            opacity: [0.1, 1, 0.1]
                          }}
                          transition={{
                            duration: 0.4,
                            repeat: Infinity,
                            repeatDelay: 1.1,
                            delay: 0.8,
                            ease: "circIn"
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>

                  <motion.p 
                    animate={{ x: [0, 2, 0] }} 
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} 
                    className={`hidden ${!isShortScreen ? 'md:block' : ''} text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-white/50 font-mono text-center`}
                  >
                    [ Trusted by leading global brands across fashion, lifestyle, and performance. ]
                  </motion.p>
                </motion.div>
              </motion.div>
            </Viewfinder>
      </div>



      {/* SVG Morph Filter Definition */}
      <svg className="absolute w-0 h-0 opacity-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="hero-morph-filter">
            {/* High horizontal frequency, zero vertical frequency creates 'shredded' horizontal slices */}
            <feTurbulence 
              type="turbulence" 
              baseFrequency="0.05 0.5" 
              numOctaves="2" 
              seed="2"
              result="noise" 
            />
            <motion.feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={glitchScale}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
    </motion.section>
  );
};
