import { useState } from 'react';
import { motion } from 'framer-motion';
import { RevealText } from '@/components/RevealText';
import { DrawingLine } from '@/components/DrawingLine';
import { TypewriterText } from '@/components/TypewriterText';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    reachingOutAs: '',
    projectType: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Special handling for local development where API isn't running
      if (response.status === 404 && window.location.hostname === 'localhost') {
        process.env.NODE_ENV === 'development' && console.log('Development mode: Simulating successful inquiry send', formData);
        setIsSubmitted(true);
        return;
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to send inquiry');
        }
      } else {
        if (!response.ok) {
          throw new Error('Server error occurred');
        }
      }

      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Submission error:', err);
      setFormError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const reachingOutOptions = ['Brand', 'Agency', 'Creator', 'Other'];
  const projectTypeOptions = ['Production', 'Experiential & Activation', 'Growth Strategy', 'Creator Partnership', 'Not sure yet'];

  return (
    <main className="bg-background text-foreground min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <DrawingLine className="w-full mb-12" delay={0.3} />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-3xl md:text-5xl font-light tracking-tight mb-6"
        >
          Start a Project
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-sm text-muted-foreground max-w-xl mb-16"
        >
          Have a campaign, launch, or cultural moment in mind? Tell us about your project and we'll take it from there.
        </motion.p>

        <DrawingLine className="w-24 mb-16" delay={0.7} />

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            <RevealText delay={0.1}>
              <div className="group">
                <label className="text-[10px] tracking-widest text-muted-foreground/50 block mb-3 uppercase">YOUR NAME</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-transparent border-b border-border/50 py-3 text-lg font-light tracking-wide focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/30"
                  placeholder="Enter your name"
                  required
                />
              </div>
            </RevealText>

            <RevealText delay={0.2}>
              <div className="group">
                <label className="text-[10px] tracking-widest text-muted-foreground/50 block mb-3 uppercase">EMAIL</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-transparent border-b border-border/50 py-3 text-lg font-light tracking-wide focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/30"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </RevealText>

            <RevealText delay={0.25}>
              <div className="group">
                <label className="text-[10px] tracking-widest text-muted-foreground/50 block mb-3 uppercase">PHONE NUMBER (OPTIONAL)</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-transparent border-b border-border/50 py-3 text-lg font-light tracking-wide focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/30"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </RevealText>

            <RevealText delay={0.3}>
              <div className="group">
                <label className="text-[10px] tracking-widest text-muted-foreground/50 block mb-3 uppercase">I'M REACHING OUT AS A</label>
                <div className="flex flex-wrap gap-3">
                  {reachingOutOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData({ ...formData, reachingOutAs: option })}
                      className={`px-4 py-2 border text-xs tracking-wide transition-all duration-300 ${formData.reachingOutAs === option
                          ? 'border-foreground text-foreground'
                          : 'border-border/50 text-muted-foreground hover:border-foreground/50 hover:text-foreground'
                        }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </RevealText>

            <RevealText delay={0.35}>
              <div className="group">
                <label className="text-[10px] tracking-widest text-muted-foreground/50 block mb-3 uppercase">PROJECT TYPE</label>
                <div className="flex flex-wrap gap-3">
                  {projectTypeOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData({ ...formData, projectType: option })}
                      className={`px-4 py-2 border text-xs tracking-wide transition-all duration-300 ${formData.projectType === option
                          ? 'border-foreground text-foreground'
                          : 'border-border/50 text-muted-foreground hover:border-foreground/50 hover:text-foreground'
                        }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </RevealText>

            <RevealText delay={0.4}>
              <div className="group">
                <label className="text-[10px] tracking-widest text-muted-foreground/50 block mb-3 uppercase">PROJECT OVERVIEW</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full bg-transparent border-b border-border/50 py-3 text-lg font-light tracking-wide focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/30 resize-none"
                  placeholder="Tell us about your project, timeline, and goals..."
                  required
                />
              </div>
            </RevealText>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-destructive tracking-widest uppercase"
              >
                {error}
              </motion.p>
            )}

            <RevealText delay={0.5}>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`mt-8 px-8 py-4 border border-foreground text-foreground text-[10px] tracking-[0.3em] transition-all duration-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-foreground hover:text-background'}`}
                whileHover={!isSubmitting ? { x: 4 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              >
                {isSubmitting ? 'SENDING...' : 'SEND INQUIRY'}
              </motion.button>
            </RevealText>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center py-16"
          >
            <h2 className="text-2xl md:text-3xl font-light mb-4">
              <TypewriterText text="Inquiry received." delay={200} speed={50} />
            </h2>
            <p className="text-sm text-muted-foreground mt-4">
              We typically respond within 1 to 2 business days.
            </p>
          </motion.div>
        )}


        {/* Trust footer */}
        <RevealText delay={0.55}>
          <p className="mt-10 text-xs text-muted-foreground/60 leading-relaxed">
            We typically respond within 1 to 2 business days. Trusted by brands across beauty, fashion, performance, and next gen mobility.
          </p>
        </RevealText>

        <DrawingLine className="w-full mt-16" delay={0.6} />

        {/* Direct contact */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <RevealText delay={0.7}>
            <div>
              <span className="text-[10px] tracking-widest text-muted-foreground/50 block mb-3 uppercase">GENERAL INQUIRIES</span>
              <a
                href="mailto:pablo@machina-studio.com"
                className="relative inline-block text-lg font-light after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-foreground hover:after:w-full after:transition-all after:duration-300"
              >
                pablo@machina-studio.com
              </a>
            </div>
          </RevealText>

        </div>
      </div>
    </main>
  );
};

export default Contact;
