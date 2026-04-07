import { useEffect, useRef, useCallback } from 'react';

interface NetCanvasProps {
  className?: string;
}

// Helpers
function getRandom(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

class CanvasNode {
  x: number;
  y: number;
  radius: number;
  depth: number;
  connections: number[];
  dToMouse: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.radius = 2;
    this.depth = Math.floor(getRandom(1, 10)) / 10;
    this.connections = [];
    this.dToMouse = 0;
  }

  update(canvasWidth: number) {
    const velocity = (1 - this.depth) * 0.5; // Slower speed (was 2)
    this.x = this.x + velocity;
    if (this.x > canvasWidth) {
      this.x = 0;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const alpha = 1 - this.depth;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fill();
  }
}

class Net {
  nodes: CanvasNode[];
  length: number;

  constructor() {
    this.nodes = [];
    this.length = 0;
  }

  populate(length: number, canvasWidth: number, canvasHeight: number) {
    this.length = length;
    this.nodes = [];
    for (let i = 0; i < length; i++) {
      // Cluster more towards the top portion (2% to 55% range)
      const xPos = Math.floor(getRandom(canvasWidth * 0.05, canvasWidth * 0.95));
      const yPos = Math.floor(getRandom(canvasHeight * 0.02, canvasHeight * 0.55));
      this.nodes.push(new CanvasNode(xPos, yPos));
    }
  }

  update(canvasWidth: number) {
    for (let i = 0; i < this.length; i++) {
      this.nodes[i].update(canvasWidth);
    }
  }

  draw(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    for (let i = 0; i < this.length; i++) {
      // Nodes are no longer drawn, only connections
    }
  }

  connect(distanceMax: number, ctx: CanvasRenderingContext2D, mousePos: { x: number; y: number }) {
    for (let i = 0; i < this.length - 1; i++) {
      this.nodes[i].connections = [];

      for (let j = 0; j < this.length - 1; j++) {
        const a = this.nodes[j].x - this.nodes[i].x;
        const b = this.nodes[j].y - this.nodes[i].y;
        const c = Math.sqrt(a * a + b * b);

        const xToMouse = this.nodes[j].x - mousePos.x;
        const yToMouse = this.nodes[j].y - mousePos.y;
        this.nodes[i].dToMouse = Math.floor(Math.sqrt(xToMouse * xToMouse + yToMouse * yToMouse));

        let d = (distanceMax / this.nodes[i].dToMouse) * 200;

        if ((distanceMax / this.nodes[i].dToMouse) * 200 > distanceMax) {
          d = distanceMax;
        }

        if (j > i && c < d) {
          this.nodes[i].connections.push(j);
        }
      }

      for (let k = 0; k < this.nodes[i].connections.length; k++) {
        ctx.beginPath();
        ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
        const connectedNode = this.nodes[this.nodes[i].connections[k]];
        ctx.lineTo(connectedNode.x, connectedNode.y);
        ctx.strokeStyle = `rgba(255,255,255,${this.nodes[i].depth / 4})`;
        ctx.stroke();
      }
    }
  }
}

export const NetCanvas = ({ className = '' }: NetCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const netRef = useRef<Net | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getMousePos = useCallback((canvas: HTMLCanvasElement, evt: MouseEvent | TouchEvent) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX: number, clientY: number;
    if ('touches' in evt) {
      clientX = evt.touches[0].clientX;
      clientY = evt.touches[0].clientY;
    } else {
      clientX = evt.clientX;
      clientY = evt.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }, []);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const nodesLength = Math.floor((canvas.width * canvas.height) / 9000); // Shifting slightly denser (was 12000)

    const net = new Net();
    net.populate(nodesLength, canvas.width, canvas.height);
    netRef.current = net;

    const render = () => {
      if (!netRef.current) return;
      netRef.current.update(canvas.width);
      netRef.current.draw(ctx, canvas.width, canvas.height);
      netRef.current.connect(120, ctx, mousePosRef.current); // Restore connection distance (was 90)
      rafRef.current = window.requestAnimationFrame(render);
    };

    rafRef.current = window.requestAnimationFrame(render);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      mousePosRef.current = getMousePos(canvas, e);
    };

    const handleResize = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      timeoutRef.current = setTimeout(init, 500);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleMouseMove as EventListener);
    window.addEventListener('resize', handleResize);

    init();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleMouseMove as EventListener);
      window.removeEventListener('resize', handleResize);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [init, getMousePos]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
};
