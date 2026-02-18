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
  const headerBorderWidth = useTransform(scrollY, [0, 100], ['5rem', '100%']);
  const headerBorderOpacity = useTransform(scrollY, [0, 1], [1, 1]);
  const headerBorderLeft = useTransform(scrollY, [80, 100], ['1.5rem', '0rem']);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onNavigate(path);
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[10002] h-16 transition-colors duration-500 bg-background"
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
            <div className="absolute bottom-0 inset-x-0 h-[0.5px] bg-white" />
          ) : (
            <motion.div
              className="absolute bottom-0 left-6 md:left-12 h-[0.5px] bg-white origin-left"
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
            transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navItems.map((item, index) => (
                <ChromaticNavLink
                  key={item.path}
                  item={item}
                  index={index}
                  isActive={location.pathname === item.path}
                  onClick={(e) => handleClick(e, item.path)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const ChromaticNavLink = ({
  item,
  index,
  isActive,
  onClick
}: {
  item: typeof navItems[0],
  index: number,
  isActive: boolean,
  onClick: (e: React.MouseEvent) => void
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{
        delay: index * 0.05,
        duration: 0.5,
        ease: [0.215, 0.61, 0.355, 1] // cubic-out
      }}
      className="relative"
    >
      {/* Red Ghost */}
      <motion.div
        className="absolute inset-0 pointer-events-none select-none text-[#ff3333] mix-blend-screen"
        initial={{ opacity: 0, x: 0, y: 0 }}
        animate={{
          x: [-3, 3, 0],
          y: [-1, 1, 0],
          opacity: [0, 0.7, 0]
        }}
        exit={{
          x: [0, -4, 4],
          y: [0, -2, 2],
          opacity: [0, 0.7, 0]
        }}
        transition={{
          duration: 0.4,
          ease: "easeOut",
          delay: index * 0.05 + 0.1
        }}
        aria-hidden="true"
      >
        <span className="text-2xl tracking-[0.4em] font-light">
          {item.label}
        </span>
      </motion.div>

      {/* Blue Ghost */}
      <motion.div
        className="absolute inset-0 pointer-events-none select-none text-[#3333ff] mix-blend-screen"
        initial={{ opacity: 0, x: 0, y: 0 }}
        animate={{
          x: [3, -3, 0],
          y: [1, -1, 0],
          opacity: [0, 0.7, 0]
        }}
        exit={{
          x: [0, 4, -4],
          y: [0, 2, -2],
          opacity: [0, 0.7, 0]
        }}
        transition={{
          duration: 0.4,
          ease: "easeOut",
          delay: index * 0.05 + 0.1
        }}
        aria-hidden="true"
      >
        <span className="text-2xl tracking-[0.4em] font-light">
          {item.label}
        </span>
      </motion.div>

      {/* Main Link */}
      <Link
        to={item.path}
        onClick={onClick}
        className={`text-2xl tracking-[0.4em] font-light transition-colors duration-300 relative z-10 ${isActive ? 'text-foreground' : 'text-muted-foreground'
          }`}
      >
        {item.label}
      </Link>
    </motion.div>
  );
};
