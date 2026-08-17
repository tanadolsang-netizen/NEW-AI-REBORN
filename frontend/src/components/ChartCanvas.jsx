'use client';

import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';

function ChartSphere() {
  return (
    <mesh scale={[1.6, 1.6, 1.6]} rotation={[0.6, 0.4, 0]}>
      <sphereGeometry args={[1, 96, 96]} />
      <MeshDistortMaterial color="#e8e8ed" distort={0.28} speed={0.9} roughness={0.25} metalness={0.08} clearcoat={0.35} />
      <OrbitControls enableZoom={true} enablePan={false} enableRotate={true} autoRotate autoRotateSpeed={0.6} />
    </mesh>
  );
}

export default function ChartCanvas({ title = 'Chart', className = 'h-[420px] md:h-[520px]' }) {
  const ref = useRef(null);

  return (
    <div ref={ref} className={className}>
      <div className="relative h-full w-full rounded-[36px] border border-black/[0.07] bg-white/60 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.06)] overflow-hidden">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 3.8], fov: 45 }} className="pointer-events-auto">
          <ambientLight intensity={1.1} />
          <directionalLight position={[3, 3, 3]} intensity={1.0} />
          <ChartSphere />
        </Canvas>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white/60 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
