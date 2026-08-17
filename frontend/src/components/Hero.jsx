'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLang } from '../i18n.jsx';
import { api } from '../services/api.js';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, MeshDistortMaterial } from '@react-three/drei';

gsap.registerPlugin(ScrollTrigger);

function Sphere() {
  const ref = useRef(null);
  return (
    <mesh ref={ref} scale={[1.9, 1.9, 1.9]}>
      <sphereGeometry args={[1, 96, 96]} />
      <MeshDistortMaterial color="#818cf8" distort={0.35} speed={1.0} roughness={0.25} metalness={0.08} clearcoat={0.35} />
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} autoRotate={false} />
    </mesh>
  );
}

export default function Hero() {
  const { t } = useLang();
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const bodyRef = useRef(null);
  const actionsRef = useRef(null);
  const rightRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(titleRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9 })
        .fromTo(bodyRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.85 }, '-=0.6')
        .fromTo(actionsRef.current.children, { opacity: 0, y: 16 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.7 }, '-=0.55')
        .fromTo(rightRef.current, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 1.1 }, '-=0.8');
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" ref={sectionRef} className="relative min-h-screen flex items-center bg-[#0b0b0d]">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-transparent to-violet-950/30 pointer-events-none" />

      <div className="mx-auto max-w-6xl px-6 pt-28 pb-20 w-full grid md:grid-cols-2 gap-12 items-center relative">
        <div className="max-w-xl">
          <div
            ref={titleRef}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl px-4 py-1.5 text-[11px] font-semibold tracking-wide text-white/70 mb-8"
          >
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-indigo-500" />
            {t('hero.tag')}
          </div>

          <h1 ref={titleRef} className="text-[52px] md:text-[68px] leading-[0.95] tracking-[-0.045em] font-semibold text-white">
            {t('hero.title')}
            <span className="block mt-1 text-white/40">{t('hero.titleSub')}</span>
          </h1>

          <p ref={bodyRef} className="mt-6 text-[17px] leading-[1.6] text-white/60 max-w-md">
            {t('hero.body')}
          </p>

          <div ref={actionsRef} className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#natal"
              className="inline-flex items-center justify-center rounded-full bg-indigo-500 text-white px-6 py-3 text-[14px] font-medium hover:bg-indigo-400 active:scale-[0.97] transition-all shadow-[0_10px_30px_rgba(99,102,241,0.35)]"
            >
              {t('hero.cta1')}
            </a>
            <a
              href="#branches"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-xl px-6 py-3 text-[14px] font-medium text-white/80 hover:border-white/25 hover:text-white transition-all"
            >
              {t('hero.cta2')}
            </a>
          </div>
        </div>

        <div ref={rightRef} className="relative h-[420px] md:h-[520px]">
          <div className="absolute inset-0 md:translate-x-8">
            <div className="relative h-full w-full rounded-[36px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.45)] overflow-hidden">
              <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 3.8], fov: 45 }} className="pointer-events-none">
                <ambientLight intensity={1.1} />
                <directionalLight position={[3, 3, 3]} intensity={1.0} />
                <Sphere />
              </Canvas>
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
