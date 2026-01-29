import { motion } from 'framer-motion';
import { DrawingLine } from './DrawingLine';

export const FooterSection = () => {
  return (
    <footer className="py-24">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <DrawingLine className="w-full mb-16" />
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8"
        >
          <div>
            <p className="scene-heading mb-4">ARTISTE SPECTRE LLC</p>
            <p className="action-text text-muted-foreground/50">
              Where culture is designed, not chased.
            </p>
          </div>
          
          <div className="flex gap-8">
            <a 
              href="#" 
              className="screenplay-link action-text text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </a>
            <a 
              href="#" 
              className="screenplay-link action-text text-muted-foreground hover:text-foreground transition-colors"
            >
              Instagram
            </a>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16"
        >
          <p className="text-xs text-muted-foreground/30">
            © 2025 Artiste Spectre LLC. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};
