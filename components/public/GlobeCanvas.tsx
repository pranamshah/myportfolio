"use client";
import { useEffect, useRef } from "react";
import { CONTINENTS } from "./worldOutline";

const PORTS = [
  { lat: 13.0,  lon: 80.3  },  // 0  Chennai
  { lat: 18.9,  lon: 72.9  },  // 1  Mumbai
  { lat: 22.3,  lon: 114.2 },  // 2  Hong Kong
  { lat:  1.3,  lon: 103.8 },  // 3  Singapore
  { lat: 51.9,  lon:   4.5 },  // 4  Rotterdam
  { lat: 25.2,  lon:  55.3 },  // 5  Dubai
  { lat: 37.9,  lon:  23.7 },  // 6  Piraeus
  { lat: 40.7,  lon: -74.0 },  // 7  New York
  { lat: 34.6,  lon: 135.5 },  // 8  Osaka
  { lat: -1.3,  lon:  36.8 },  // 9  Mombasa
  { lat: -33.9, lon:  18.4 },  // 10 Cape Town
  { lat: 29.9,  lon:  32.6 },  // 11 Suez
  { lat: 22.5,  lon:  88.3 },  // 12 Kolkata
  { lat: 31.2,  lon: 121.5 },  // 13 Shanghai
];

const SEA_ROUTES:  [number,number][] = [
  [0,5],[0,3],[0,11],[1,5],[1,3],[3,2],[3,8],[5,4],[5,11],
  [4,7],[4,6],[11,10],[2,7],[0,9],[3,4],[0,1],[0,2],[2,13],
  [13,8],[12,3],[6,4],
];
const AIR_ROUTES: [number,number][] = [
  [0,4],[0,7],[0,5],[0,3],[0,2],[1,4],[1,7],[3,7],[5,7],
];

function slerp(la1:number,lo1:number,la2:number,lo2:number,t:number) {
  const d=(n:number)=>n*Math.PI/180, g=(r:number)=>r*180/Math.PI;
  const [φ1,λ1,φ2,λ2]=[d(la1),d(lo1),d(la2),d(lo2)];
  const v1=[Math.cos(φ1)*Math.cos(λ1),Math.cos(φ1)*Math.sin(λ1),Math.sin(φ1)];
  const v2=[Math.cos(φ2)*Math.cos(λ2),Math.cos(φ2)*Math.sin(λ2),Math.sin(φ2)];
  const dot=Math.min(1,Math.max(-1,v1[0]*v2[0]+v1[1]*v2[1]+v1[2]*v2[2]));
  const om=Math.acos(dot);
  if(Math.abs(om)<1e-4)return{lat:la1,lon:lo1};
  const so=Math.sin(om);
  const[s1,s2]=[Math.sin((1-t)*om)/so,Math.sin(t*om)/so];
  const v=[s1*v1[0]+s2*v2[0],s1*v1[1]+s2*v2[1],s1*v1[2]+s2*v2[2]];
  return{lat:g(Math.asin(v[2])),lon:g(Math.atan2(v[1],v[0]))};
}

interface Props{cx?:number;cy?:number;radiusFactor?:number;opacity?:number}

export default function GlobeCanvas({cx:cxF=0.5,cy:cyF=0.5,radiusFactor=0.38,opacity=1}:Props){
  const canvasRef=useRef<HTMLCanvasElement>(null);

  useEffect(()=>{
    const canvas=canvasRef.current;
    if(!canvas)return;
    const ctx=canvas.getContext("2d") as CanvasRenderingContext2D;
    if(!ctx)return;

    let W=(canvas.width=canvas.offsetWidth);
    let H=(canvas.height=canvas.offsetHeight);
    let raf:number,frame=0,rot=-60;

    const ro=new ResizeObserver(()=>{
      W=canvas.width=canvas.offsetWidth;
      H=canvas.height=canvas.offsetHeight;
    });
    ro.observe(canvas);

    // Ships & planes: t in [0,1), loop continuously
    const ships =SEA_ROUTES.map((_,ri)=>({ri,t:Math.random(),spd:0.0005+Math.random()*0.0007}));
    const planes=AIR_ROUTES.map((_,ri)=>({ri,t:Math.random(),spd:0.0012+Math.random()*0.001}));

    function proj(lat:number,lon:number){
      const R=Math.min(W,H)*radiusFactor;
      const px=W*cxF,py=H*cyF;
      const φ=lat*Math.PI/180;
      const λ=(lon+rot)*Math.PI/180;
      return{x:px+R*Math.cos(φ)*Math.sin(λ),y:py-R*Math.sin(φ),
             z:Math.cos(φ)*Math.cos(λ),R,px,py};
    }

    function draw(){
      raf=requestAnimationFrame(draw);
      frame++;
      rot+=0.05;
      ctx.clearRect(0,0,W,H);
      const R=Math.min(W,H)*radiusFactor;
      const px=W*cxF,py=H*cyF;
      ctx.globalAlpha=opacity;

      // ── 1. Ocean sphere ──────────────────────────────────
      const oc=ctx.createRadialGradient(px-R*.35,py-R*.35,R*.04,px,py,R);
      oc.addColorStop(0,"#2860c8");
      oc.addColorStop(0.3,"#113380");
      oc.addColorStop(0.7,"#071a50");
      oc.addColorStop(1,"#020c25");
      ctx.beginPath();ctx.arc(px,py,R,0,Math.PI*2);
      ctx.fillStyle=oc;ctx.fill();

      ctx.save();
      ctx.beginPath();ctx.arc(px,py,R,0,Math.PI*2);ctx.clip();

      // ── 2. Grid ──────────────────────────────────────────
      ctx.strokeStyle="rgba(80,130,210,0.06)";ctx.lineWidth=0.4;
      for(let lat=-75;lat<=75;lat+=15){
        ctx.beginPath();let f=true;
        for(let lon=0;lon<=362;lon+=2){
          const p=proj(lat,lon);
          if(p.z>0){f?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y);f=false;}else f=true;
        }ctx.stroke();
      }
      for(let lon=0;lon<360;lon+=20){
        ctx.beginPath();let f=true;
        for(let lat=-90;lat<=90;lat+=2){
          const p=proj(lat,lon);
          if(p.z>0){f?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y);f=false;}else f=true;
        }ctx.stroke();
      }

      // ── 3. Continents ────────────────────────────────────
      for(const cont of CONTINENTS){
        const segs:{x:number;y:number}[][]=[];
        let cur:{x:number;y:number}[]=[];
        for(const[lat,lon]of cont){
          const p=proj(lat,lon);
          if(p.z>-0.01)cur.push({x:p.x,y:p.y});
          else if(cur.length){segs.push(cur);cur=[];}
        }
        if(cur.length)segs.push(cur);
        for(const seg of segs){
          if(seg.length<3)continue;
          ctx.beginPath();
          ctx.moveTo(seg[0].x,seg[0].y);
          for(let i=1;i<seg.length;i++)ctx.lineTo(seg[i].x,seg[i].y);
          if(seg.length>=cont.length*0.62){
            ctx.closePath();
            ctx.fillStyle="rgba(65,115,58,0.80)";
            ctx.fill();
          }
          ctx.strokeStyle="rgba(125,200,135,0.90)";
          ctx.lineWidth=0.9;ctx.stroke();
        }
      }

      // ── 4. Sea routes (slightly elevated, gold) ──────────
      ctx.shadowBlur=0;
      for(const[ai,bi]of SEA_ROUTES){
        ctx.beginPath();let f=true;
        for(let s=0;s<=80;s++){
          const t=s/80;
          const{lat,lon}=slerp(PORTS[ai].lat,PORTS[ai].lon,PORTS[bi].lat,PORTS[bi].lon,t);
          const p=proj(lat,lon);
          const elev=1+0.038*Math.sin(t*Math.PI);
          const ex=px+(p.x-px)*elev,ey=py+(p.y-py)*elev;
          if(p.z>-0.05){f?ctx.moveTo(ex,ey):ctx.lineTo(ex,ey);f=false;}else f=true;
        }
        ctx.strokeStyle="rgba(255,195,70,0.48)";ctx.lineWidth=1.1;
        ctx.shadowColor="rgba(255,175,55,0.45)";ctx.shadowBlur=4;
        ctx.stroke();ctx.shadowBlur=0;
      }

      // ── 5. Air routes (high-elevated, dashed blue) ───────
      ctx.setLineDash([4,5]);
      for(const[ai,bi]of AIR_ROUTES){
        ctx.beginPath();let f=true;
        for(let s=0;s<=100;s++){
          const t=s/100;
          const{lat,lon}=slerp(PORTS[ai].lat,PORTS[ai].lon,PORTS[bi].lat,PORTS[bi].lon,t);
          const p=proj(lat,lon);
          const elev=1+0.14*Math.sin(t*Math.PI);
          const ex=px+(p.x-px)*elev,ey=py+(p.y-py)*elev;
          if(p.z>-0.04){f?ctx.moveTo(ex,ey):ctx.lineTo(ex,ey);f=false;}else f=true;
        }
        ctx.strokeStyle="rgba(150,215,255,0.42)";ctx.lineWidth=0.85;
        ctx.shadowColor="rgba(130,205,255,0.38)";ctx.shadowBlur=4;
        ctx.stroke();ctx.shadowBlur=0;
      }
      ctx.setLineDash([]);

      ctx.restore();

      // ── 6. Atmosphere layers ─────────────────────────────
      const a1=ctx.createRadialGradient(px,py,R*.89,px,py,R*1.09);
      a1.addColorStop(0,"rgba(60,120,250,0.17)");a1.addColorStop(1,"transparent");
      ctx.beginPath();ctx.arc(px,py,R*1.09,0,Math.PI*2);ctx.fillStyle=a1;ctx.fill();

      const a2=ctx.createRadialGradient(px,py,R,px,py,R*1.2);
      a2.addColorStop(0,"rgba(35,80,190,0.07)");a2.addColorStop(1,"transparent");
      ctx.beginPath();ctx.arc(px,py,R*1.2,0,Math.PI*2);ctx.fillStyle=a2;ctx.fill();

      // Specular highlight (top-left)
      const sp=ctx.createRadialGradient(px-R*.42,py-R*.42,0,px-R*.3,py-R*.3,R*.72);
      sp.addColorStop(0,"rgba(210,235,255,0.10)");sp.addColorStop(1,"transparent");
      ctx.beginPath();ctx.arc(px,py,R,0,Math.PI*2);ctx.fillStyle=sp;ctx.fill();

      // Limb darkening (edge shadow)
      const ld=ctx.createRadialGradient(px,py,R*.8,px,py,R);
      ld.addColorStop(0,"transparent");ld.addColorStop(1,"rgba(1,7,28,0.40)");
      ctx.beginPath();ctx.arc(px,py,R,0,Math.PI*2);ctx.fillStyle=ld;ctx.fill();

      // ── 7. Port beacons ──────────────────────────────────
      PORTS.forEach(({lat,lon},i)=>{
        const p=proj(lat,lon);if(p.z<0)return;
        const pulse=(Math.sin(frame*.025+i)+1)/2;
        ctx.beginPath();ctx.arc(p.x,p.y,5+pulse*8,0,Math.PI*2);
        ctx.strokeStyle=`rgba(201,164,82,${.32*pulse*p.z})`;
        ctx.lineWidth=1;ctx.stroke();
        ctx.beginPath();ctx.arc(p.x,p.y,2.8,0,Math.PI*2);
        ctx.fillStyle=`rgba(255,205,90,${.85+.15*p.z})`;
        ctx.shadowColor="rgba(255,172,60,0.95)";ctx.shadowBlur=12;
        ctx.fill();ctx.shadowBlur=0;
      });

      // ── 8. Ships (white-blue, trail) ─────────────────────
      ships.forEach(s=>{
        s.t=(s.t+s.spd)%1;
        const[ai,bi]=SEA_ROUTES[s.ri];
        // Trail
        for(let tr=7;tr>=1;tr--){
          const tT=(s.t-tr*.015+1)%1;
          const{lat:tla,lon:tlo}=slerp(PORTS[ai].lat,PORTS[ai].lon,PORTS[bi].lat,PORTS[bi].lon,tT);
          const tp=proj(tla,tlo);if(tp.z<0)continue;
          ctx.beginPath();ctx.arc(tp.x,tp.y,1.4,0,Math.PI*2);
          ctx.fillStyle=`rgba(190,235,255,${(8-tr)/8*.42})`;ctx.fill();
        }
        const{lat,lon}=slerp(PORTS[ai].lat,PORTS[ai].lon,PORTS[bi].lat,PORTS[bi].lon,s.t);
        const p=proj(lat,lon);if(p.z<0)return;
        const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,8);
        g.addColorStop(0,"rgba(200,242,255,.75)");g.addColorStop(1,"transparent");
        ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,8,0,Math.PI*2);ctx.fill();
        ctx.beginPath();ctx.arc(p.x,p.y,2.6,0,Math.PI*2);
        ctx.fillStyle="rgba(220,248,255,1)";
        ctx.shadowColor="rgba(130,220,255,.95)";ctx.shadowBlur=11;
        ctx.fill();ctx.shadowBlur=0;
      });

      // ── 9. Airplanes (bright, elevated, long trail) ──────
      planes.forEach(s=>{
        s.t=(s.t+s.spd)%1;
        const[ai,bi]=AIR_ROUTES[s.ri];
        // Long trail
        for(let tr=20;tr>=1;tr--){
          const tT=(s.t-tr*.013+1)%1;
          const{lat:tla,lon:tlo}=slerp(PORTS[ai].lat,PORTS[ai].lon,PORTS[bi].lat,PORTS[bi].lon,tT);
          const tp=proj(tla,tlo);if(tp.z<0)continue;
          const te=1+0.14*Math.sin(tT*Math.PI);
          const tx=px+(tp.x-px)*te,ty=py+(tp.y-py)*te;
          const a=(21-tr)/21*.55,r=Math.max(0.5,2.8-tr*.12);
          ctx.beginPath();ctx.arc(tx,ty,r,0,Math.PI*2);
          ctx.fillStyle=`rgba(175,228,255,${a})`;ctx.fill();
        }
        const{lat,lon}=slerp(PORTS[ai].lat,PORTS[ai].lon,PORTS[bi].lat,PORTS[bi].lon,s.t);
        const p=proj(lat,lon);if(p.z<0)return;
        const pe=1+0.14*Math.sin(s.t*Math.PI);
        const ex=px+(p.x-px)*pe,ey=py+(p.y-py)*pe;
        // Outer glow
        const g=ctx.createRadialGradient(ex,ey,0,ex,ey,16);
        g.addColorStop(0,"rgba(195,235,255,.65)");g.addColorStop(1,"transparent");
        ctx.fillStyle=g;ctx.beginPath();ctx.arc(ex,ey,16,0,Math.PI*2);ctx.fill();
        // Core dot (5px radius)
        ctx.beginPath();ctx.arc(ex,ey,5,0,Math.PI*2);
        ctx.fillStyle="rgba(245,252,255,1)";
        ctx.shadowColor="rgba(175,235,255,1)";ctx.shadowBlur=22;
        ctx.fill();ctx.shadowBlur=0;
      });

      ctx.globalAlpha=1;
    }

    draw();
    return()=>{cancelAnimationFrame(raf);ro.disconnect();};
  },[cxF,cyF,radiusFactor,opacity]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none"/>;
}
