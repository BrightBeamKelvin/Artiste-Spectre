import { useEffect, useRef, useCallback } from 'react';

interface GlitchTransitionProps {
  isActive: boolean;
  onNavigate: () => void;
  onComplete: () => void;
}

// ─── Glitch draws (procedural, no screenshot needed) ─────────────────────────

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

function drawGlitchFrame(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  intensity: number // 0→1
) {
  // 1. Transparent base (user requested no black background)
  ctx.clearRect(0, 0, W, H);

  // 2. Procedural Noise Grain (fast)
  const noiseAmt = 0.05 + intensity * 0.05;
  for (let i = 0; i < 1000; i++) {
    const nx = Math.random() * W;
    const ny = Math.random() * H;
    const ns = Math.random() * 2;
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * noiseAmt})`;
    ctx.fillRect(nx, ny, ns, ns);
  }

  // 3. Very thin, horizontal scanlines (data streams)
  const lineCount = randInt(5, 15);
  for (let i = 0; i < lineCount; i++) {
    const y = randInt(0, H);
    const h = 0.5;
    const opacity = (Math.random() * 0.2 + 0.1) * intensity;
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.fillRect(0, y, W, h);
  }

  // 4. Subtle Chromatic Accents (Cyan / Magenta / White)
  if (Math.random() > 0.3) {
    const y = randInt(0, H);
    const h = randInt(1, 2);
    const xOff = randInt(-15, 15) * intensity;

    // Cyan
    ctx.fillStyle = `rgba(0, 255, 255, ${0.08 * intensity})`;
    ctx.fillRect(xOff, y, W, h);

    // Magenta
    ctx.fillStyle = `rgba(255, 0, 255, ${0.08 * intensity})`;
    ctx.fillRect(-xOff, y + randInt(-1, 1), W, h);
    
    // White core
    ctx.fillStyle = `rgba(255, 255, 255, ${0.1 * intensity})`;
    ctx.fillRect(0, y, W, 0.5);
  }

  // 5. Sparse Digital Decals
  if (Math.random() > 0.8) {
    const bx = randInt(50, W - 150);
    const by = randInt(50, H - 50);
    const bw = randInt(10, 80);
    const bh = randInt(1, 3);
    ctx.fillStyle = `rgba(255, 255, 255, ${0.15 * intensity})`;
    ctx.fillRect(bx, by, bw, bh);
  }

  // 6. Rapid 'pulsing' scanline
  const pulseY = (Date.now() / 2) % H;
  ctx.fillStyle = `rgba(255, 255, 255, ${0.02 * intensity})`;
  ctx.fillRect(0, pulseY, W, 0.5);
}

// ─── Component ────────────────────────────────────────────────────────────────

const PHASE1_MS = 120;   // rapid glitch on old page
const PHASE2_MS = 120;   // rapid glitch on new page
const FADE_MS   = 80;    // fast fade out

export const GlitchTransition = ({ isActive, onNavigate, onComplete }: GlitchTransitionProps) => {
  const canvasRef       = useRef<HTMLCanvasElement>(null);
  const rafRef          = useRef<number>(0);
  const startRef        = useRef<number>(0);
  const navigatedRef    = useRef(false);
  const doneRef         = useRef(false);

  const stopLoop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
  }, []);

  useEffect(() => {
    if (!isActive) {
      stopLoop();
      navigatedRef.current = false;
      doneRef.current = false;
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width  = W;
    canvas.height = H;
    canvas.style.opacity = '1';

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    navigatedRef.current = false;
    doneRef.current = false;
    startRef.current = performance.now();

    function loop() {
      const elapsed = performance.now() - startRef.current;
      const total   = PHASE1_MS + PHASE2_MS + FADE_MS;

      // Phase 1 → 2 boundary: navigate
      if (!navigatedRef.current && elapsed >= PHASE1_MS) {
        navigatedRef.current = true;
        onNavigate();
      }

      // Fade phase
      if (elapsed >= PHASE1_MS + PHASE2_MS) {
        const fadeProgress = Math.min((elapsed - PHASE1_MS - PHASE2_MS) / FADE_MS, 1);
        canvas.style.opacity = String(1 - fadeProgress);

        if (fadeProgress >= 1 && !doneRef.current) {
          doneRef.current = true;
          stopLoop();
          onComplete();
          return;
        }
        // Still draw one last glitch frame during early fade
        if (fadeProgress < 0.3) {
          drawGlitchFrame(ctx, W, H, 0.5);
        } else {
          ctx.clearRect(0, 0, W, H);
        }
      } else {
        // Active glitch phases - sharp peak at navigation point
        const intensity = elapsed < PHASE1_MS
          ? Math.pow(elapsed / PHASE1_MS, 2)               // steep ramp up
          : Math.pow(1 - (elapsed - PHASE1_MS) / PHASE2_MS, 2); // steep ramp down
        drawGlitchFrame(ctx, W, H, Math.max(0.1, intensity));
      }

      if (elapsed < total) {
        rafRef.current = requestAnimationFrame(loop);
      }
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => { stopLoop(); };
  }, [isActive, onNavigate, onComplete, stopLoop]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10001,
        pointerEvents: 'none',
      }}
    />
  );
};

