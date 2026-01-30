import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { VHSTransition } from '@/components/VHSTransition';
import { CursorTrail } from '@/components/CursorTrail';

interface PageLayoutProps {
  children: React.ReactNode;
}

export const PageLayout = ({ children }: PageLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  const handleNavigate = useCallback((path: string) => {
    if (path === location.pathname) return;
    
    setPendingPath(path);
    setIsTransitioning(true);
  }, [location.pathname]);

  const handleTransitionComplete = useCallback(() => {
    if (pendingPath) {
      navigate(pendingPath);
      setPendingPath(null);
    }
    // Keep transition active briefly for fade-out
    setTimeout(() => setIsTransitioning(false), 400);
  }, [navigate, pendingPath]);

  return (
    <div className="bg-background text-foreground min-h-screen overflow-x-hidden">
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
