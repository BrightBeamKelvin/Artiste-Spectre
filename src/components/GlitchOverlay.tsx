import { useEffect, useRef } from 'react';
import { motion, useMotionValueEvent, MotionValue } from 'framer-motion';

interface GlitchOverlayProps {
  intensity: MotionValue<number>;
}

export const GlitchOverlay = ({ intensity }: GlitchOverlayProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    return () => window.removeEventListener('resize', resize);
  }, []);

  useMotionValueEvent(intensity, "change", (latest) => {
    const canvas = canvasRef.current;
    if (!canvas || latest <= 0.05) {
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    // Clear and draw glitch
    ctx.clearRect(0, 0, W, H);
    
    // 1. Base interference (no dark fill requested)
    // Removed: ctx.fillStyle = `rgba(0, 0, 0, ${latest * 0.4})`;
    // Removed: ctx.fillRect(0, 0, W, H);

    // 2. Grain
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * W;
      const y = Math.random() * H;
      const s = Math.random() * 2;
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * latest * 0.2})`;
      ctx.fillRect(x, y, s, s);
    }

    // 3. Scanlines
    if (Math.random() < latest) {
      const lineCount = Math.floor(latest * 10);
      for (let i = 0; i < lineCount; i++) {
        const y = Math.random() * H;
        ctx.fillStyle = `rgba(255, 255, 255, ${latest * 0.1})`;
        ctx.fillRect(0, y, W, 0.5);
      }
    }

    // 4. Chromatic Jitter
    if (Math.random() < latest * 0.5) {
      const y = Math.random() * H;
      const h = Math.random() * 20 * latest;
      const xOff = (Math.random() - 0.5) * 20 * latest;
      
      ctx.fillStyle = `rgba(0, 255, 255, ${latest * 0.1})`;
      ctx.fillRect(xOff, y, W, h);
      
      ctx.fillStyle = `rgba(255, 0, 255, ${latest * 0.1})`;
      ctx.fillRect(-xOff, y + 2, W, h);
    }

    // 5. Block Glitch (Techy/Rectangular)
    if (Math.random() < latest * 0.7) {
      const blockCount = Math.floor(latest * 5);
      for (let i = 0; i < blockCount; i++) {
        const bw = Math.random() * W * 0.3 * latest;
        const bh = Math.random() * 5 * latest;
        const bx = Math.random() * (W - bw);
        const by = Math.random() * (H - bh);
        
        ctx.fillStyle = Math.random() > 0.5 
          ? `rgba(255, 255, 255, ${latest * 0.2})` 
          : `rgba(0, 255, 255, ${latest * 0.1})`;
        ctx.fillRect(bx, by, bw, bh);
      }
    }
  });

  return (
    <motion.canvas
      ref={canvasRef}
      className="absolute inset-0 z-20 pointer-events-none w-full h-full"
      style={{ opacity: intensity }}
    />
  );
};
