import { motion } from 'framer-motion';
import { RevealText } from '@/components/RevealText';
import { DrawingLine } from '@/components/DrawingLine';
import { TypewriterText } from '@/components/TypewriterText';
import { useState } from 'react';

const About = () => {
  const [showSecondLine, setShowSecondLine] = useState(false);

  return (
    <main className="bg-background text-foreground min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <span className="scene-heading">INT. THE AGENCY — DAY</span>
        </motion.div>

        <DrawingLine className="w-full mb-12" delay={0.3} />

        {/* Hero statement */}
        <div className="mb-16">
          <h1 className="text-2xl md:text-4xl font-light leading-tight tracking-tight">
            <TypewriterText
              text="We don't place influencers."
              delay={600}
              speed={40}
              onComplete={() => setShowSecondLine(true)}
            />
          </h1>
          {showSecondLine && (
            <h1 className="text-2xl md:text-4xl font-light leading-tight tracking-tight mt-2">
              <TypewriterText
                text="We build campaigns. We produce the content. We activate audiences."
                delay={200}
                speed={30}
              />
            </h1>
          )}
        </div>

        <DrawingLine className="w-32 mb-16" delay={1.5} />

        {/* The pitch */}
        <div className="space-y-8 mb-16">
          <RevealText delay={0.1}>
            <p className="screenplay-line">
              Artiste Spectre sits at the intersection of creator culture, premium production, and strategic brand building.
            </p>
          </RevealText>

          <RevealText delay={0.2}>
            <p className="screenplay-line">
              We're the creative authority for brands. The operational backbone for creators. The cultural translator between audience and advertiser.
            </p>
          </RevealText>

          <RevealText delay={0.3}>
            <p className="screenplay-line text-muted-foreground">
              Unlike traditional talent agencies focused on deal flow, or creative agencies detached from creator culture, or production companies limited to execution—we combine all three.
            </p>
          </RevealText>
        </div>

        <DrawingLine className="w-full mb-16" delay={0.4} />

        {/* Structure */}
        <RevealText delay={0.5}>
          <span className="scene-heading mb-8 block">THE FRAMEWORK</span>
        </RevealText>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {[
            { step: '01', title: 'Design the narrative', desc: 'Strategy that positions brands within culture, not beside it.' },
            { step: '02', title: 'Manage the relationship', desc: 'Creator partnerships built on trust, clarity, and mutual growth.' },
            { step: '03', title: 'Produce the content', desc: 'Commercial-grade production that feels native to the platform.' },
            { step: '04', title: 'Activate the audience', desc: 'Experiential moments that generate genuine cultural resonance.' },
          ].map((item, index) => (
            <RevealText key={index} delay={0.1 * index}>
              <div className="group">
                <span className="text-muted-foreground/30 text-xs">{item.step}</span>
                <h3 className="text-lg font-light mt-2 mb-2">{item.title}</h3>
                <p className="action-text">{item.desc}</p>
              </div>
            </RevealText>
          ))}
        </div>

        <DrawingLine className="w-48 mb-16" delay={0.6} />

        {/* Closing */}
        <RevealText delay={0.7}>
          <p className="screenplay-line text-center max-w-2xl mx-auto">
            We work across beauty, sportswear, luxury, motorsports, and next-gen mobility—anywhere culture moves faster than advertising.
          </p>
        </RevealText>
      </div>
    </main>
  );
};

export default About;
