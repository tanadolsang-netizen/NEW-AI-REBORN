'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// ── Animated galaxy background ──────────────────────────────────────────────
function GalaxyBackground({ intensity = 1.2 }) {
  const ref = useRef(null);
  const { camera } = useThree();

  const galaxy = useMemo(() => {
    const count = 6000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const randomness = new Float32Array(count * 3);

    const insideColor = new THREE.Color('#ffddaa');
    const outsideColor = new THREE.Color('#4fc3f7');
    const coreColor = new THREE.Color('#ffffff');

    for (let i = 0; i < count; i++) {
      // Spiral galaxy distribution
      const radius = Math.random() * 12 + 0.3;
      const spinAngle = radius * 0.8;
      const branchAngle = (i % 3) * ((2 * Math.PI) / 3);
      const randomX = (Math.random() - 0.5) * (0.4 + radius * 0.25);
      const randomY = (Math.random() - 0.5) * (0.2 + radius * 0.1);
      const randomZ = (Math.random() - 0.5) * (0.4 + radius * 0.25);

      const x = Math.cos(branchAngle + spinAngle) * radius + randomX;
      const y = randomY * 1.8;
      const z = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color based on radius
      const mixRatio = Math.min(radius / 10, 1);
      const mixedColor = insideColor.clone().lerp(outsideColor, mixRatio);
      if (radius < 1.5) mixedColor.lerp(coreColor, (1.5 - radius) / 1.5);

      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;

      sizes[i] = Math.random() * 1.8 + 0.4;
      randomness[i * 3] = randomX * 0.5;
      randomness[i * 3 + 1] = randomY * 0.5;
      randomness[i * 3 + 2] = randomZ * 0.5;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    g.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    g.setAttribute('randomness', new THREE.BufferAttribute(randomness, 3));
    return g;
  }, []);

  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 0.012;
      ref.current.rotation.x += dt * 0.002;
    }
  });

  return (
    <points ref={ref} geometry={galaxy} rotation={[0.5, 0, 0]} scale={[1.4, 1.4, 1.4]}>
      <pointsMaterial
        size={0.045}
        sizeAttenuation
        transparent
        opacity={0.75 * intensity}
        vertexColors
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ── Nebula clouds ───────────────────────────────────────────────────────────
function NebulaCloud({ position, color, scale = 1 }) {
  const ref = useRef(null);
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.z += dt * 0.006;
      ref.current.material.opacity = 0.18 + Math.sin(Date.now() * 0.0003) * 0.04;
    }
  });

  return (
    <sprite ref={ref} position={position} scale={[4.5 * scale, 4.5 * scale, 1]}>
      <spriteMaterial
        color={color}
        transparent
        opacity={0.18}
        blending={THREE.AdditiveBlending}
        depthTest={false}
      />
    </sprite>
  );
}

function Nebulae() {
  return (
    <>
      <NebulaCloud position={[-4, 2, -6]} color="#4fc3f7" scale={1.2} />
      <NebulaCloud position={[5, -2, -5]} color="#818cf8" scale={1.0} />
      <NebulaCloud position={[0, 3, -7]} color="#f472b6" scale={0.9} />
      <NebulaCloud position={[-2, -3, -4]} color="#22d3ee" scale={1.1} />
      <NebulaCloud position={[3, 1, -6]} color="#a78bfa" scale={0.8} />
    </>
  );
}

// ── Deep background stars ───────────────────────────────────────────────────
function DeepStars({ count = 1800 }) {
  const ref = useRef(null);
  const geo = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 18 + Math.random() * 25;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, [count]);

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.004;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        color="#c7d2fe"
        size={0.018}
        sizeAttenuation
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ── Planet sphere with orbit ring ──────────────────────────────────────────
function Planet({
  color = '#e8e8ed',
  size = 0.18,
  pos = [0, 0, 0],
  ringColor,
  distort = 0.28,
  speed = 0.9,
  label,
  labelColor = '#fff',
  emoji,
}) {
  const meshRef = useRef(null);
  const glowRef = useRef(null);

  useFrame((_, dt) => {
    if (meshRef.current) meshRef.current.rotation.y += dt * speed * 0.3;
    if (glowRef.current) glowRef.current.rotation.z -= dt * speed * 0.15;
  });

  return (
    <group position={pos}>
      {/* Outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[size * 1.25, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial
          color={color}
          roughness={0.35}
          metalness={0.15}
          emissive={color}
          emissiveIntensity={0.12}
        />
      </mesh>
      {ringColor && (
        <mesh rotation={[Math.PI / 2.2, 0, 0]}>
          <ringGeometry args={[size + 0.08, size + 0.14, 64]} />
          <meshBasicMaterial color={ringColor} transparent opacity={0.35} side={THREE.DoubleSide} />
        </mesh>
      )}
      {(label || emoji) && (
        <HtmlLayer x={size + 0.22} y={0} color={labelColor}>
          {emoji && <span className="text-sm leading-none drop-shadow">{emoji}</span>}
          {label && <span className="text-[10px] font-semibold tracking-wider uppercase drop-shadow">{label}</span>}
        </HtmlLayer>
      )}
    </group>
  );
}

function HtmlLayer({ x = 0, y = 0, children, color = '#fff' }) {
  const ref = useRef(null);
  useFrame(() => {
    if (ref.current) ref.current.lookAt(0, 0, 6);
  });
  return (
    <group position={[x, y, 0]}>
      <sprite ref={ref} scale={[2, 2, 1]}>
        <spriteMaterial color={color} transparent opacity={0.9} depthTest={false} blending={THREE.NormalBlending} />
      </sprite>
    </group>
  );
}

function OrbitRing({ radius = 2, color = 'rgba(255,255,255,0.08)', tilt = 0 }) {
  const geo = useMemo(() => {
    const pts = [];
    const seg = 128;
    for (let i = 0; i <= seg; i++) {
      const a = (i / seg) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [radius]);
  return (
    <line geometry={geo} rotation={[tilt, 0, 0]}>
      <lineBasicMaterial color={color} transparent opacity={0.4} linewidth={1} />
    </line>
  );
}

function NeonLights() {
  return (
    <>
      <pointLight position={[5, 3, 5]} color="#818cf8" intensity={6} distance={14} decay={2} />
      <pointLight position={[-5, -2, -4]} color="#22d3ee" intensity={4.5} distance={14} decay={2} />
      <pointLight position={[0, 5, -6]} color="#f472b6" intensity={4} distance={14} decay={2} />
      <ambientLight intensity={0.22} />
    </>
  );
}

// ── Planet data per mode ───────────────────────────────────────────────────
const PLANET_DEFS = {
  natal: [
    { label: 'SUN', color: '#fbbf24', size: 0.22, pos: [1.6, 0.2, -0.3], ringColor: '#fbbf24', distort: 0.22, speed: 0.5, emoji: '☀️' },
    { label: 'MOON', color: '#e2e8f0', size: 0.16, pos: [-1.2, -0.4, 0.6], ringColor: '#e2e8f0', distort: 0.35, speed: 0.8, emoji: '🌙' },
    { label: 'MERCURY', color: '#a5b4fc', size: 0.12, pos: [2.3, 0.6, 0.9], ringColor: '#a5b4fc', distort: 0.3, speed: 1.0, emoji: '☿' },
    { label: 'VENUS', color: '#f9a8d4', size: 0.15, pos: [-2.1, 0.3, -0.8], ringColor: '#f9a8d4', distort: 0.26, speed: 0.7, emoji: '♀' },
    { label: 'MARS', color: '#f87171', size: 0.13, pos: [0.6, -1.4, 1.2], ringColor: '#f87171', distort: 0.4, speed: 1.1, emoji: '♂' },
    { label: 'JUPITER', color: '#fcd34d', size: 0.24, pos: [-0.9, 1.5, -1.5], ringColor: '#fcd34d', distort: 0.18, speed: 0.4, emoji: '♃' },
    { label: 'SATURN', color: '#fde68a', size: 0.21, pos: [1.1, -0.9, -2.1], ringColor: '#fde68a', distort: 0.2, speed: 0.35, emoji: '♄' },
  ],
  transit: [
    { label: 'NOW', color: '#22d3ee', size: 0.26, pos: [0, 0, 0], ringColor: '#22d3ee', distort: 0.3, speed: 0.7, emoji: '🔮' },
    { label: 'SUN', color: '#fbbf24', size: 0.2, pos: [2.0, 0.3, -0.6], ringColor: '#fbbf24', distort: 0.25, speed: 0.5, emoji: '☀️' },
    { label: 'MOON', color: '#e2e8f0', size: 0.14, pos: [-1.6, 0.2, 0.8], ringColor: '#e2e8f0', distort: 0.38, speed: 0.85, emoji: '🌙' },
    { label: 'MERCURY', color: '#a5b4fc', size: 0.11, pos: [2.7, -0.4, 0.6], ringColor: '#a5b4fc', distort: 0.3, speed: 1.0, emoji: '☿' },
    { label: 'VENUS', color: '#f9a8d4', size: 0.14, pos: [-2.3, -0.6, -0.4], ringColor: '#f9a8d4', distort: 0.28, speed: 0.7, emoji: '♀' },
    { label: 'MARS', color: '#f87171', size: 0.12, pos: [0.9, 1.3, 1.6], ringColor: '#f87171', distort: 0.42, speed: 1.1, emoji: '♂' },
  ],
  synastry: [
    { label: 'A', color: '#818cf8', size: 0.22, pos: [-1.8, 0, 0], ringColor: '#818cf8', distort: 0.28, speed: 0.6, emoji: '🅰' },
    { label: 'B', color: '#f472b6', size: 0.22, pos: [1.8, 0, 0], ringColor: '#f472b6', distort: 0.28, speed: 0.6, emoji: '🅱' },
    { label: 'SUN A', color: '#fbbf24', size: 0.14, pos: [-2.6, 0.5, 0.3], ringColor: '#fbbf24', distort: 0.25, speed: 0.5, emoji: '☀️' },
    { label: 'SUN B', color: '#fbbf24', size: 0.14, pos: [2.6, -0.5, -0.3], ringColor: '#fbbf24', distort: 0.25, speed: 0.5, emoji: '☀️' },
    { label: 'MOON A', color: '#e2e8f0', size: 0.12, pos: [-1.2, 1.2, 0.9], ringColor: '#e2e8f0', distort: 0.35, speed: 0.8, emoji: '🌙' },
    { label: 'MOON B', color: '#e2e8f0', size: 0.12, pos: [1.2, -1.2, -0.9], ringColor: '#e2e8f0', distort: 0.35, speed: 0.8, emoji: '🌙' },
    { label: 'VENUS', color: '#f9a8d4', size: 0.15, pos: [0, 1.8, -1.2], ringColor: '#f9a8d4', distort: 0.26, speed: 0.7, emoji: '♀' },
    { label: 'MARS', color: '#f87171', size: 0.13, pos: [0, -1.8, 1.2], ringColor: '#f87171', distort: 0.4, speed: 1.1, emoji: '♂' },
  ],
  default: [
    { label: 'SUN', color: '#fbbf24', size: 0.22, pos: [1.6, 0.2, -0.3], ringColor: '#fbbf24', distort: 0.22, speed: 0.5, emoji: '☀️' },
    { label: 'MOON', color: '#e2e8f0', size: 0.16, pos: [-1.2, -0.4, 0.6], ringColor: '#e2e8f0', distort: 0.35, speed: 0.8, emoji: '🌙' },
    { label: 'MERCURY', color: '#a5b4fc', size: 0.12, pos: [2.3, 0.6, 0.9], ringColor: '#a5b4fc', distort: 0.3, speed: 1.0, emoji: '☿' },
    { label: 'VENUS', color: '#f9a8d4', size: 0.15, pos: [-2.1, 0.3, -0.8], ringColor: '#f9a8d4', distort: 0.26, speed: 0.7, emoji: '♀' },
    { label: 'MARS', color: '#f87171', size: 0.13, pos: [0.6, -1.4, 1.2], ringColor: '#f87171', distort: 0.4, speed: 1.1, emoji: '♂' },
    { label: 'JUPITER', color: '#fcd34d', size: 0.24, pos: [-0.9, 1.5, -1.5], ringColor: '#fcd34d', distort: 0.18, speed: 0.4, emoji: '♃' },
    { label: 'SATURN', color: '#fde68a', size: 0.21, pos: [1.1, -0.9, -2.1], ringColor: '#fde68a', distort: 0.2, speed: 0.35, emoji: '♄' },
  ],
};

const ORBIT_DEFS = {
  natal: [
    { radius: 1.6, color: '#fbbf24', tilt: 0.15 },
    { radius: 1.9, color: '#e2e8f0', tilt: -0.1 },
    { radius: 2.3, color: '#a5b4fc', tilt: 0.05 },
    { radius: 2.0, color: '#f9a8d4', tilt: -0.2 },
    { radius: 1.7, color: '#f87171', tilt: 0.25 },
    { radius: 2.8, color: '#fcd34d', tilt: -0.08 },
    { radius: 2.6, color: '#fde68a', tilt: 0.12 },
  ],
  transit: [
    { radius: 1.4, color: '#22d3ee', tilt: 0 },
    { radius: 2.0, color: '#fbbf24', tilt: 0.1 },
    { radius: 1.7, color: '#e2e8f0', tilt: -0.15 },
    { radius: 2.4, color: '#a5b4fc', tilt: 0.05 },
    { radius: 2.1, color: '#f9a8d4', tilt: -0.1 },
    { radius: 1.8, color: '#f87171', tilt: 0.2 },
  ],
  synastry: [
    { radius: 1.8, color: '#818cf8', tilt: 0.2 },
    { radius: 1.8, color: '#f472b6', tilt: -0.2 },
    { radius: 2.6, color: '#fbbf24', tilt: 0.1 },
    { radius: 2.6, color: '#fbbf24', tilt: -0.1 },
    { radius: 1.7, color: '#e2e8f0', tilt: 0.15 },
    { radius: 1.7, color: '#e2e8f0', tilt: -0.15 },
    { radius: 1.9, color: '#f9a8d4', tilt: 0 },
    { radius: 1.9, color: '#f87171', tilt: 0 },
  ],
  default: [
    { radius: 1.6, color: '#fbbf24', tilt: 0.15 },
    { radius: 1.9, color: '#e2e8f0', tilt: -0.1 },
    { radius: 2.3, color: '#a5b4fc', tilt: 0.05 },
    { radius: 2.0, color: '#f9a8d4', tilt: -0.2 },
    { radius: 1.7, color: '#f87171', tilt: 0.25 },
    { radius: 2.8, color: '#fcd34d', tilt: -0.08 },
    { radius: 2.6, color: '#fde68a', tilt: 0.12 },
  ],
};

// ── HUD overlay ────────────────────────────────────────────────────────────
function HUD({ mode = 'default' }) {
  const titles = {
    natal: 'NATAL CHART',
    transit: 'TRANSIT NOW',
    synastry: 'SYNASTRY',
    default: 'CHART MAP',
  };
  const accents = {
    natal: 'text-indigo-300',
    transit: 'text-cyan-300',
    synastry: 'text-pink-300',
    default: 'text-indigo-300',
  };
  const borderAccents = {
    natal: 'border-indigo-500/30',
    transit: 'border-cyan-500/30',
    synastry: 'border-pink-500/30',
    default: 'border-indigo-500/30',
  };

  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-5 md:p-7">
      {/* Top HUD */}
      <div className="flex items-center justify-between">
        <div
          className={`rounded-2xl border ${borderAccents[mode]} bg-black/40 backdrop-blur-2xl px-4 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.35)]`}
        >
          <div className={`text-[11px] font-semibold tracking-[0.18em] uppercase ${accents[mode]}`}>
            {titles[mode]}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-2xl px-3 py-1.5 text-[10px] font-mono text-white/60">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5" />
          LIVE
        </div>
      </div>

      {/* Crosshair */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="h-12 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        <div className="absolute h-px w-12 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Bottom HUD */}
      <div className="flex items-end justify-between gap-3">
        <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-2xl px-4 py-2.5 text-[10px] font-mono text-white/55">
          <div>DRAG TO ROTATE</div>
          <div className="mt-0.5">SCROLL TO ZOOM</div>
        </div>
        <div
          className={`rounded-2xl border ${borderAccents[mode]} bg-black/30 backdrop-blur-2xl px-4 py-2.5 text-[10px] font-mono ${accents[mode]}`}
        >
          <div>OBJECTS: {mode === 'natal' ? '7' : mode === 'transit' ? '6' : mode === 'synastry' ? '8' : '7'}</div>
          <div className="mt-0.5">MODE: {mode.toUpperCase()}</div>
        </div>
      </div>
    </div>
  );
}

// ── Main scene ─────────────────────────────────────────────────────────────
function Scene({ mode }) {
  const planets = PLANET_DEFS[mode] || PLANET_DEFS.default;
  const orbits = ORBIT_DEFS[mode] || ORBIT_DEFS.default;

  return (
    <>
      <GalaxyBackground />
      <Nebulae />
      <DeepStars />
      <NeonLights />
      {orbits.map((o, i) => (
        <OrbitRing key={`o-${i}`} radius={o.radius} color={o.color} tilt={o.tilt} />
      ))}
      {planets.map((p, i) => (
        <Planet key={`p-${i}`} {...p} />
      ))}
      <OrbitControls
        enableZoom
        enablePan={false}
        enableRotate
        autoRotate
        autoRotateSpeed={0.6}
        minDistance={2.5}
        maxDistance={9}
      />
    </>
  );
}

// ── Exported component ──────────────────────────────────────────────────────
export default function ChartCanvas({
  title = 'Chart',
  className = 'h-[420px] md:h-[520px]',
  mode = 'default',
}) {
  return (
    <div className={className}>
      <div className="relative h-full w-full rounded-[36px] border border-black/[0.07] bg-[#0b0b0d] backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.55)] overflow-hidden">
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0.4, 5.5], fov: 48 }}
          className="pointer-events-auto"
          gl={{ antialias: true, alpha: true }}
        >
          <Scene mode={mode} />
        </Canvas>
        <HUD mode={mode} />
        {/* Top/bottom fades */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
    </div>
  );
}
