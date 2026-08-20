"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { useRef, useEffect } from "react";
import type { Group } from "three";
import { useMounted } from "@/lib/useMounted";

function DriftingStars() {
  const near = useRef<Group>(null);
  const far = useRef<Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    function onMove(e: PointerEvent) {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    }
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    if (near.current) {
      near.current.rotation.y += delta * 0.012;
      near.current.rotation.x += delta * 0.004;
      near.current.position.x += (mouse.current.x * 0.4 - near.current.position.x) * 0.02;
      near.current.position.y += (-mouse.current.y * 0.4 - near.current.position.y) * 0.02;
    }
    if (far.current) {
      far.current.rotation.y -= delta * 0.005;
    }
  });

  return (
    <>
      <group ref={far}>
        <Stars radius={90} depth={50} count={2500} factor={3} saturation={0} fade speed={0.4} />
      </group>
      <group ref={near}>
        <Stars radius={50} depth={30} count={1800} factor={4.5} saturation={0} fade speed={1.1} />
      </group>
    </>
  );
}

export default function Starfield() {
  const mounted = useMounted();

  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        gl={{ antialias: false, alpha: true }}
        dpr={[1, 1.5]}
        frameloop="always"
      >
        <DriftingStars />
      </Canvas>
    </div>
  );
}
