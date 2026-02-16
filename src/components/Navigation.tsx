import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

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

  // Scroll-driven effects
  const { scrollY } = useScroll();
  const headerBorderWidth = useTransform(scrollY, [60, 160], ['5rem', '100%']);
  const headerBorderOpacity = useTransform(scrollY, [60, 61], [0, 1]);
  const headerBorderLeft = useTransform(scrollY, [140, 160], ['1.5rem', '0rem']);

  const handleClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onNavigate(path);
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 h-16 transition-colors duration-500 bg-background"
      >
        <div className="w-full h-full px-6 md:px-12 flex items-center justify-between relative">
          {/* Brand */}
          <div
          >
            <Link
              to="/"
              onClick={(e) => handleClick(e, '/')}
              className="text-xs md:text-base uppercase tracking-[0.3em] font-medium text-white md:text-foreground hover:text-muted-foreground transition-colors duration-300 block"
            >
              ARTISTE SPECTRE
            </Link>
          </div>

          {/* Nav Container (Desktop + Mobile Toggle) */}
          <div className="flex items-center">
            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <ul className="flex gap-6 md:gap-8">
                {navItems.map((item, index) => (
                  <li
                    key={item.path}
                  >
                    <Link
                      to={item.path}
                      onClick={(e) => handleClick(e, item.path)}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className={`text-[10px] md:text-xs uppercase tracking-[0.3em] relative transition-colors duration-300 ${location.pathname === item.path
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
                  </li>
                ))}
              </ul>
            </nav>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-white flex items-center h-full"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className="text-[10px] tracking-[0.2em] font-light min-w-[3rem] text-right">
                {mobileMenuOpen ? 'CLOSE' : 'MENU'}
              </span>
            </button>
          </div>

          {/* Dynamic Header Border Line */}
          {location.pathname === '/work' ? (
            <div className="absolute bottom-0 inset-x-0 h-px bg-zinc-800" />
          ) : (
            <motion.div
              className="absolute bottom-0 left-6 md:left-12 h-px bg-white/40 origin-left"
              style={{
                width: headerBorderWidth,
                opacity: headerBorderOpacity,
                left: headerBorderLeft
              }}
            />
          )}
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[10001] bg-background md:hidden"
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
                    className={`text-2xl tracking-[0.4em] font-light transition-colors duration-300 ${location.pathname === item.path
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                      }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
