import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { VHSTransition } from '@/components/VHSTransition';
import { CursorTrail } from '@/components/CursorTrail';
import Noise from '@/components/Noise';

interface PageLayoutProps {
  children: React.ReactNode;
}

export const PageLayout = ({ children }: PageLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  const handleNavigate = useCallback((path: string) => {
    if (path === location.pathname) return;

    if (path === '/') {
      setPendingPath(path);
      setIsTransitioning(true);
    } else {
      navigate(path);
    }
  }, [location.pathname, navigate]);

  const handleTransitionComplete = useCallback(() => {
    if (pendingPath) {
      navigate(pendingPath);
      setPendingPath(null);
    }
    // Keep transition active briefly for fade-out
    setTimeout(() => setIsTransitioning(false), 400);
  }, [navigate, pendingPath]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="bg-background text-foreground min-h-screen overflow-x-hidden">
      <Noise patternAlpha={20} patternRefreshInterval={3} />
      <CursorTrail />
      <Navigation onNavigate={handleNavigate} />
      <VHSTransition
        isActive={isTransitioning}
        onComplete={handleTransitionComplete}
      />
      {children}
    </div>
  );
};
