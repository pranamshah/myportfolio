"use client";
import { useEffect, useRef } from "react";
import { CONTINENTS } from "./worldOutline";

const PORTS = [
  { lat: 13.0,  lon: 80.3  },   // 0 Chennai
  { lat: 18.9,  lon: 72.9  },   // 1 Mumbai
  { lat: 22.3,  lon: 114.2 },   // 2 Hong Kong
  { lat:  1.3,  lon: 103.8 },   // 3 Singapore
  { lat: 51.9,  lon:   4.5 },   // 4 Rotterdam
  { lat: 25.2,  lon:  55.3 },   // 5 Dubai
  { lat: 37.9,  lon:  23.7 },   // 6 Piraeus
  { lat: 40.7,  lon: -74.0 },   // 7 New York
  { lat: 34.6,  lon: 135.5 },   // 8 Osaka
  { lat: -1.3,  lon:  36.8 },   // 9 Mombasa
  { lat: -33.9, lon:  18.4 },   // 10 Cape Town
  { lat: 29.9,  lon:  32.6 },   // 11 Suez
];

const SEA_ROUTES  = [[0,5],[0,3],[0,11],[1,5],[1,3],[3,2],[3,8],[5,4],[5,11],[4,7],[4,6],[11,10],[2,7],[0,9],[3,4]] as [number,number][];
const AIR_ROUTES  = [[0,4],[0,7],[0,5],[0,3],[0,2],[1,4],[3,7]] as [number,number][];

function slerp(lat1: number, lon1: number, lat2: number, lon2: number, t: number) {
  const toRad = (d: number) => d * Math.PI / 180;
  const toDeg = (r: number) => r * 180 / Math.PI;
  const [φ1,λ1,φ2,λ2] = [toRad(lat1),toRad(lon1),toRad(lat2),toRad(lon2)];
  const [x1,y1,z1] = [Math.cos(φ1)*Math.cos(λ1), Math.cos(φ1)*Math.sin(λ1), Math.sin(φ1)];
  const [x2,y2,z2] = [Math.cos(φ2)*Math.cos(λ2), Math.cos(φ2)*Math.sin(λ2), Math.sin(φ2)];
  const dot = Math.min(1, Math.max(-1, x1*x2+y1*y2+z1*z2));
  const omega = Math.acos(dot);
  if (Math.abs(omega) < 0.0001) return { lat: lat1, lon: lon1 };
  const so = Math.sin(omega);
  const [s1,s2] = [Math.sin((1-t)*omega)/so, Math.sin(t*omega)/so];
  return { lat: toDeg(Math.asin(s1*z1+s2*z2)), lon: toDeg(Math.atan2(s1*y1+s2*y2, s1*x1+s2*x2)) };
}

type Mover = { ri: number; t: number; speed: number; dir: 1|-1 };

interface Props { cx?: number; cy?: number; radiusFactor?: number; opacity?: number }

export default function GlobeCanvas({ cx: cxF=0.5, cy: cyF=0.5, radiusFactor=0.38, opacity=1 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) return;

    let W = (canvas.width  = canvas.offsetWidth);
    let H = (canvas.height = canvas.offsetHeight);
    let raf: number, frame = 0, rot = -60;

    const ro = new ResizeObserver(() => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    });
    ro.observe(canvas);

    const ships:  Mover[] = SEA_ROUTES.map((_,ri) => ({ ri, t:Math.random(), speed:0.0007+Math.random()*0.0009, dir:(Math.random()>.5?1:-1) as 1|-1 }));
    const planes: Mover[] = AIR_ROUTES.map((_,ri) => ({ ri, t:Math.random(), speed:0.0013+Math.random()*0.0009, dir:(Math.random()>.5?1:-1) as 1|-1 }));

    function proj(lat: number, lon: number, rScale = 1) {
      const R  = Math.min(W, H) * radiusFactor * rScale;
      const px = W * cxF, py = H * cyF;
      const φ  = lat * Math.PI / 180;
      const λ  = (lon + rot) * Math.PI / 180;
      return { x: px + R*Math.cos(φ)*Math.sin(λ), y: py - R*Math.sin(φ), z: Math.cos(φ)*Math.cos(λ), R, px, py };
    }

    function draw() {
      raf = requestAnimationFrame(draw);
      frame++;
      rot += 0.055;
      ctx.clearRect(0, 0, W, H);

      const R  = Math.min(W, H) * radiusFactor;
      const px = W * cxF, py = H * cyF;
      ctx.globalAlpha = opacity;

      // ── Ocean ──
      const ocean = ctx.createRadialGradient(px-R*.28, py-R*.28, R*.04, px, py, R);
      ocean.addColorStop(0,   "rgba(60,100,180,0.96)");
      ocean.addColorStop(0.4, "rgba(25,55,120,0.97)");
      ocean.addColorStop(1,   "rgba(5,15,50,0.99)");
      ctx.beginPath(); ctx.arc(px, py, R, 0, Math.PI*2);
      ctx.fillStyle = ocean; ctx.fill();

      ctx.save();
      ctx.beginPath(); ctx.arc(px, py, R, 0, Math.PI*2); ctx.clip();

      // ── Lat/lon grid (subtle) ──
      ctx.strokeStyle = "rgba(100,150,230,0.07)";
      ctx.lineWidth = 0.4;
      for (let lat=-75; lat<=75; lat+=15) {
        ctx.beginPath(); let first=true;
        for (let lon=0; lon<=362; lon+=2) {
          const p=proj(lat,lon); if(p.z>0){first?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y);first=false;}else{first=true;}
        } ctx.stroke();
      }
      for (let lon=0; lon<360; lon+=20) {
        ctx.beginPath(); let first=true;
        for (let lat=-90; lat<=90; lat+=2) {
          const p=proj(lat,lon); if(p.z>0){first?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y);first=false;}else{first=true;}
        } ctx.stroke();
      }

      // ── Continents ──
      for (const cont of CONTINENTS) {
        const segs: {x:number;y:number}[][] = [];
        let cur: {x:number;y:number}[] = [];
        for (const [lat,lon] of cont) {
          const p = proj(lat,lon);
          if (p.z > -0.02) { cur.push({x:p.x,y:p.y}); }
          else if (cur.length) { segs.push(cur); cur=[]; }
        }
        if (cur.length) segs.push(cur);

        for (const seg of segs) {
          if (seg.length < 2) continue;
          ctx.beginPath();
          ctx.moveTo(seg[0].x, seg[0].y);
          for (let i=1;i<seg.length;i++) ctx.lineTo(seg[i].x,seg[i].y);
          if (seg.length >= cont.length * 0.75) {
            ctx.closePath();
            ctx.fillStyle = "rgba(72,128,72,0.72)";
            ctx.fill();
          }
          ctx.strokeStyle = "rgba(140,210,150,0.88)";
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }

      // ── Air routes (dashed, light blue) ──
      ctx.setLineDash([3,4]);
      AIR_ROUTES.forEach(([ai,bi]) => {
        ctx.beginPath(); let first=true;
        for (let s=0;s<=80;s++) {
          const {lat,lon} = slerp(PORTS[ai].lat,PORTS[ai].lon,PORTS[bi].lat,PORTS[bi].lon,s/80);
          const p=proj(lat,lon,1.035);
          if(p.z>-0.05){first?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y);first=false;}else{first=true;}
        }
        ctx.strokeStyle = "rgba(180,220,255,0.38)";
        ctx.lineWidth = 0.9;
        ctx.shadowColor = "rgba(150,200,255,0.3)";
        ctx.shadowBlur = 3;
        ctx.stroke(); ctx.shadowBlur=0;
      });
      ctx.setLineDash([]);

      // ── Sea routes (solid gold) ──
      SEA_ROUTES.forEach(([ai,bi]) => {
        ctx.beginPath(); let first=true;
        for (let s=0;s<=80;s++) {
          const {lat,lon}=slerp(PORTS[ai].lat,PORTS[ai].lon,PORTS[bi].lat,PORTS[bi].lon,s/80);
          const p=proj(lat,lon);
          if(p.z>-0.05){first?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y);first=false;}else{first=true;}
        }
        ctx.strokeStyle="rgba(255,210,100,0.50)";
        ctx.lineWidth=1.2;
        ctx.shadowColor="rgba(255,190,70,0.55)";
        ctx.shadowBlur=5; ctx.stroke(); ctx.shadowBlur=0;
      });

      ctx.restore();

      // ── Atmosphere ──
      const atm=ctx.createRadialGradient(px,py,R*.87,px,py,R*1.15);
      atm.addColorStop(0,"rgba(80,140,255,0.12)");
      atm.addColorStop(0.5,"rgba(40,90,200,0.05)");
      atm.addColorStop(1,"transparent");
      ctx.beginPath(); ctx.arc(px,py,R*1.15,0,Math.PI*2);
      ctx.fillStyle=atm; ctx.fill();

      // Specular
      const spec=ctx.createRadialGradient(px-R*.42,py-R*.42,0,px-R*.3,py-R*.3,R*.65);
      spec.addColorStop(0,"rgba(200,225,255,0.08)");
      spec.addColorStop(1,"transparent");
      ctx.beginPath(); ctx.arc(px,py,R,0,Math.PI*2);
      ctx.fillStyle=spec; ctx.fill();

      // ── Port beacons ──
      PORTS.forEach(({lat,lon},i) => {
        const p=proj(lat,lon); if(p.z<0)return;
        const pulse=(Math.sin(frame*.028+i*.9)+1)/2;
        ctx.beginPath(); ctx.arc(p.x,p.y,5+pulse*7,0,Math.PI*2);
        ctx.strokeStyle=`rgba(201,164,82,${.35*pulse*p.z})`;
        ctx.lineWidth=1; ctx.stroke();
        ctx.beginPath(); ctx.arc(p.x,p.y,2.5,0,Math.PI*2);
        ctx.fillStyle=`rgba(255,205,100,${.8+.2*p.z})`;
        ctx.shadowColor="rgba(255,175,70,0.9)"; ctx.shadowBlur=9;
        ctx.fill(); ctx.shadowBlur=0;
      });

      // ── Ships (white-blue dots) ──
      ships.forEach(s => {
        s.t+=s.speed*s.dir;
        if(s.t>1){s.t=1;s.dir=-1;} if(s.t<0){s.t=0;s.dir=1;}
        const [ai,bi]=SEA_ROUTES[s.ri];
        const {lat,lon}=slerp(PORTS[ai].lat,PORTS[ai].lon,PORTS[bi].lat,PORTS[bi].lon,s.t);
        const p=proj(lat,lon); if(p.z<0)return;
        const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,7);
        g.addColorStop(0,"rgba(200,240,255,0.8)"); g.addColorStop(1,"transparent");
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(p.x,p.y,7,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(p.x,p.y,2.0,0,Math.PI*2);
        ctx.fillStyle="rgba(220,245,255,1)";
        ctx.shadowColor="rgba(140,215,255,0.9)"; ctx.shadowBlur=9;
        ctx.fill(); ctx.shadowBlur=0;
      });

      // ── Planes (white-bright, slightly elevated) ──
      planes.forEach(s => {
        s.t+=s.speed*s.dir;
        if(s.t>1){s.t=1;s.dir=-1;} if(s.t<0){s.t=0;s.dir=1;}
        const [ai,bi]=AIR_ROUTES[s.ri];
        const {lat,lon}=slerp(PORTS[ai].lat,PORTS[ai].lon,PORTS[bi].lat,PORTS[bi].lon,s.t);
        const p=proj(lat,lon,1.04); if(p.z<0)return;
        // Draw plane as bright white + cyan halo
        const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,9);
        g.addColorStop(0,"rgba(180,230,255,0.7)"); g.addColorStop(1,"transparent");
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(p.x,p.y,9,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(p.x,p.y,2.5,0,Math.PI*2);
        ctx.fillStyle="rgba(240,252,255,1)";
        ctx.shadowColor="rgba(180,235,255,1)"; ctx.shadowBlur=12;
        ctx.fill(); ctx.shadowBlur=0;
      });

      ctx.globalAlpha=1;
    }

    draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [cxF, cyF, radiusFactor, opacity]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}
