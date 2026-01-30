import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

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

  const handleClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    onNavigate(path);
  };

  return (
    <nav className="fixed top-6 right-6 md:right-12 z-50">
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
  );
};
