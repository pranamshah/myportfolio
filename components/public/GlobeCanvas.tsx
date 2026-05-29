"use client";
import { useEffect, useRef } from "react";

const PORTS = [
  { lat: 13.0, lon: 80.3 },    // Chennai
  { lat: 18.9, lon: 72.9 },    // Mumbai
  { lat: 22.3, lon: 114.2 },   // Hong Kong
  { lat: 1.3,  lon: 103.8 },   // Singapore
  { lat: 51.9, lon: 4.5 },     // Rotterdam
  { lat: 25.2, lon: 55.3 },    // Dubai
  { lat: 37.9, lon: 23.7 },    // Piraeus
  { lat: 40.7, lon: -74.0 },   // New York
  { lat: 34.6, lon: 135.5 },   // Osaka
  { lat: -1.3, lon: 36.8 },    // Mombasa
  { lat: -33.9, lon: 18.4 },   // Cape Town
  { lat: 29.9, lon: 32.6 },    // Suez / Port Said
];

const ROUTES = [
  [0,5],[0,3],[0,11],[1,5],[1,3],[3,2],[3,8],[5,4],
  [5,11],[4,7],[4,6],[11,10],[2,7],[0,9],[3,4],[7,8],
];

function slerp(lat1: number, lon1: number, lat2: number, lon2: number, t: number) {
  const toRad = (d: number) => d * Math.PI / 180;
  const toDeg = (r: number) => r * 180 / Math.PI;
  const φ1 = toRad(lat1), λ1 = toRad(lon1);
  const φ2 = toRad(lat2), λ2 = toRad(lon2);
  const x1 = Math.cos(φ1) * Math.cos(λ1), y1 = Math.cos(φ1) * Math.sin(λ1), z1 = Math.sin(φ1);
  const x2 = Math.cos(φ2) * Math.cos(λ2), y2 = Math.cos(φ2) * Math.sin(λ2), z2 = Math.sin(φ2);
  const dot = Math.min(1, Math.max(-1, x1*x2 + y1*y2 + z1*z2));
  const omega = Math.acos(dot);
  if (Math.abs(omega) < 0.0001) return { lat: lat1, lon: lon1 };
  const so = Math.sin(omega);
  const s1 = Math.sin((1 - t) * omega) / so;
  const s2 = Math.sin(t * omega) / so;
  const x = s1*x1 + s2*x2, y = s1*y1 + s2*y2, z = s1*z1 + s2*z2;
  return { lat: toDeg(Math.asin(z)), lon: toDeg(Math.atan2(y, x)) };
}

type Ship = { ri: number; t: number; speed: number; dir: 1 | -1 };

interface Props { cx?: number; cy?: number; radiusFactor?: number; opacity?: number }

export default function GlobeCanvas({ cx: cxFactor = 0.5, cy: cyFactor = 0.5, radiusFactor = 0.38, opacity = 1 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = (canvas.width = canvas.offsetWidth);
    let H = (canvas.height = canvas.offsetHeight);
    let raf: number, frame = 0, rot = -60;

    const ro = new ResizeObserver(() => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; });
    ro.observe(canvas);

    const ships: Ship[] = ROUTES.map((_, ri) => ({
      ri, t: Math.random(), speed: 0.0008 + Math.random() * 0.0009, dir: (Math.random() > 0.5 ? 1 : -1) as 1 | -1,
    }));

    function proj(lat: number, lon: number) {
      const R = Math.min(W, H) * radiusFactor;
      const px = W * cxFactor, py = H * cyFactor;
      const φ = lat * Math.PI / 180;
      const λ = (lon + rot) * Math.PI / 180;
      return {
        x: px + R * Math.cos(φ) * Math.sin(λ),
        y: py - R * Math.sin(φ),
        z: Math.cos(φ) * Math.cos(λ),
        R, px, py,
      };
    }

    function draw() {
      raf = requestAnimationFrame(draw);
      frame++;
      rot += 0.06;
      ctx!.clearRect(0, 0, W, H);

      const R = Math.min(W, H) * radiusFactor;
      const px = W * cxFactor, py = H * cyFactor;

      ctx!.globalAlpha = opacity;

      // --- Globe body ---
      const body = ctx!.createRadialGradient(px - R * 0.25, py - R * 0.25, R * 0.05, px, py, R);
      body.addColorStop(0,   "rgba(55, 90, 155, 0.92)");
      body.addColorStop(0.5, "rgba(25, 50, 110, 0.94)");
      body.addColorStop(1,   "rgba(8,  20,  60, 0.97)");
      ctx!.beginPath();
      ctx!.arc(px, py, R, 0, Math.PI * 2);
      ctx!.fillStyle = body;
      ctx!.fill();

      // --- Clip to globe for grid ---
      ctx!.save();
      ctx!.beginPath();
      ctx!.arc(px, py, R, 0, Math.PI * 2);
      ctx!.clip();

      // Latitude lines
      for (let lat = -75; lat <= 75; lat += 15) {
        ctx!.beginPath();
        let first = true;
        for (let lon = 0; lon <= 361; lon += 2) {
          const p = proj(lat, lon);
          if (p.z > 0) { first ? ctx!.moveTo(p.x, p.y) : ctx!.lineTo(p.x, p.y); first = false; }
          else { first = true; }
        }
        ctx!.strokeStyle = "rgba(120,160,240,0.12)";
        ctx!.lineWidth = 0.6;
        ctx!.stroke();
      }

      // Longitude lines
      for (let lon = 0; lon < 360; lon += 20) {
        ctx!.beginPath();
        let first = true;
        for (let lat = -90; lat <= 90; lat += 2) {
          const p = proj(lat, lon);
          if (p.z > 0) { first ? ctx!.moveTo(p.x, p.y) : ctx!.lineTo(p.x, p.y); first = false; }
          else { first = true; }
        }
        ctx!.strokeStyle = "rgba(120,160,240,0.12)";
        ctx!.lineWidth = 0.6;
        ctx!.stroke();
      }

      // --- Shipping routes ---
      ROUTES.forEach(([ai, bi]) => {
        const STEPS = 80;
        ctx!.beginPath();
        let first = true;
        for (let s = 0; s <= STEPS; s++) {
          const { lat, lon } = slerp(PORTS[ai].lat, PORTS[ai].lon, PORTS[bi].lat, PORTS[bi].lon, s / STEPS);
          const p = proj(lat, lon);
          if (p.z > -0.05) { first ? ctx!.moveTo(p.x, p.y) : ctx!.lineTo(p.x, p.y); first = false; }
          else { first = true; }
        }
        ctx!.strokeStyle = "rgba(80,200,255,0.22)";
        ctx!.lineWidth = 1;
        ctx!.shadowColor = "rgba(80,200,255,0.4)";
        ctx!.shadowBlur = 4;
        ctx!.stroke();
        ctx!.shadowBlur = 0;
      });

      ctx!.restore();

      // --- Atmosphere glow ---
      const atm = ctx!.createRadialGradient(px, py, R * 0.88, px, py, R * 1.12);
      atm.addColorStop(0, "rgba(80,140,255,0.08)");
      atm.addColorStop(1, "transparent");
      ctx!.beginPath();
      ctx!.arc(px, py, R * 1.12, 0, Math.PI * 2);
      ctx!.fillStyle = atm;
      ctx!.fill();

      // Highlight arc (top-left specular)
      const spec = ctx!.createRadialGradient(px - R * 0.4, py - R * 0.4, 0, px - R * 0.3, py - R * 0.3, R * 0.6);
      spec.addColorStop(0, "rgba(180,210,255,0.06)");
      spec.addColorStop(1, "transparent");
      ctx!.beginPath();
      ctx!.arc(px, py, R, 0, Math.PI * 2);
      ctx!.fillStyle = spec;
      ctx!.fill();

      // --- Port beacons ---
      PORTS.forEach(({ lat, lon }, i) => {
        const p = proj(lat, lon);
        if (p.z < 0) return;
        const bright = p.z;
        const pulse = (Math.sin(frame * 0.028 + i * 0.9) + 1) / 2;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, 5 + pulse * 7, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(201,164,82,${0.25 * pulse * bright})`;
        ctx!.lineWidth = 1;
        ctx!.stroke();

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(230,190,90,${0.6 + 0.4 * bright})`;
        ctx!.shadowColor = "rgba(201,164,82,0.7)";
        ctx!.shadowBlur = 6;
        ctx!.fill();
        ctx!.shadowBlur = 0;
      });

      // --- Ships ---
      ships.forEach(s => {
        s.t += s.speed * s.dir;
        if (s.t > 1) { s.t = 1; s.dir = -1; }
        if (s.t < 0) { s.t = 0; s.dir = 1; }
        const [ai, bi] = ROUTES[s.ri];
        const { lat, lon } = slerp(PORTS[ai].lat, PORTS[ai].lon, PORTS[bi].lat, PORTS[bi].lon, s.t);
        const p = proj(lat, lon);
        if (p.z < 0) return;

        const g = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, 7);
        g.addColorStop(0, "rgba(160,230,255,0.75)");
        g.addColorStop(1, "transparent");
        ctx!.fillStyle = g;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, 7, 0, Math.PI * 2);
        ctx!.fill();

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx!.fillStyle = "rgba(200,240,255,0.95)";
        ctx!.shadowColor = "rgba(150,220,255,0.8)";
        ctx!.shadowBlur = 8;
        ctx!.fill();
        ctx!.shadowBlur = 0;
      });

      ctx!.globalAlpha = 1;
    }

    draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [cxFactor, cyFactor, radiusFactor, opacity]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}
