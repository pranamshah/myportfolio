"use client";
import { useEffect, useRef } from "react";

// Port positions as % of canvas width/height
const PORTS = [
  { rx: 0.14, ry: 0.62 }, // Mumbai
  { rx: 0.21, ry: 0.58 }, // Chennai
  { rx: 0.46, ry: 0.52 }, // Gulf / Dubai
  { rx: 0.60, ry: 0.38 }, // Europe / Rotterdam
  { rx: 0.78, ry: 0.44 }, // UK / Hamburg
  { rx: 0.88, ry: 0.50 }, // US East Coast
  { rx: 0.72, ry: 0.66 }, // Singapore / SE Asia
  { rx: 0.80, ry: 0.52 }, // China / Shanghai
];

// Pairs of ports to draw routes between
const ROUTES = [
  [0, 2], [0, 3], [1, 2], [1, 6], [2, 3],
  [2, 7], [3, 5], [3, 4], [6, 7], [0, 5],
];

type Ship = { routeIdx: number; t: number; speed: number; dir: 1 | -1 };

export default function LogisticsCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = (canvas.width = canvas.offsetWidth);
    let H = (canvas.height = canvas.offsetHeight);
    let raf: number;
    let frame = 0;

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // One ship per route
    const ships: Ship[] = ROUTES.map((_, i) => ({
      routeIdx: i,
      t: Math.random(),
      speed: 0.0008 + Math.random() * 0.0006,
      dir: Math.random() > 0.5 ? 1 : -1,
    }));

    // Port pulse phase
    const pulsePhase = PORTS.map((_, i) => (i * Math.PI * 2) / PORTS.length);

    function getPort(idx: number) {
      return { x: PORTS[idx].rx * W, y: PORTS[idx].ry * H };
    }

    // Quadratic bezier control point — arc above midpoint
    function getCtrl(a: { x: number; y: number }, b: { x: number; y: number }) {
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      // Perpendicular, scaled to curve the arc nicely
      return { x: mx - (dy / len) * len * 0.22, y: my + (dx / len) * len * 0.22 };
    }

    function bezierPoint(t: number, a: { x: number; y: number }, ctrl: { x: number; y: number }, b: { x: number; y: number }) {
      const mt = 1 - t;
      return {
        x: mt * mt * a.x + 2 * mt * t * ctrl.x + t * t * b.x,
        y: mt * mt * a.y + 2 * mt * t * ctrl.y + t * t * b.y,
      };
    }

    function draw() {
      raf = requestAnimationFrame(draw);
      frame++;
      ctx!.clearRect(0, 0, W, H);

      // Draw route arcs
      ROUTES.forEach(([ai, bi]) => {
        const a = getPort(ai);
        const b = getPort(bi);
        const ctrl = getCtrl(a, b);

        ctx!.beginPath();
        ctx!.moveTo(a.x, a.y);
        ctx!.quadraticCurveTo(ctrl.x, ctrl.y, b.x, b.y);
        ctx!.strokeStyle = "rgba(180,170,155,0.25)";
        ctx!.lineWidth = 1;
        ctx!.setLineDash([4, 8]);
        ctx!.stroke();
        ctx!.setLineDash([]);
      });

      // Draw port beacons
      PORTS.forEach(({ rx, ry }, i) => {
        const x = rx * W;
        const y = ry * H;
        const pulse = (Math.sin(frame * 0.02 + pulsePhase[i]) + 1) / 2;

        // Outer ring
        ctx!.beginPath();
        ctx!.arc(x, y, 6 + pulse * 7, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(201,164,82,${0.12 * pulse})`;
        ctx!.lineWidth = 1;
        ctx!.stroke();

        // Core dot
        ctx!.beginPath();
        ctx!.arc(x, y, 3, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(201,164,82,${0.55 + 0.3 * pulse})`;
        ctx!.fill();
      });

      // Draw ships moving along routes
      ships.forEach(ship => {
        ship.t += ship.speed * ship.dir;
        if (ship.t > 1) { ship.t = 1; ship.dir = -1; }
        if (ship.t < 0) { ship.t = 0; ship.dir = 1; }

        const [ai, bi] = ROUTES[ship.routeIdx];
        const a = getPort(ai);
        const b = getPort(bi);
        const ctrl = getCtrl(a, b);
        const pos = bezierPoint(ship.t, a, ctrl, b);

        // Ship dot with glow
        const g = ctx!.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 5);
        g.addColorStop(0, "rgba(100,130,180,0.7)");
        g.addColorStop(1, "rgba(100,130,180,0)");
        ctx!.fillStyle = g;
        ctx!.beginPath();
        ctx!.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
        ctx!.fill();

        ctx!.beginPath();
        ctx!.arc(pos.x, pos.y, 2, 0, Math.PI * 2);
        ctx!.fillStyle = "rgba(80,110,170,0.85)";
        ctx!.fill();
      });
    }

    draw();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} />;
}
