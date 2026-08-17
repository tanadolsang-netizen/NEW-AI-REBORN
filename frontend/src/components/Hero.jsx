'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useLang } from '../i18n.jsx';

function GalaxyBackground({ intensity = 1.2 }) {
  const ref = useRef(null);

  const galaxy = useMemo(() => {
    const count = 5000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const insideColor = new THREE.Color('#ffddaa');
    const outsideColor = new THREE.Color('#4fc3f7');
    const coreColor = new THREE.Color('#ffffff');

    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 12 + 0.3;
      const spinAngle = radius * 0.8;
      const branchAngle = (i % 3) * ((2 * Math.PI) / 3);
      const randomX = (Math.random() - 0.5) * (0.4 + radius * 0.25);
      const randomY = (Math.random() - 0.5) * (0.2 + radius * 0.1);
      const randomZ = (Math.random() - 0.5) * (0.4 + radius * 0.25);

      positions[i * 3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i * 3 + 1] = randomY * 1.8;
      positions[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      const mixRatio = Math.min(radius / 10, 1);
      const mixedColor = insideColor.clone().lerp(outsideColor, mixRatio);
      if (radius < 1.5) mixedColor.lerp(coreColor, (1.5 - radius) / 1.5);

      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;

      sizes[i] = Math.random() * 1.8 + 0.4;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    g.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
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
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.8 * intensity}
        vertexColors
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function Nebulae() {
  return (
    <>
      <Nebula position={[-4, 2, -6]} color="#4fc3f7" scale={1.2} />
      <Nebula position={[5, -2, -5]} color="#818cf8" scale={1.0} />
      <Nebula position={[0, 3, -7]} color="#f472b6" scale={0.9} />
      <Nebula position={[-2, -3, -4]} color="#22d3ee" scale={1.1} />
      <Nebula position={[3, 1, -6]} color="#a78bfa" scale={0.8} />
    </>
  );
}

function Nebula({ position, color, scale = 1 }) {
  return (
    <sprite position={position} scale={[4.5 * scale, 4.5 * scale, 1]}>
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

function HeroScene() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.4, 5.5], fov: 48 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.25} />
      <pointLight position={[5, 3, 5]} color="#818cf8" intensity={6} distance={14} decay={2} />
      <pointLight position={[-5, -2, -4]} color="#22d3ee" intensity={4.5} distance={14} decay={2} />
      <pointLight position={[0, 5, -6]} color="#f472b6" intensity={4} distance={14} decay={2} />
      <GalaxyBackground />
      <Nebulae />
      <DeepStars />
      <OrbitControls enableZoom enablePan={false} enableRotate autoRotate autoRotateSpeed={0.5} minDistance={2.5} maxDistance={9} />
    </Canvas>
  );
}

export default function Hero() {
  const { t, lang, setLang } = useLang();
  return (
    <section id="hero" className="relative overflow-hidden bg-[#0b0b0d]">
      <div className="absolute inset-0 z-0">
        <HeroScene />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#0b0b0d]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-36 md:py-44">
        <div className="max-w-2xl">
          <div className="text-[11px] font-semibold tracking-widest text-white/45 uppercase mb-4">{t('hero.badge')}</div>
          <h1 className="text-[46px] md:text-[66px] leading-[0.95] tracking-[-0.035em] font-semibold text-white">{t('hero.title')}</h1>
          <p className="mt-4 text-[16px] leading-[1.65] text-white/55">{t('hero.body')}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#natal"
              className="inline-flex items-center justify-center rounded-full bg-indigo-500 text-white px-6 py-3 text-[14px] font-medium hover:bg-indigo-400 active:scale-[0.97] transition-all shadow-[0_10px_30px_rgba(99,102,241,0.35)]"
            >
              {t('hero.cta')}
            </a>
            <a
              href="#branches"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-[14px] font-medium text-white/80 hover:border-white/25 hover:text-white transition-all"
            >
              {t('hero.secondary')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
