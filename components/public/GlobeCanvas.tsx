"use client";
import { useRef, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

// ─── Ports & routes ───────────────────────────────────────────────────────────
const PORTS = [
  { lat: 13.0,   lon:  80.3  }, // 0  Chennai
  { lat: 18.9,   lon:  72.9  }, // 1  Mumbai
  { lat: 22.3,   lon: 114.2  }, // 2  Hong Kong
  { lat:  1.3,   lon: 103.8  }, // 3  Singapore
  { lat: 51.9,   lon:   4.5  }, // 4  Rotterdam
  { lat: 25.2,   lon:  55.3  }, // 5  Dubai
  { lat: 37.9,   lon:  23.7  }, // 6  Piraeus
  { lat: 40.7,   lon: -74.0  }, // 7  New York
  { lat: 34.6,   lon: 135.5  }, // 8  Osaka
  { lat: -1.3,   lon:  36.8  }, // 9  Mombasa
  { lat:-33.9,   lon:  18.4  }, // 10 Cape Town
  { lat: 29.9,   lon:  32.6  }, // 11 Suez
  { lat: 22.5,   lon:  88.3  }, // 12 Kolkata
  { lat: 31.2,   lon: 121.5  }, // 13 Shanghai
  { lat: 33.7,   lon:-118.2  }, // 14 Los Angeles
  { lat:-33.87,  lon: 151.21 }, // 15 Sydney
];

const SEA_ROUTES: [number, number][] = [
  [0,5],[0,3],[0,11],[1,5],[1,3],[3,2],[3,8],[5,4],[5,11],
  [4,7],[4,6],[11,10],[2,7],[0,9],[3,4],[0,1],[0,2],[2,13],[13,8],[12,3],[6,4],
  // Pacific routes — fill the empty ocean between Americas and Asia-Pacific
  [14,2],[14,8],[14,3],[15,8],[15,3],[15,10],[14,15],
];

const AIR_ROUTES: [number, number][] = [
  [0,4],[0,7],[0,5],[0,3],[0,2],[1,4],[1,7],[3,7],[5,7],
  // Trans-Pacific air routes
  [14,4],[14,8],[15,5],
];

const R = 1.0;
const D2R = Math.PI / 180;

// lat/lon → 3D point on sphere, aligned with equirectangular texture UVs
function ll2v(lat: number, lon: number, r = R): THREE.Vector3 {
  const phi   = (90 - lat) * D2R;
  const theta = lon * D2R;
  return new THREE.Vector3(
     r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
    -r * Math.sin(phi) * Math.sin(theta),
  );
}

// Great-circle arc with elevation peak at midpoint
function arcPoints(la1: number, lo1: number, la2: number, lo2: number, n: number, elev: number): THREE.Vector3[] {
  const a = ll2v(la1, lo1).normalize();
  const b = ll2v(la2, lo2).normalize();
  const out: THREE.Vector3[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const v = new THREE.Vector3().lerpVectors(a, b, t).normalize();
    out.push(v.clone().multiplyScalar(R * (1 + elev * Math.sin(t * Math.PI))));
  }
  return out;
}

// ─── Sprite textures ──────────────────────────────────────────────────────────
function makeDotTexture(): THREE.Texture {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0.0,  "rgba(255,255,255,1)");
  grad.addColorStop(0.25, "rgba(255,255,255,0.95)");
  grad.addColorStop(0.55, "rgba(255,255,255,0.35)");
  grad.addColorStop(1.0,  "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.needsUpdate = true;
  return t;
}

// Top-view ship silhouette: pointed bow, rectangular hull, bridge
function makeShipTexture(): THREE.Texture {
  const s = 128, cx = 64, cy = 64;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const g = c.getContext("2d")!;
  g.clearRect(0, 0, s, s);

  // Glow halo
  const halo = g.createRadialGradient(cx, cy, 6, cx, cy, 44);
  halo.addColorStop(0,   "rgba(120, 200, 255, 0.55)");
  halo.addColorStop(1,   "rgba(30,  100, 220, 0)");
  g.fillStyle = halo;
  g.fillRect(0, 0, s, s);

  // Hull
  g.fillStyle = "rgba(200, 235, 255, 0.96)";
  g.beginPath();
  g.moveTo(cx,      20);   // bow tip
  g.lineTo(cx + 16, 40);   // right shoulder
  g.lineTo(cx + 16, 92);   // right stern
  g.lineTo(cx - 16, 92);   // left stern
  g.lineTo(cx - 16, 40);   // left shoulder
  g.closePath();
  g.fill();

  // Superstructure / bridge
  g.fillStyle = "rgba(255,255,255,1)";
  g.fillRect(cx - 9, 48, 18, 20);

  // Funnel dot
  g.beginPath();
  g.arc(cx, 54, 4, 0, Math.PI * 2);
  g.fillStyle = "rgba(255,220,100,0.9)";
  g.fill();

  const t = new THREE.CanvasTexture(c);
  t.needsUpdate = true;
  return t;
}

// Top-view airplane: fuselage + swept wings + tail fins
function makePlaneTexture(): THREE.Texture {
  const s = 128, cx = 64, cy = 64;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const g = c.getContext("2d")!;
  g.clearRect(0, 0, s, s);

  // Glow halo
  const halo = g.createRadialGradient(cx, cy, 6, cx, cy, 50);
  halo.addColorStop(0,   "rgba(160, 210, 255, 0.5)");
  halo.addColorStop(1,   "rgba(60,  140, 255, 0)");
  g.fillStyle = halo;
  g.fillRect(0, 0, s, s);

  g.fillStyle = "rgba(255,255,255,0.97)";

  // Fuselage
  g.beginPath();
  g.ellipse(cx, cy, 5, 30, 0, 0, Math.PI * 2);
  g.fill();

  // Main wings (swept)
  g.beginPath();
  g.moveTo(cx,      cy - 4);
  g.lineTo(cx - 46, cy + 12);
  g.lineTo(cx - 34, cy + 18);
  g.lineTo(cx,      cy + 6);
  g.lineTo(cx + 34, cy + 18);
  g.lineTo(cx + 46, cy + 12);
  g.closePath();
  g.fill();

  // Tail fins
  g.beginPath();
  g.moveTo(cx,      cy + 22);
  g.lineTo(cx - 18, cy + 36);
  g.lineTo(cx - 12, cy + 40);
  g.lineTo(cx,      cy + 28);
  g.lineTo(cx + 12, cy + 40);
  g.lineTo(cx + 18, cy + 36);
  g.closePath();
  g.fill();

  const t = new THREE.CanvasTexture(c);
  t.needsUpdate = true;
  return t;
}

// ─── Earth surface: real NASA texture recolored to blue ocean + green land ────
function EarthSurface() {
  const tex = useLoader(THREE.TextureLoader, "/earth-day.jpg");

  const material = useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return new THREE.ShaderMaterial({
      uniforms: { dayTex: { value: tex } },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormalV;
        void main(){
          vUv = uv;
          vNormalV = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D dayTex;
        varying vec2 vUv;
        varying vec3 vNormalV;
        void main(){
          vec3 t = texture2D(dayTex, vUv).rgb;
          bool isOcean = (t.b > t.r + 0.015) && (t.b > t.g - 0.02) && (t.b > 0.12);
          vec3 oceanDeep = vec3(0.020, 0.16, 0.52);
          vec3 oceanShlw = vec3(0.06,  0.34, 0.78);
          vec3 ocean = mix(oceanDeep, oceanShlw, clamp(t.b * 1.6, 0.0, 1.0));
          vec3 landLow  = vec3(0.10, 0.42, 0.20);
          vec3 landHigh = vec3(0.22, 0.62, 0.30);
          float lum = dot(t, vec3(0.299, 0.587, 0.114));
          vec3 land = mix(landLow, landHigh, clamp(lum * 1.4, 0.0, 1.0));
          vec3 base = isOcean ? ocean : land;
          float diff = max(dot(vNormalV, vec3(0.35, 0.35, 1.0)), 0.0);
          vec3 col = base * (0.72 + 0.45 * diff);
          float rim = pow(1.0 - max(vNormalV.z, 0.0), 3.0);
          col += vec3(0.10, 0.30, 0.65) * rim * 0.5;
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
  }, [tex]);

  return (
    <mesh>
      <sphereGeometry args={[R, 96, 96]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

// ─── Atmosphere glow ──────────────────────────────────────────────────────────
const ATMO_VERT = `
  varying vec3 vNormal;
  void main(){
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }
`;

function Atmosphere() {
  const outer = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: ATMO_VERT,
    fragmentShader: `
      varying vec3 vNormal;
      void main(){
        float i = pow(max(0.0, 0.78 - dot(vNormal, vec3(0,0,1))), 4.6) * 3.4;
        gl_FragColor = vec4(0.20, 0.55, 1.0, 1.0) * i;
      }`,
    blending: THREE.AdditiveBlending, side: THREE.BackSide,
    transparent: true, depthWrite: false,
  }), []);
  const inner = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: ATMO_VERT,
    fragmentShader: `
      varying vec3 vNormal;
      void main(){
        float i = pow(max(0.0, 0.60 - dot(vNormal, vec3(0,0,1))), 3.4) * 1.5;
        gl_FragColor = vec4(0.12, 0.42, 0.96, 1.0) * i;
      }`,
    blending: THREE.AdditiveBlending, side: THREE.FrontSide,
    transparent: true, depthWrite: false,
  }), []);
  return (
    <>
      <mesh><sphereGeometry args={[R * 1.22, 64, 64]} /><primitive object={outer} attach="material" /></mesh>
      <mesh><sphereGeometry args={[R * 1.035, 64, 64]} /><primitive object={inner} attach="material" /></mesh>
    </>
  );
}

// ─── Route arc lines ──────────────────────────────────────────────────────────
function RouteLines() {
  const { seaObj, airObj } = useMemo(() => {
    const sp: number[] = [], ap: number[] = [];
    for (const [ai, bi] of SEA_ROUTES) {
      const pts = arcPoints(PORTS[ai].lat, PORTS[ai].lon, PORTS[bi].lat, PORTS[bi].lon, 64, 0.045);
      for (let i = 0; i < pts.length - 1; i++)
        sp.push(pts[i].x, pts[i].y, pts[i].z, pts[i+1].x, pts[i+1].y, pts[i+1].z);
    }
    for (const [ai, bi] of AIR_ROUTES) {
      const pts = arcPoints(PORTS[ai].lat, PORTS[ai].lon, PORTS[bi].lat, PORTS[bi].lon, 80, 0.18);
      for (let i = 0; i < pts.length - 1; i++)
        ap.push(pts[i].x, pts[i].y, pts[i].z, pts[i+1].x, pts[i+1].y, pts[i+1].z);
    }
    const mk = (pos: number[], color: number, opacity: number) => {
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      return new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color, opacity, transparent: true }));
    };
    return { seaObj: mk(sp, 0xffd277, 0.34), airObj: mk(ap, 0x55ddff, 0.30) };
  }, []);
  return <><primitive object={seaObj} /><primitive object={airObj} /></>;
}

// ─── Port beacons ─────────────────────────────────────────────────────────────
function PortMarkers({ dot }: { dot: THREE.Texture }) {
  const geom = useMemo(() => {
    const pos = new Float32Array(PORTS.length * 3);
    PORTS.forEach((p, i) => {
      const v = ll2v(p.lat, p.lon, R * 1.012);
      pos[i*3] = v.x; pos[i*3+1] = v.y; pos[i*3+2] = v.z;
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    return g;
  }, []);
  const mat = useMemo(() => new THREE.PointsMaterial({
    color: 0xffd24a, size: 0.06, map: dot, transparent: true,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
  }), [dot]);
  const obj = useMemo(() => new THREE.Points(geom, mat), [geom, mat]);
  useFrame(({ clock }) => { mat.size = 0.052 + 0.022 * Math.abs(Math.sin(clock.getElapsedTime() * 1.8)); });
  return <primitive object={obj} />;
}

// ─── Traveling light particles along routes ──────────────────────────────────
const SEA_PARTS = 70, AIR_PARTS = 36;
function RouteParticles({ dot }: { dot: THREE.Texture }) {
  const { seaParts, airParts } = useMemo(() => {
    const sc = SEA_ROUTES.map(([ai, bi]) => {
      const c = new THREE.CatmullRomCurve3(arcPoints(PORTS[ai].lat, PORTS[ai].lon, PORTS[bi].lat, PORTS[bi].lon, 80, 0.045));
      c.arcLengthDivisions = 100; return c;
    });
    const ac = AIR_ROUTES.map(([ai, bi]) => {
      const c = new THREE.CatmullRomCurve3(arcPoints(PORTS[ai].lat, PORTS[ai].lon, PORTS[bi].lat, PORTS[bi].lon, 80, 0.18));
      c.arcLengthDivisions = 100; return c;
    });
    return {
      seaParts: Array.from({ length: SEA_PARTS }, (_, i) => ({ curve: sc[i % sc.length], t: Math.random(), spd: 0.009 + Math.random() * 0.007 })),
      airParts: Array.from({ length: AIR_PARTS }, (_, i) => ({ curve: ac[i % ac.length], t: Math.random(), spd: 0.024 + Math.random() * 0.018 })),
    };
  }, []);
  const seaGeom = useMemo(() => { const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(SEA_PARTS*3), 3)); return g; }, []);
  const airGeom = useMemo(() => { const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(AIR_PARTS*3), 3)); return g; }, []);
  const seaMat = useMemo(() => new THREE.PointsMaterial({ color: 0xffd277, size: 0.034, map: dot, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true }), [dot]);
  const airMat = useMemo(() => new THREE.PointsMaterial({ color: 0x88eeff, size: 0.038, map: dot, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true }), [dot]);
  const seaObj = useMemo(() => new THREE.Points(seaGeom, seaMat), [seaGeom, seaMat]);
  const airObj = useMemo(() => new THREE.Points(airGeom, airMat), [airGeom, airMat]);
  useFrame((_, delta) => {
    const sp = seaGeom.getAttribute("position") as THREE.BufferAttribute;
    const ap = airGeom.getAttribute("position") as THREE.BufferAttribute;
    seaParts.forEach((p, i) => { p.t = (p.t + p.spd * delta) % 1; const v = p.curve.getPointAt(p.t); sp.setXYZ(i, v.x, v.y, v.z); });
    airParts.forEach((p, i) => { p.t = (p.t + p.spd * delta) % 1; const v = p.curve.getPointAt(p.t); ap.setXYZ(i, v.x, v.y, v.z); });
    sp.needsUpdate = true; ap.needsUpdate = true;
  });
  return <><primitive object={seaObj} /><primitive object={airObj} /></>;
}

// ─── Ships on sea routes + planes on air routes ───────────────────────────────
interface VehicleProps { dot: THREE.Texture; ship: THREE.Texture; plane: THREE.Texture }
const SHIP_TRAIL = 14, PLANE_TRAIL = 30;

function MovingVehicles({ dot, ship, plane }: VehicleProps) {
  const seaCurves = useMemo(() => SEA_ROUTES.map(([ai, bi]) => {
    const c = new THREE.CatmullRomCurve3(arcPoints(PORTS[ai].lat, PORTS[ai].lon, PORTS[bi].lat, PORTS[bi].lon, 80, 0.045));
    c.arcLengthDivisions = 150; return c;
  }), []);
  const airCurves = useMemo(() => AIR_ROUTES.map(([ai, bi]) => {
    const c = new THREE.CatmullRomCurve3(arcPoints(PORTS[ai].lat, PORTS[ai].lon, PORTS[bi].lat, PORTS[bi].lon, 80, 0.20));
    c.arcLengthDivisions = 150; return c;
  }), []);

  const ships  = useRef(SEA_ROUTES.map(() => ({ t: Math.random(), spd: 0.010 + Math.random() * 0.006 })));
  const planes = useRef(AIR_ROUTES.map(() => ({ t: Math.random(), spd: 0.026 + Math.random() * 0.016 })));

  const mk = (n: number) => { const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(n * 3), 3)); return g; };

  const shipSpriteGeom = useMemo(() => mk(SEA_ROUTES.length), []);
  const shipTrailGeom  = useMemo(() => mk(SEA_ROUTES.length * SHIP_TRAIL), []);
  const planeSpriteGeom = useMemo(() => mk(AIR_ROUTES.length), []);
  const planeTrailGeom  = useMemo(() => mk(AIR_ROUTES.length * PLANE_TRAIL), []);

  // Ship sprite — illustrative boat icon, large enough to be clearly visible
  const shipSpriteMat = useMemo(() => new THREE.PointsMaterial({
    color: 0xffffff, size: 0.15, map: ship, transparent: true,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
  }), [ship]);

  // Ship wake trail
  const shipTrailMat = useMemo(() => new THREE.PointsMaterial({
    color: 0x9fe6ff, size: 0.032, map: dot, transparent: true, opacity: 0.55,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
  }), [dot]);

  // Plane sprite — illustrative aircraft icon, large and bright
  const planeSpriteMat = useMemo(() => new THREE.PointsMaterial({
    color: 0xffffff, size: 0.19, map: plane, transparent: true,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
  }), [plane]);

  // Plane contrail
  const planeTrailMat = useMemo(() => new THREE.PointsMaterial({
    color: 0xaaddff, size: 0.038, map: dot, transparent: true, opacity: 0.50,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
  }), [dot]);

  const shipSpriteObj  = useMemo(() => new THREE.Points(shipSpriteGeom,  shipSpriteMat),  [shipSpriteGeom,  shipSpriteMat]);
  const shipTrailObj   = useMemo(() => new THREE.Points(shipTrailGeom,   shipTrailMat),   [shipTrailGeom,   shipTrailMat]);
  const planeSpriteObj = useMemo(() => new THREE.Points(planeSpriteGeom, planeSpriteMat), [planeSpriteGeom, planeSpriteMat]);
  const planeTrailObj  = useMemo(() => new THREE.Points(planeTrailGeom,  planeTrailMat),  [planeTrailGeom,  planeTrailMat]);

  useFrame((_, delta) => {
    const sd = shipSpriteGeom.getAttribute("position")  as THREE.BufferAttribute;
    const st = shipTrailGeom.getAttribute("position")   as THREE.BufferAttribute;
    const pd = planeSpriteGeom.getAttribute("position") as THREE.BufferAttribute;
    const pt = planeTrailGeom.getAttribute("position")  as THREE.BufferAttribute;

    ships.current.forEach((s, i) => {
      s.t = (s.t + s.spd * delta) % 1;
      const p = seaCurves[i].getPointAt(s.t).multiplyScalar(1.013);
      sd.setXYZ(i, p.x, p.y, p.z);
      for (let tr = 0; tr < SHIP_TRAIL; tr++) {
        const tp = seaCurves[i].getPointAt(((s.t - (tr + 1) * 0.006) % 1 + 1) % 1).multiplyScalar(1.013);
        st.setXYZ(i * SHIP_TRAIL + tr, tp.x, tp.y, tp.z);
      }
    });

    planes.current.forEach((s, i) => {
      s.t = (s.t + s.spd * delta) % 1;
      const p = airCurves[i].getPointAt(s.t);
      pd.setXYZ(i, p.x, p.y, p.z);
      for (let tr = 0; tr < PLANE_TRAIL; tr++) {
        const tp = airCurves[i].getPointAt(((s.t - (tr + 1) * 0.005) % 1 + 1) % 1);
        pt.setXYZ(i * PLANE_TRAIL + tr, tp.x, tp.y, tp.z);
      }
    });

    sd.needsUpdate = true; st.needsUpdate = true;
    pd.needsUpdate = true; pt.needsUpdate = true;
  });

  return (
    <>
      <primitive object={shipTrailObj} />
      <primitive object={shipSpriteObj} />
      <primitive object={planeTrailObj} />
      <primitive object={planeSpriteObj} />
    </>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────
interface SceneProps { cx: number; cy: number }
function GlobeScene({ cx, cy }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const mouse    = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  const dot   = useMemo(() => makeDotTexture(),   []);
  const ship  = useMemo(() => makeShipTexture(),  []);
  const plane = useMemo(() => makePlaneTexture(), []);

  const offX =  (cx - 0.5) * viewport.width;
  const offY = -(cy - 0.5) * viewport.height;

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", fn, { passive: true });
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.075;
    groupRef.current.position.y = offY + Math.sin(clock.getElapsedTime() * 0.5) * 0.035;
    const tx = mouse.current.y * 0.16;
    groupRef.current.rotation.x += (tx - groupRef.current.rotation.x) * 0.04;
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[-5, 3.5, 4]} intensity={1.6} color={0xffffff} />
      <group ref={groupRef} position={[offX, offY, 0]} rotation={[0.22, 0, 0]}>
        <Suspense fallback={null}>
          <EarthSurface />
        </Suspense>
        <Atmosphere />
        <RouteLines />
        <PortMarkers dot={dot} />
        <RouteParticles dot={dot} />
        <MovingVehicles dot={dot} ship={ship} plane={plane} />
      </group>
    </>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────
interface Props { cx?: number; cy?: number; opacity?: number }
export default function GlobeCanvas({ cx = 0.5, cy = 0.5, opacity = 1 }: Props) {
  return (
    <div style={{ width: "100%", height: "100%", opacity }}>
      <Canvas
        style={{ width: "100%", height: "100%" }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 2.7], fov: 44 }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Stars radius={130} depth={60} count={2600} factor={4} saturation={0} fade speed={0.35} />
          <GlobeScene cx={cx} cy={cy} />
        </Suspense>
      </Canvas>
    </div>
  );
}
