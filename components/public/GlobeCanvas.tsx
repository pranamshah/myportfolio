"use client";
import { useRef, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import { CONTINENTS } from "./worldOutline";

// ─── Ports & routes ───────────────────────────────────────────────────────────
const PORTS = [
  { lat: 13.0, lon:  80.3 }, // 0  Chennai
  { lat: 18.9, lon:  72.9 }, // 1  Mumbai
  { lat: 22.3, lon: 114.2 }, // 2  Hong Kong
  { lat:  1.3, lon: 103.8 }, // 3  Singapore
  { lat: 51.9, lon:   4.5 }, // 4  Rotterdam
  { lat: 25.2, lon:  55.3 }, // 5  Dubai
  { lat: 37.9, lon:  23.7 }, // 6  Piraeus
  { lat: 40.7, lon: -74.0 }, // 7  New York
  { lat: 34.6, lon: 135.5 }, // 8  Osaka
  { lat: -1.3, lon:  36.8 }, // 9  Mombasa
  { lat:-33.9, lon:  18.4 }, // 10 Cape Town
  { lat: 29.9, lon:  32.6 }, // 11 Suez
  { lat: 22.5, lon:  88.3 }, // 12 Kolkata
  { lat: 31.2, lon: 121.5 }, // 13 Shanghai
];
const SEA_ROUTES: [number, number][] = [
  [0,5],[0,3],[0,11],[1,5],[1,3],[3,2],[3,8],[5,4],[5,11],
  [4,7],[4,6],[11,10],[2,7],[0,9],[3,4],[0,1],[0,2],[2,13],[13,8],[12,3],[6,4],
];
const AIR_ROUTES: [number, number][] = [
  [0,4],[0,7],[0,5],[0,3],[0,2],[1,4],[1,7],[3,7],[5,7],
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const R = 1.0;

function ll2v(lat: number, lon: number, r = R): THREE.Vector3 {
  const phi   = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta),
  );
}

// Spherical arc with optional elevation peak at midpoint
function arcPoints(
  la1: number, lo1: number, la2: number, lo2: number, n: number, elev: number,
): THREE.Vector3[] {
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

// ─── Atmosphere shader ────────────────────────────────────────────────────────
const VERT = `
  varying vec3 vNormal;
  void main(){
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }
`;

function Atmosphere() {
  const outerMat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: `
      varying vec3 vNormal;
      void main(){
        float i = pow(max(0.0, 0.78 - dot(vNormal, vec3(0,0,1))), 4.8) * 3.5;
        gl_FragColor = vec4(0.18, 0.52, 1.0, 1.0) * i;
      }`,
    blending: THREE.AdditiveBlending, side: THREE.BackSide,
    transparent: true, depthWrite: false,
  }), []);

  const innerMat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: `
      varying vec3 vNormal;
      void main(){
        float i = pow(max(0.0, 0.60 - dot(vNormal, vec3(0,0,1))), 3.5) * 1.6;
        gl_FragColor = vec4(0.10, 0.40, 0.95, 1.0) * i;
      }`,
    blending: THREE.AdditiveBlending, side: THREE.FrontSide,
    transparent: true, depthWrite: false,
  }), []);

  return (
    <>
      <mesh>
        <sphereGeometry args={[R * 1.22, 64, 64]} />
        <primitive object={outerMat} attach="material" />
      </mesh>
      <mesh>
        <sphereGeometry args={[R * 1.04, 64, 64]} />
        <primitive object={innerMat} attach="material" />
      </mesh>
    </>
  );
}

// ─── Ocean sphere ─────────────────────────────────────────────────────────────
function Ocean() {
  return (
    <mesh>
      <sphereGeometry args={[R, 72, 72]} />
      <meshPhongMaterial
        color={new THREE.Color(0x071a4e)}
        emissive={new THREE.Color(0x020c22)}
        specular={new THREE.Color(0x1a55dd)}
        shininess={60}
      />
    </mesh>
  );
}

// ─── Grid lines ───────────────────────────────────────────────────────────────
function GridLines() {
  const obj = useMemo(() => {
    const pos: number[] = [];
    for (let lat = -75; lat <= 75; lat += 15) {
      for (let i = 0; i < 360; i++) {
        const v1 = ll2v(lat, i, R * 1.0004);
        const v2 = ll2v(lat, i + 1, R * 1.0004);
        pos.push(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);
      }
    }
    for (let lon = 0; lon < 360; lon += 20) {
      for (let i = -89; i < 89; i++) {
        const v1 = ll2v(i, lon, R * 1.0004);
        const v2 = ll2v(i + 1, lon, R * 1.0004);
        pos.push(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    const m = new THREE.LineBasicMaterial({ color: 0x1a3880, opacity: 0.10, transparent: true });
    return new THREE.LineSegments(g, m);
  }, []);
  return <primitive object={obj} />;
}

// ─── Continent outlines ───────────────────────────────────────────────────────
function ContinentLines() {
  const obj = useMemo(() => {
    const pos: number[] = [];
    for (const cont of CONTINENTS) {
      for (let i = 0; i < cont.length - 1; i++) {
        const [la1, lo1] = cont[i];
        const [la2, lo2] = cont[i + 1];
        const v1 = ll2v(la1, lo1, R * 1.0012);
        const v2 = ll2v(la2, lo2, R * 1.0012);
        pos.push(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    const m = new THREE.LineBasicMaterial({ color: 0x3ecf5c, opacity: 0.80, transparent: true });
    return new THREE.LineSegments(g, m);
  }, []);
  return <primitive object={obj} />;
}

// ─── Static route arcs ────────────────────────────────────────────────────────
function RouteLines() {
  const { seaObj, airObj } = useMemo(() => {
    const sp: number[] = [], ap: number[] = [];
    for (const [ai, bi] of SEA_ROUTES) {
      const pts = arcPoints(PORTS[ai].lat, PORTS[ai].lon, PORTS[bi].lat, PORTS[bi].lon, 64, 0.042);
      for (let i = 0; i < pts.length - 1; i++)
        sp.push(pts[i].x, pts[i].y, pts[i].z, pts[i+1].x, pts[i+1].y, pts[i+1].z);
    }
    for (const [ai, bi] of AIR_ROUTES) {
      const pts = arcPoints(PORTS[ai].lat, PORTS[ai].lon, PORTS[bi].lat, PORTS[bi].lon, 80, 0.17);
      for (let i = 0; i < pts.length - 1; i++)
        ap.push(pts[i].x, pts[i].y, pts[i].z, pts[i+1].x, pts[i+1].y, pts[i+1].z);
    }
    const mk = (pos: number[], color: number, opacity: number) => {
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      const m = new THREE.LineBasicMaterial({ color, opacity, transparent: true });
      return new THREE.LineSegments(g, m);
    };
    return { seaObj: mk(sp, 0xc9a452, 0.40), airObj: mk(ap, 0x44ddff, 0.28) };
  }, []);
  return <><primitive object={seaObj} /><primitive object={airObj} /></>;
}

// ─── Port beacons ─────────────────────────────────────────────────────────────
function PortMarkers() {
  const portPositions = useMemo(() => PORTS.map(p => ll2v(p.lat, p.lon, R * 1.005)), []);

  const coreGeom = useMemo(() => {
    const pos = new Float32Array(PORTS.length * 3);
    portPositions.forEach((v, i) => { pos[i*3]=v.x; pos[i*3+1]=v.y; pos[i*3+2]=v.z; });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    return g;
  }, [portPositions]);

  const pulseGeom = useMemo(() => {
    const pos = new Float32Array(PORTS.length * 3);
    portPositions.forEach((v, i) => {
      const vv = v.clone().multiplyScalar(1.004);
      pos[i*3]=vv.x; pos[i*3+1]=vv.y; pos[i*3+2]=vv.z;
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    return g;
  }, [portPositions]);

  const coreMat  = useMemo(() => new THREE.PointsMaterial({ color: 0xffcc44, size: 0.028, sizeAttenuation: true }), []);
  const pulseMat = useMemo(() => new THREE.PointsMaterial({ color: 0xffee88, size: 0.042, sizeAttenuation: true, transparent: true, opacity: 0.55 }), []);

  const coreObj  = useMemo(() => new THREE.Points(coreGeom,  coreMat),  [coreGeom,  coreMat]);
  const pulseObj = useMemo(() => new THREE.Points(pulseGeom, pulseMat), [pulseGeom, pulseMat]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    pulseMat.size    = 0.038 + 0.020 * Math.sin(t * 2.0);
    pulseMat.opacity = 0.35  + 0.55  * Math.abs(Math.sin(t * 1.6));
  });

  return <><primitive object={coreObj} /><primitive object={pulseObj} /></>;
}

// ─── Traveling particles along routes ─────────────────────────────────────────
const SEA_PART_COUNT = 55;
const AIR_PART_COUNT = 28;

function RouteParticles() {
  const { seaCurves, airCurves, seaParts, airParts } = useMemo(() => {
    const sc = SEA_ROUTES.map(([ai, bi]) => {
      const c = new THREE.CatmullRomCurve3(arcPoints(PORTS[ai].lat, PORTS[ai].lon, PORTS[bi].lat, PORTS[bi].lon, 80, 0.042));
      c.arcLengthDivisions = 100; return c;
    });
    const ac = AIR_ROUTES.map(([ai, bi]) => {
      const c = new THREE.CatmullRomCurve3(arcPoints(PORTS[ai].lat, PORTS[ai].lon, PORTS[bi].lat, PORTS[bi].lon, 80, 0.17));
      c.arcLengthDivisions = 100; return c;
    });
    return {
      seaCurves: sc, airCurves: ac,
      seaParts: Array.from({ length: SEA_PART_COUNT }, (_, i) => ({
        curve: sc[i % sc.length], t: Math.random(), spd: 0.009 + Math.random() * 0.007,
      })),
      airParts: Array.from({ length: AIR_PART_COUNT }, (_, i) => ({
        curve: ac[i % ac.length], t: Math.random(), spd: 0.025 + Math.random() * 0.018,
      })),
    };
  }, []);

  const seaGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(SEA_PART_COUNT * 3), 3));
    return g;
  }, []);
  const airGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(AIR_PART_COUNT * 3), 3));
    return g;
  }, []);

  const seaMat = useMemo(() => new THREE.PointsMaterial({ color: 0xffcc44, size: 0.018, sizeAttenuation: true, transparent: true, opacity: 0.90 }), []);
  const airMat = useMemo(() => new THREE.PointsMaterial({ color: 0x66eeff, size: 0.022, sizeAttenuation: true, transparent: true, opacity: 0.90 }), []);
  const seaObj = useMemo(() => new THREE.Points(seaGeom, seaMat), [seaGeom, seaMat]);
  const airObj = useMemo(() => new THREE.Points(airGeom, airMat), [airGeom, airMat]);

  useFrame((_, delta) => {
    const sp = seaGeom.getAttribute("position") as THREE.BufferAttribute;
    const ap = airGeom.getAttribute("position") as THREE.BufferAttribute;
    seaParts.forEach((p, i) => {
      p.t = (p.t + p.spd * delta) % 1;
      const v = p.curve.getPointAt(p.t);
      sp.setXYZ(i, v.x, v.y, v.z);
    });
    airParts.forEach((p, i) => {
      p.t = (p.t + p.spd * delta) % 1;
      const v = p.curve.getPointAt(p.t);
      ap.setXYZ(i, v.x, v.y, v.z);
    });
    sp.needsUpdate = true;
    ap.needsUpdate = true;
  });

  // Suppress exhaustive-deps — curves are stable memoized objects
  void seaCurves; void airCurves;

  return <><primitive object={seaObj} /><primitive object={airObj} /></>;
}

// ─── Moving ships + planes with trails ───────────────────────────────────────
const SHIP_TRAIL = 10;
const PLANE_TRAIL = 26;

function MovingVehicles() {
  const seaCurves = useMemo(() => SEA_ROUTES.map(([ai, bi]) => {
    const c = new THREE.CatmullRomCurve3(arcPoints(PORTS[ai].lat, PORTS[ai].lon, PORTS[bi].lat, PORTS[bi].lon, 80, 0.042));
    c.arcLengthDivisions = 150; return c;
  }), []);

  const airCurves = useMemo(() => AIR_ROUTES.map(([ai, bi]) => {
    const c = new THREE.CatmullRomCurve3(arcPoints(PORTS[ai].lat, PORTS[ai].lon, PORTS[bi].lat, PORTS[bi].lon, 80, 0.18));
    c.arcLengthDivisions = 150; return c;
  }), []);

  const ships  = useRef(SEA_ROUTES.map(() => ({ t: Math.random(), spd: 0.010 + Math.random() * 0.007 })));
  const planes = useRef(AIR_ROUTES.map(() => ({ t: Math.random(), spd: 0.028 + Math.random() * 0.018 })));

  const mk = (n: number) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(n * 3), 3));
    return g;
  };
  const shipDotGeom    = useMemo(() => mk(SEA_ROUTES.length), []);
  const shipTrailGeom  = useMemo(() => mk(SEA_ROUTES.length * SHIP_TRAIL), []);
  const planeDotGeom   = useMemo(() => mk(AIR_ROUTES.length), []);
  const planeTrailGeom = useMemo(() => mk(AIR_ROUTES.length * PLANE_TRAIL), []);

  const shipDotMat    = useMemo(() => new THREE.PointsMaterial({ color: 0xaaddff, size: 0.026, sizeAttenuation: true }), []);
  const shipTrailMat  = useMemo(() => new THREE.PointsMaterial({ color: 0x55aacc, size: 0.012, sizeAttenuation: true, transparent: true, opacity: 0.42 }), []);
  const planeDotMat   = useMemo(() => new THREE.PointsMaterial({ color: 0xffffff, size: 0.040, sizeAttenuation: true }), []);
  const planeTrailMat = useMemo(() => new THREE.PointsMaterial({ color: 0x88ccff, size: 0.018, sizeAttenuation: true, transparent: true, opacity: 0.52 }), []);

  const shipDotObj    = useMemo(() => new THREE.Points(shipDotGeom,    shipDotMat),    [shipDotGeom,    shipDotMat]);
  const shipTrailObj  = useMemo(() => new THREE.Points(shipTrailGeom,  shipTrailMat),  [shipTrailGeom,  shipTrailMat]);
  const planeDotObj   = useMemo(() => new THREE.Points(planeDotGeom,   planeDotMat),   [planeDotGeom,   planeDotMat]);
  const planeTrailObj = useMemo(() => new THREE.Points(planeTrailGeom, planeTrailMat), [planeTrailGeom, planeTrailMat]);

  useFrame((_, delta) => {
    const sd = shipDotGeom.getAttribute("position")    as THREE.BufferAttribute;
    const st = shipTrailGeom.getAttribute("position")  as THREE.BufferAttribute;
    const pd = planeDotGeom.getAttribute("position")   as THREE.BufferAttribute;
    const pt = planeTrailGeom.getAttribute("position") as THREE.BufferAttribute;

    ships.current.forEach((s, i) => {
      s.t = (s.t + s.spd * delta) % 1;
      const p = seaCurves[i].getPointAt(s.t);
      sd.setXYZ(i, p.x, p.y, p.z);
      for (let tr = 0; tr < SHIP_TRAIL; tr++) {
        const tT = ((s.t - (tr + 1) * 0.008) % 1 + 1) % 1;
        const tp = seaCurves[i].getPointAt(tT);
        st.setXYZ(i * SHIP_TRAIL + tr, tp.x, tp.y, tp.z);
      }
    });

    planes.current.forEach((s, i) => {
      s.t = (s.t + s.spd * delta) % 1;
      const p = airCurves[i].getPointAt(s.t);
      pd.setXYZ(i, p.x, p.y, p.z);
      for (let tr = 0; tr < PLANE_TRAIL; tr++) {
        const tT = ((s.t - (tr + 1) * 0.005) % 1 + 1) % 1;
        const tp = airCurves[i].getPointAt(tT);
        pt.setXYZ(i * PLANE_TRAIL + tr, tp.x, tp.y, tp.z);
      }
    });

    sd.needsUpdate = true; st.needsUpdate = true;
    pd.needsUpdate = true; pt.needsUpdate = true;
  });

  return (
    <>
      <primitive object={shipTrailObj} />
      <primitive object={shipDotObj} />
      <primitive object={planeTrailObj} />
      <primitive object={planeDotObj} />
    </>
  );
}

// ─── Scene: rotation, float, parallax ────────────────────────────────────────
interface SceneProps { cx: number; cy: number }

function GlobeScene({ cx, cy }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  // Globe offset so cx/cy props position it in the viewport
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
    // Slow Y-axis rotation
    groupRef.current.rotation.y += delta * 0.08;
    // Gentle floating on Y
    groupRef.current.position.y = offY + Math.sin(clock.getElapsedTime() * 0.5) * 0.04;
    // Mouse parallax tilt
    const tx = mouse.current.y * 0.18;
    groupRef.current.rotation.x += (tx - groupRef.current.rotation.x) * 0.04;
  });

  return (
    <>
      <ambientLight intensity={0.28} />
      <pointLight position={[-5.0, 3.5,  4.0]} intensity={3.2}  color={0xffffff} />
      <pointLight position={[ 4.0,-2.0, -5.0]} intensity={0.55} color={0x2244ee} />
      <pointLight position={[ 0.0, 4.0,  2.0]} intensity={0.25} color={0x88aaff} />
      <group ref={groupRef} position={[offX, offY, 0]} rotation={[0.18, 0.85, 0]}>
        <Ocean />
        <GridLines />
        <ContinentLines />
        <Atmosphere />
        <RouteLines />
        <PortMarkers />
        <RouteParticles />
        <MovingVehicles />
      </group>
    </>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────
interface Props { cx?: number; cy?: number; radiusFactor?: number; opacity?: number }

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
          <Stars radius={130} depth={60} count={2800} factor={4} saturation={0} fade speed={0.35} />
          <GlobeScene cx={cx} cy={cy} />
        </Suspense>
      </Canvas>
    </div>
  );
}
