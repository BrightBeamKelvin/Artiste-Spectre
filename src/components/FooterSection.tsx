import { motion } from 'framer-motion';
import { DrawingLine } from './DrawingLine';

export const FooterSection = () => {
  return (
    <footer className="py-8 border-t border-white/20">
      <div className="w-full px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <div className="flex items-center gap-6">
            <p className="text-[11px] uppercase tracking-[0.4em] text-white/90">ARTISTE SPECTRE LLC</p>
            <p className="hidden md:block text-[10px] uppercase tracking-[0.3em] text-white/60">
              © 2025 All rights reserved.
            </p>
          </div>

          <div className="flex gap-8">
            <a
              href="/contact"
              className="text-[11px] uppercase tracking-[0.3em] text-white/80 hover:text-white transition-colors"
            >
              Contact
            </a>
            <a
              href="#"
              className="text-[11px] uppercase tracking-[0.3em] text-white/80 hover:text-white transition-colors"
            >
              Instagram
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
