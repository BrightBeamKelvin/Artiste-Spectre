import { motion, useScroll, useTransform } from 'framer-motion';
import { RevealText } from '@/components/RevealText';
import { DrawingLine } from '@/components/DrawingLine';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

/* ── Vercel Blob Media ── */
const MEDIA = {
  jumpman: 'https://cjortzrbfxpqnq4i.public.blob.vercel-storage.com/Brand%20Work/Nike%20%7C%20Jumpman/1.mp4',
  harden: 'https://cjortzrbfxpqnq4i.public.blob.vercel-storage.com/Brand%20Work/Adidas%20%7C%20James%20Harden/1.mp4',
  onyx: 'https://cjortzrbfxpqnq4i.public.blob.vercel-storage.com/Brand%20Work/Onyx%20E-bike/1.mp4',
  alison: 'https://cjortzrbfxpqnq4i.public.blob.vercel-storage.com/Album%20Covers/Alison%20Wonderland/alison%201.mp4',
  jordan: 'https://cjortzrbfxpqnq4i.public.blob.vercel-storage.com/Brand%20Work/Nike%20%7C%20Jordan%20/instagram_DHl8Z0_ywn__mute.mp4',
  renee: 'https://cjortzrbfxpqnq4i.public.blob.vercel-storage.com/Album%20Covers/Renee%20Rapp%202/renee%201.jpg',
};

/* ── Service Data ── */
const services = [
  {
    index: '01',
    category: 'PRODUCTION',
    tagline: 'Premium campaign production for culture leading brands.',
    items: [
      'Campaign films',
      'social native content',
      'Branded content series',
      'Still photography',
      'Product & launch assets',
    ],
    media: MEDIA.jumpman,
    mediaType: 'video' as const,
  },
  {
    index: '02',
    category: 'EXPERIENTIAL & ACTIVATIONS',
    tagline: 'Physical and digital brand moments designed to amplify campaigns.',
    items: [
      'Pop-up retail experiences',
      'Brand activations',
      'Product launches',
      'Hybrid physical digital events',
    ],
    media: MEDIA.harden,
    mediaType: 'video' as const,
  },
  {
    index: '03',
    category: 'GROWTH STRATEGY',
    tagline: 'Ongoing strategy and content systems designed to extend campaign impact.',
    items: [
      'Content strategy & calendars',
      'Platform specific distribution',
      'Performance analytics & reporting',
      'Community & audience development',
    ],
    media: MEDIA.onyx,
    mediaType: 'video' as const,
  },
  {
    index: '04',
    category: 'CREATOR PARTNERSHIPS',
    tagline: 'Curated creator ecosystems integrated into campaign storytelling.',
    items: [
      'Brand partnership strategy',
      'Campaign packaging & creator matching',
      'Contract negotiation',
      'Creative oversight & brand safety',
    ],
    media: MEDIA.alison,
    mediaType: 'video' as const,
  },
];

/* ── Service Block Component ── */
const ServiceBlock = ({
  service,
  reverse,
}: {
  service: (typeof services)[0];
  reverse: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const mediaY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  const textY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const grayscale = useTransform(scrollYProgress, [0.3, 0.45, 0.55, 0.7], [1, 0, 0, 1]);

  return (
    <div
      ref={ref}
      className={`relative flex flex-col ${
        reverse ? 'md:flex-row-reverse' : 'md:flex-row'
      } items-stretch gap-0 md:gap-0 min-h-[70vh] md:min-h-[80vh]`}
    >
      {/* ── Media half ── */}
      <div className="relative w-full md:w-1/2 h-[50vh] md:h-auto overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ 
            y: mediaY,
            filter: useTransform(grayscale, (v) => `grayscale(${v})`)
          }}
        >
          <div className="absolute inset-[-20%] w-[140%] h-[140%]">
            {service.mediaType === 'video' ? (
              <video
                src={service.media}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-1000"
              />
            ) : (
              <img
                src={service.media}
                alt={service.category}
                className="w-full h-full object-cover opacity-50"
              />
            )}
          </div>
        </motion.div>

        {/* Dark overlay gradient towards text side */}
        <div
          className={`absolute inset-0 ${
            reverse
              ? 'bg-gradient-to-l from-background via-background/60 to-transparent'
              : 'bg-gradient-to-r from-background via-background/60 to-transparent'
          }`}
        />
        {/* Bottom gradient for mobile */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent md:hidden" />

        {/* Large ghost index number layered over media */}
        <div className={`absolute bottom-4 ${reverse ? 'right-6 md:left-6' : 'left-6'} pointer-events-none`}>
          <motion.span
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[120px] md:text-[200px] lg:text-[260px] font-light leading-none text-foreground/[0.04] select-none"
          >
            {service.index}
          </motion.span>
        </div>
      </div>

      {/* ── Text half ── */}
      <motion.div
        className="relative w-full md:w-1/2 flex flex-col justify-center px-6 md:px-16 lg:px-20 py-12 md:py-20 z-10"
        style={{ y: textY }}
      >
        {/* Category label */}
        <RevealText delay={0.1}>
          <span className="text-[10px] md:text-[11px] uppercase tracking-[0.35em] text-muted-foreground/60 block mb-4">
            {service.index} — {service.category}
          </span>
        </RevealText>

        {/* Tagline as main heading */}
        <RevealText delay={0.2}>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light leading-[1.15] mb-10 tracking-tight">
            {service.tagline}
          </h2>
        </RevealText>

        {/* Items grid - always visible, no accordion */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0">
          {service.items.map((item, i) => (
            <RevealText key={i} delay={0.25 + i * 0.06}>
              <div className="flex items-center gap-3 py-3 group/item">
                <span className="w-4 h-px bg-foreground/20 group-hover/item:bg-foreground/60 group-hover/item:w-6 transition-all duration-500 shrink-0" />
                <span className="text-sm text-muted-foreground group-hover/item:text-foreground transition-colors duration-300 tracking-wide">
                  {item}
                </span>
              </div>
            </RevealText>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

/* ── Page ── */
const Expertise = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroMediaScale = useTransform(heroScroll, [0, 1], [1, 1.15]);
  const heroMediaOpacity = useTransform(heroScroll, [0, 0.8], [0.3, 0]);
  const heroTextY = useTransform(heroScroll, [0, 1], [0, 80]);

  return (
    <main className="bg-background text-foreground min-h-screen overflow-hidden">

      {/* ━━━ HERO ━━━ */}
      <div ref={heroRef} className="relative h-[85vh] md:h-screen flex items-center justify-center overflow-hidden">
        {/* Background media collage */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ scale: heroMediaScale, opacity: heroMediaOpacity }}
        >
          <video
            src={MEDIA.jordan}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover grayscale"
          />
        </motion.div>

        {/* Heavy overlay */}
        <div className="absolute inset-0 bg-background/80 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50 z-[2]" />

        {/* Hero content */}
        <motion.div
          className="relative z-10 text-center px-6"
          style={{ y: heroTextY }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight leading-[0.85] mb-8">
              Expertise
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed mb-10">
              Production led creative services delivered end to end.<br className="hidden md:block" />
              From strategy to execution—one team, no handoffs.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* ━━━ SERVICES ━━━ */}
      <div className="relative">
        {services.map((service, index) => (
          <div key={index}>
            <ServiceBlock service={service} reverse={index % 2 !== 0} />
          </div>
        ))}
      </div>

      {/* ━━━ CLOSING CTA ━━━ */}
      <div className="relative py-32 md:py-48 overflow-hidden">
        {/* Ambient background video - very subtle */}
        <div className="absolute inset-0 z-0">
          <video
            src={MEDIA.onyx}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover grayscale opacity-[0.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-12 text-center">
          <RevealText delay={0.1}>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-light leading-[1.1] mb-6 tracking-tight">
              Let's talk about how we can bring it to life.
            </h2>
          </RevealText>

          <RevealText delay={0.2}>
            <p className="text-sm md:text-base text-muted-foreground mb-14 leading-relaxed">
              Have a campaign, launch, or cultural moment in mind?
            </p>
          </RevealText>

          <RevealText delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <motion.span
                  className="inline-block px-10 py-4 border border-foreground text-foreground text-[10px] tracking-[0.3em] hover:bg-foreground hover:text-background transition-all duration-300"
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  START A PROJECT
                </motion.span>
              </Link>
              <Link to="/work">
                <motion.span
                  className="inline-block px-10 py-4 border border-border/40 text-muted-foreground text-[10px] tracking-[0.3em] hover:border-foreground/50 hover:text-foreground transition-all duration-300"
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  VIEW OUR WORK
                </motion.span>
              </Link>
            </div>
          </RevealText>

        </div>
      </div>
    </main>
  );
};

export default Expertise;
