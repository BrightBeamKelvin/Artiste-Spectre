import { motion } from 'framer-motion';
import { RevealText } from '@/components/RevealText';
import { DrawingLine } from '@/components/DrawingLine';
import { TypewriterText } from '@/components/TypewriterText';
import { useState } from 'react';

const About = () => {
  const [showSecondLine, setShowSecondLine] = useState(false);

  return (
    <main className="bg-background text-foreground min-h-screen pt-24 pb-16">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
        {/* Hero statement - left aligned */}
        <div className="mb-24 max-w-5xl">
          <DrawingLine className="w-32 mb-12" delay={0.3} />
          <h1 className="text-3xl md:text-6xl font-light leading-[0.95] tracking-tight">
            <TypewriterText
              text="We don't place influencers."
              delay={600}
              speed={40}
              onComplete={() => setShowSecondLine(true)}
            />
          </h1>
          <div className="space-y-3 mt-16 min-h-[180px] md:min-h-[240px]">
            {showSecondLine && (
              <>
                <h1 className="text-3xl md:text-6xl font-light leading-[0.95] tracking-tight">
                  <TypewriterText
                    text="We build campaigns."
                    delay={100}
                    speed={30}
                  />
                </h1>
                <h1 className="text-3xl md:text-6xl font-light leading-[0.95] tracking-tight">
                  <TypewriterText
                    text="We produce the content."
                    delay={800}
                    speed={30}
                  />
                </h1>
                <h1 className="text-3xl md:text-6xl font-light leading-[0.95] tracking-tight">
                  <TypewriterText
                    text="We activate audiences."
                    delay={1600}
                    speed={30}
                  />
                </h1>
              </>
            )}
          </div>
        </div>

        <DrawingLine className="w-32 mb-16" delay={1.5} />

        {/* The pitch - offset to the right */}
        <div className="max-w-2xl ml-auto space-y-10 mb-24">
          <RevealText delay={0.1}>
            <p className="text-xl md:text-2xl leading-relaxed font-light">
              Artiste Spectre sits at the intersection of creator culture, premium production, and strategic brand building.
            </p>
          </RevealText>

          <RevealText delay={0.2}>
            <p className="text-xl md:text-2xl leading-relaxed font-light">
              We're the creative authority for brands. The operational backbone for creators. The cultural translator between audience and advertiser.
            </p>
          </RevealText>

          <RevealText delay={0.3}>
            <p className="text-base md:text-lg leading-relaxed font-light text-muted-foreground">
              Unlike traditional talent agencies focused on deal flow, or creative agencies detached from creator culture, or production companies limited to execution—we combine all three.
            </p>
          </RevealText>
        </div>

        <DrawingLine className="w-64 mb-20" delay={0.4} />

        {/* Steps - offset grid */}
        <div className="grid md:grid-cols-2 gap-x-24 gap-y-12 mb-24">
          {[
            { step: '01', title: 'Design the narrative', desc: 'Strategy that positions brands within culture, not beside it.' },
            { step: '02', title: 'Manage the relationship', desc: 'Creator partnerships built on trust, clarity, and mutual growth.' },
            { step: '03', title: 'Produce the content', desc: 'Commercial-grade production that feels native to the platform.' },
            { step: '04', title: 'Activate the audience', desc: 'Experiential moments that generate genuine cultural resonance.' },
          ].map((item, index) => (
            <RevealText key={index} delay={0.1 * index}>
              <div className={`group ${index % 2 === 1 ? 'md:ml-12' : ''}`}>
                <span className="text-muted-foreground/20 text-[10px] font-mono">{item.step}</span>
                <h3 className="text-xl md:text-2xl font-light mt-3 mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </RevealText>
          ))}
        </div>

        <div className="flex justify-center">
          <div className="max-w-2xl">
            <DrawingLine className="w-48 mb-12" delay={0.6} />

            {/* Closing */}
            <RevealText delay={0.7}>
              <p className="text-lg md:text-xl leading-relaxed font-light">
                We work across beauty, sportswear, luxury, motorsports, and next-gen mobility—anywhere culture moves faster than advertising.
              </p>
            </RevealText>
          </div>
        </div>
      </div>
    </main>
  );
};

export default About;
