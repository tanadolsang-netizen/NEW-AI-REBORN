import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const titleRef = useRef(null);
  const bodyRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(titleRef.current, { opacity: 0, y: 28, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2 })
        .fromTo(bodyRef.current, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.95 }, '-=0.75')
        .fromTo(ctaRef.current, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.7 }, '-=0.55');

      gsap.fromTo('.hero-blob-wrap', { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 1.4, ease: 'power2.out', delay: 0.05 });

      gsap.to('.hero-blob-wrap', {
        yPercent: 14,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
        },
      });
    }, titleRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" className="relative min-h-screen w-full overflow-hidden bg-[#fbfbfd]">
      <div className="pointer-events-none absolute inset-0">
        <div className="hero-blob-wrap absolute -right-24 -top-20 h-[70vmin] w-[70vmin] opacity-[0.72]">
          <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 3.6], fov: 45 }}>
            <ambientLight intensity={1.1} />
            <directionalLight position={[3, 3, 3]} intensity={1.0} />
            <Blob />
            <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} autoRotate={false} />
          </Canvas>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#fbfbfd] to-transparent" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pt-36 pb-28 md:pt-44 md:pb-36">
        <div className="max-w-2xl">
          <h1 ref={titleRef} className="text-[56px] md:text-[72px] leading-[0.98] tracking-[-0.04em] font-semibold text-black">
            ดูดวงด้วยตำรา
            <span className="block text-black/75">ความแม่นยำจากดาราศาสตร์</span>
          </h1>
          <p ref={bodyRef} className="mt-6 text-[17px] md:text-[19px] leading-[1.55] text-black/65 max-w-xl">
            คำนวณ ephemeris ด้วย JPL DE421 เอง offline — ไม่พึ่ง API ภายนอก।แปลงเวลา/พิกัด birthplace เป็นตำแหน่งดาวเคราะห์จริง แล้วอ่านจังหวะชีวิตอย่างมีโครงสร้าง
          </p>
          <div ref={ctaRef} className="mt-10 flex flex-wrap gap-3">
            <button
              onClick={() => document.getElementById('natal')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-[14px] font-medium text-white hover:bg-black/85 active:scale-[0.97] transition-all"
            >
              เริ่มคำนวณดวง
            </button>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center justify-center rounded-full bg-white/70 px-6 py-3 text-[14px] font-medium text-black backdrop-blur-md border border-black/10 hover:bg-white active:scale-[0.97] transition-all"
            >
              ทำไมต้อง ASTRAL
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Blob() {
  const ref = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(ref.current.rotation, {
        x: Math.PI * 2,
        y: Math.PI * 1.5,
        duration: 28,
        repeat: -1,
        ease: 'none',
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <mesh ref={ref} scale={[1.9, 1.9, 1.9]}>
      <sphereGeometry args={[1, 128, 128]} />
      <MeshDistortMaterial
        color="#e8e8ed"
        attach="material"
        distort={0.55}
        speed={1.4}
        roughness={0.18}
        metalness={0.08}
        clearcoat={0.4}
      />
    </mesh>
  );
}
