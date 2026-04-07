import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { VHSTransition } from '@/components/VHSTransition';
import { GlitchTransition } from '@/components/GlitchTransition';
import { CursorTrail } from '@/components/CursorTrail';
import Noise from '@/components/Noise';

interface PageLayoutProps {
  children: React.ReactNode;
}

export const PageLayout = ({ children }: PageLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  // ── VHS intro/home transition (unchanged) ──
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  // ── Glitch transition (all non-home routes) ──
  const [isGlitching, setIsGlitching] = useState(false);
  const [glitchTarget, setGlitchTarget] = useState<string | null>(null);

  const handleNavigate = useCallback((path: string) => {
    if (path === location.pathname) return;

    if (path === '/') {
      // Home → keep existing VHS/ASCII transition
      setPendingPath(path);
      setIsTransitioning(true);
    } else {
      // All other routes → glitch transition
      setGlitchTarget(path);
      setIsGlitching(true);
    }
  }, [location.pathname]);

  // Called mid-glitch to swap the route (canvas still covers the screen)
  const handleGlitchNavigate = useCallback(() => {
    if (glitchTarget) {
      navigate(glitchTarget);
    }
  }, [navigate, glitchTarget]);

  // Called once the glitch canvas has fully faded out
  const handleGlitchComplete = useCallback(() => {
    setIsGlitching(false);
    setGlitchTarget(null);
  }, []);

  // VHS transition callbacks (home route)
  const handleTransitionComplete = useCallback(() => {
    if (pendingPath) {
      navigate(pendingPath, { state: { fromTransition: true } });
      setPendingPath(null);
    }
    setTimeout(() => setIsTransitioning(false), 400);
  }, [navigate, pendingPath]);

  // Handle route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Force top on initial load / refresh
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="text-foreground min-h-screen overflow-x-clip">
      <div className="scanline scanline-anim" />
      <Noise patternAlpha={100} patternRefreshInterval={3} />
      <CursorTrail />
      <Navigation onNavigate={handleNavigate} />

      {/* VHS/ASCII intro transition — home route only, unchanged */}
      <VHSTransition
        isActive={isTransitioning}
        onComplete={handleTransitionComplete}
      />

      {/* Glitch transition — all non-home nav clicks */}
      <GlitchTransition
        isActive={isGlitching}
        onNavigate={handleGlitchNavigate}
        onComplete={handleGlitchComplete}
      />

      {children}
    </div>
  );
};
