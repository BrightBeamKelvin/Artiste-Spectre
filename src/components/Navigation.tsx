import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { label: 'WORK', path: '/work' },
  { label: 'ABOUT', path: '/about' },
  { label: 'EXPERTISE', path: '/expertise' },
  { label: 'CONTACT', path: '/contact' },
];

interface NavigationProps {
  onNavigate: (path: string) => void;
}

export const Navigation = ({ onNavigate }: NavigationProps) => {
  const location = useLocation();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onNavigate(path);
  };

  return (
    <>
      {/* Left side - Brand */}
      <motion.div
        className="fixed top-6 left-6 md:left-12 z-50"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Link
          to="/"
          onClick={(e) => handleClick(e, '/')}
          className="scene-heading text-foreground tracking-[0.2em] hover:text-muted-foreground transition-colors duration-300"
        >
          ARTISTE SPECTRE
        </Link>
      </motion.div>

      {/* Desktop Navigation */}
      <nav className="fixed top-6 right-6 md:right-12 z-50 hidden md:block">
        <ul className="flex gap-6 md:gap-8">
          {navItems.map((item, index) => (
            <motion.li
              key={item.path}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
            >
              <Link
                to={item.path}
                onClick={(e) => handleClick(e, item.path)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`scene-heading relative transition-colors duration-300 ${
                  location.pathname === item.path
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
                <motion.span
                  className="absolute -bottom-1 left-0 h-px bg-foreground"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: hoveredIndex === index || location.pathname === item.path 
                      ? '100%' 
                      : 0 
                  }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>

      {/* Mobile Menu Toggle - Screenplay brackets style */}
      <motion.button
        className="fixed top-6 right-6 z-50 md:hidden scene-heading text-foreground"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <span className="relative flex items-center gap-1">
          <motion.span
            animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-lg"
          >
            [
          </motion.span>
          <motion.span
            className="text-xs tracking-[0.2em]"
            animate={{ opacity: mobileMenuOpen ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
            {mobileMenuOpen ? '' : 'MENU'}
          </motion.span>
          <motion.span
            className="text-xs tracking-[0.2em] absolute left-4"
            animate={{ opacity: mobileMenuOpen ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {mobileMenuOpen ? 'CLOSE' : ''}
          </motion.span>
          <motion.span
            animate={{ rotate: mobileMenuOpen ? -90 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-lg ml-6"
          >
            ]
          </motion.span>
        </span>
      </motion.button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-background md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <Link
                    to={item.path}
                    onClick={(e) => handleClick(e, item.path)}
                    className={`text-2xl tracking-[0.4em] font-light transition-colors duration-300 ${
                      location.pathname === item.path
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              
              {/* Scene marker decoration */}
              <motion.div
                className="absolute bottom-12 left-1/2 -translate-x-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.4 }}
              >
                <span className="scene-heading text-muted-foreground">
                  — SELECT SCENE —
                </span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
