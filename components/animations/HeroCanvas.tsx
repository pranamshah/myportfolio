"use client";
import { useEffect, useRef } from "react";

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const particles: { x: number; y: number; r: number; dx: number; dy: number; alpha: number }[] = [];
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.7,
        r: Math.random() * 1.5 + 0.3,
        dx: (Math.random() - 0.5) * 0.2,
        dy: (Math.random() - 0.5) * 0.1,
        alpha: Math.random() * 0.7 + 0.3,
      });
    }

    let waveOffset = 0;

    function drawWaves() {
      if (!ctx || !canvas) return;
      // Wave 1
      ctx.beginPath();
      ctx.moveTo(0, height * 0.78);
      for (let x = 0; x <= width; x += 5) {
        const y = height * 0.78 + Math.sin((x + waveOffset) * 0.012) * 18 + Math.sin((x + waveOffset * 1.3) * 0.008) * 12;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fillStyle = "rgba(14,61,82,0.4)";
      ctx.fill();

      // Wave 2
      ctx.beginPath();
      ctx.moveTo(0, height * 0.82);
      for (let x = 0; x <= width; x += 5) {
        const y = height * 0.82 + Math.sin((x - waveOffset * 0.8) * 0.01) * 14 + Math.sin((x + waveOffset * 0.9) * 0.007) * 9;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fillStyle = "rgba(14,61,82,0.5)";
      ctx.fill();

      // Wave 3 (foreground)
      ctx.beginPath();
      ctx.moveTo(0, height * 0.87);
      for (let x = 0; x <= width; x += 5) {
        const y = height * 0.87 + Math.sin((x + waveOffset * 1.1) * 0.009) * 10;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fillStyle = "rgba(10,22,40,0.6)";
      ctx.fill();
    }

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);

      // Stars/particles
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height * 0.7;
        if (p.y > height * 0.7) p.y = 0;
      });

      // Horizon glow
      const grad = ctx.createLinearGradient(0, height * 0.65, 0, height * 0.8);
      grad.addColorStop(0, "rgba(14,116,144,0.15)");
      grad.addColorStop(1, "rgba(14,61,82,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, height * 0.65, width, height * 0.15);

      waveOffset += 1;
      drawWaves();

      animFrameId = requestAnimationFrame(draw);
    }

    draw();

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
}
