import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { RevealText } from '@/components/RevealText';

import { TypewriterText } from '@/components/TypewriterText';

const BLOB_MEDIA = {
  jordan: "https://cjortzrbfxpqnq4i.public.blob.vercel-storage.com/Brand%20Work/Nike%20%7C%20Jordan%20/instagram_DHl8Z0_ywn__mute.mp4",
  harden: "https://cjortzrbfxpqnq4i.public.blob.vercel-storage.com/Brand%20Work/Adidas%20%7C%20James%20Harden/1.mp4",
  onyx: "https://cjortzrbfxpqnq4i.public.blob.vercel-storage.com/Brand%20Work/Onyx%20E-bike/1.mp4",
  jumpman: "https://cjortzrbfxpqnq4i.public.blob.vercel-storage.com/Brand%20Work/Nike%20%7C%20Jumpman/1.mp4",
  alison: "https://cjortzrbfxpqnq4i.public.blob.vercel-storage.com/Album%20Covers/Alison%20Wonderland/alison%201.mp4",
  renee: "https://cjortzrbfxpqnq4i.public.blob.vercel-storage.com/Album%20Covers/Renee%20Rapp%202/renee%201.jpg",
};

const About = () => {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnded = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 11;
      videoRef.current.play().catch(console.error);
    }
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const yParallax1 = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const yParallax2 = useTransform(scrollYProgress, [0, 1], [0, -250]);

  return (
    <main ref={containerRef} className="bg-background text-foreground min-h-screen pt-12 md:pt-16 pb-16 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 relative">
        
        {/* Hero Section Container */}
        <div className="relative mb-32 pt-0 min-h-[50vh] flex items-center">
          
          {/* Hero statement - left aligned */}
          <div className="w-full md:w-[80%] lg:w-[70%] max-w-4xl relative z-10">

            
            <div className="space-y-4 mt-8 min-h-[180px] md:min-h-[260px]">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-light leading-[0.9] tracking-tight">
                <TypewriterText
                  text="We build campaigns."
                  delay={100}
                  speed={30}
                  className="whitespace-normal md:whitespace-nowrap"
                  wrap={false}
                />
              </h1>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-light leading-[0.9] tracking-tight">
                <TypewriterText
                  text="We produce the content."
                  delay={800}
                  speed={30}
                  className="whitespace-normal md:whitespace-nowrap"
                  wrap={false}
                />
              </h1>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-light leading-[0.9] tracking-tight text-primary">
                <TypewriterText
                  text="We activate audiences."
                  delay={1600}
                  speed={30}
                  className="whitespace-normal md:whitespace-nowrap"
                  wrap={false}
                />
              </h1>
            </div>
          </div>

          {/* Desktop Video - placed to the right, slightly behind text */}
          <motion.div 
            style={{ y: yParallax1 }} 
            className="absolute -right-12 top-12 w-[75vw] md:w-[35vw] md:left-[55%] lg:left-[60%] md:right-auto max-w-[450px] opacity-40 md:opacity-80 z-0"
          >
            <div className="relative aspect-[4/5] overflow-hidden transition-all duration-1000">
              <video 
                ref={videoRef}
                src={`${BLOB_MEDIA.jordan}#t=11`} 
                autoPlay 
                muted 
                playsInline 
                onEnded={handleVideoEnded}
                className="w-full h-full object-cover scale-105" 
              />
              <div className="absolute inset-0 bg-background/20" />
            </div>
          </motion.div>
        </div>



        {/* The pitch - offset to the right */}
        <div className="max-w-2xl ml-auto space-y-10 mb-40 relative z-10">
          <RevealText delay={0.1}>
            <p className="text-2xl md:text-3xl leading-relaxed font-light">
              Machina is a founder led creative production company delivering premium campaigns for brands operating at the forefront of culture.
            </p>
          </RevealText>
        </div>

        {/* Edge-to-edge or large bleed media for Our Model */}
        <div className="mb-40 relative">
          <motion.div 
            initial={{ opacity: 0, clipPath: 'inset(10% 10% 10% 10%)' }}
            whileInView={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-100px" }}
            className="w-full aspect-square md:aspect-[21/9] mb-16 overflow-hidden relative group"
          >
            <motion.video 
              src={BLOB_MEDIA.harden} 
              autoPlay loop muted playsInline 
              className="w-full h-full object-cover"
              initial={{ filter: 'grayscale(100%)' }}
              whileInView={{ filter: 'grayscale(0%)' }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ amount: 0.3, once: false }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
            {/* Center label overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <span className="text-white text-sm font-mono tracking-[0.3em] uppercase mix-blend-overlay">James Harden | Adidas</span>
            </div>
          </motion.div>

          <div className="relative w-screen left-1/2 -translate-x-1/2 px-6 md:px-12 lg:px-24 overflow-visible">
            <div className="w-full">
              <RevealText delay={0.1}>
                <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground/60 mb-6">Our Model</h2>
              </RevealText>
              <RevealText delay={0.2}>
                <p className="text-4xl md:text-6xl lg:text-7xl leading-[1.1] font-light pt-4">
                  We manage production at scale, lead creative direction, and curate partnerships that extend cultural impact.
                </p>
              </RevealText>
            </div>
          </div>
        </div>



        {/* Capabilities - Interleaved with media */}
        <div className="mb-32 relative">


          <div className="space-y-32">
            {[
              { step: '01', title: 'End to End Production Execution', desc: 'Delivering commercial grade visual storytelling and campaigns with scalable infrastructure.', media: BLOB_MEDIA.jumpman, mediaType: 'video', align: 'right' },
              { step: '02', title: 'Strategic Narrative Development', desc: 'Structuring campaigns and creative direction that position brands as cultural leaders.', media: BLOB_MEDIA.renee, mediaType: 'image', align: 'left' },
              { step: '03', title: 'Creator and Talent Management', desc: 'Curating partnerships and talent ecosystems built for authentic audience resonance.', media: BLOB_MEDIA.alison, mediaType: 'video', align: 'right' },
              { step: '04', title: 'Audience Activation & Distribution', desc: 'Executing digital and experiential moments that scale reach and drive performance.', media: BLOB_MEDIA.onyx, mediaType: 'video', align: 'left' },
            ].map((item, index) => (
              <div key={index} className={`flex flex-col gap-16 md:gap-24 md:flex-row ${item.align === 'left' ? 'md:flex-row-reverse' : ''} items-center`}>
                <div className="w-full md:w-1/2 flex justify-center">
                  <motion.div 
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true, margin: "-100px" }}
                    className={`w-full ${item.align === 'left' ? 'aspect-[3/4]' : 'aspect-square'} relative overflow-hidden group`}
                  >
                    {item.mediaType === 'video' ? (
                      <motion.video 
                        src={item.media} 
                        autoPlay loop muted playsInline 
                        className="w-full h-full object-cover"
                        initial={{ filter: 'grayscale(100%)' }}
                        whileInView={{ filter: 'grayscale(0%)' }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        viewport={{ amount: 0.4, once: false }}
                      />
                    ) : (
                      <motion.img 
                        src={item.media} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                        initial={{ filter: 'grayscale(100%)' }}
                        whileInView={{ filter: 'grayscale(0%)' }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        viewport={{ amount: 0.4, once: false }}
                      />
                    )}
                  </motion.div>
                </div>
                <div className="w-full md:w-1/2">
                  <RevealText delay={0.1}>
                    <span className="text-muted-foreground/30 text-sm font-mono tracking-widest block mb-8">{item.step}</span>
                  </RevealText>
                  <RevealText delay={0.2}>
                    <h3 className="text-3xl md:text-5xl font-light mb-8 leading-tight max-w-md">{item.title}</h3>
                  </RevealText>
                  <RevealText delay={0.3}>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-sm">{item.desc}</p>
                  </RevealText>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-48 mb-24 relative overflow-hidden">
          <motion.div style={{ y: yParallax2 }} className="absolute left-0 top-12 w-[20vw] max-w-[250px] opacity-10 -z-10 hidden md:block">
            <video src={BLOB_MEDIA.jordan} autoPlay loop muted playsInline className="w-full h-auto object-cover" />
          </motion.div>

          <div className="max-w-4xl text-center relative z-10 pt-32 px-4 border-t border-border/20">
            {/* Closing / Industries */}
            <RevealText delay={0.1}>
              <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground/60 mb-12">Industries We Build Upon</h2>
            </RevealText>
            <RevealText delay={0.3}>
              <p className="text-2xl md:text-4xl lg:text-5xl leading-tight font-light bg-clip-text text-transparent bg-gradient-to-br from-foreground to-muted-foreground pb-4">
                Beauty, Sportswear, Luxury, Motorsports, Next Gen Mobility.
              </p>
            </RevealText>
          </div>
        </div>
      </div>
    </main>
  );
};

export default About;
