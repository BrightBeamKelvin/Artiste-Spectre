import { useState } from 'react';
import { motion } from 'framer-motion';
import { RevealText } from '@/components/RevealText';
import { DrawingLine } from '@/components/DrawingLine';
import { TypewriterText } from '@/components/TypewriterText';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setIsSubmitted(true);
  };

  return (
    <main className="bg-background text-foreground min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <span className="scene-heading">INT. THE CONVERSATION — PRESENT</span>
        </motion.div>

        <DrawingLine className="w-full mb-12" delay={0.3} />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-3xl md:text-5xl font-light tracking-tight mb-6"
        >
          Start the Dialogue
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="action-text max-w-xl mb-16"
        >
          Whether you're a brand looking for cultural relevance or a creator ready to scale—let's talk.
        </motion.p>

        <DrawingLine className="w-24 mb-16" delay={0.7} />

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            <RevealText delay={0.1}>
              <div className="group">
                <label className="scene-heading block mb-3">YOUR NAME</label>
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
                <label className="scene-heading block mb-3">EMAIL</label>
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

            <RevealText delay={0.3}>
              <div className="group">
                <label className="scene-heading block mb-3">YOU ARE A</label>
                <div className="flex flex-wrap gap-3">
                  {['Brand', 'Creator', 'Agency', 'Other'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, type })}
                      className={`px-4 py-2 border text-sm tracking-wide transition-all duration-300 ${
                        formData.type === type
                          ? 'border-foreground text-foreground'
                          : 'border-border/50 text-muted-foreground hover:border-foreground/50 hover:text-foreground'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </RevealText>

            <RevealText delay={0.4}>
              <div className="group">
                <label className="scene-heading block mb-3">THE BRIEF</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full bg-transparent border-b border-border/50 py-3 text-lg font-light tracking-wide focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/30 resize-none"
                  placeholder="Tell us what you're looking to achieve..."
                  required
                />
              </div>
            </RevealText>

            <RevealText delay={0.5}>
              <motion.button
                type="submit"
                className="mt-8 px-8 py-4 border border-foreground text-foreground scene-heading tracking-widest hover:bg-foreground hover:text-background transition-all duration-300"
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                SEND MESSAGE
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
              <TypewriterText text="Message received." delay={200} speed={50} />
            </h2>
            <p className="action-text mt-4">
              We'll be in touch shortly.
            </p>
          </motion.div>
        )}

        <DrawingLine className="w-full mt-16" delay={0.6} />

        {/* Direct contact */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <RevealText delay={0.7}>
            <div>
              <span className="scene-heading block mb-3">GENERAL INQUIRIES</span>
              <a 
                href="mailto:hello@artistespectre.com" 
                className="screenplay-link text-lg font-light"
              >
                hello@artistespectre.com
              </a>
            </div>
          </RevealText>

          <RevealText delay={0.8}>
            <div>
              <span className="scene-heading block mb-3">PARTNERSHIPS</span>
              <a 
                href="mailto:partners@artistespectre.com" 
                className="screenplay-link text-lg font-light"
              >
                partners@artistespectre.com
              </a>
            </div>
          </RevealText>
        </div>
      </div>
    </main>
  );
};

export default Contact;
