"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useRef, useMemo } from "react";
import type { Group, Mesh } from "three";
import { useMounted } from "@/lib/useMounted";

const ZODIAC_SIGNS = [
  { symbol: "♈", th: "เมษ" },
  { symbol: "♉", th: "พฤษภ" },
  { symbol: "♊", th: "เมถุน" },
  { symbol: "♋", th: "กรกฎ" },
  { symbol: "♌", th: "สิงห์" },
  { symbol: "♍", th: "กันย์" },
  { symbol: "♎", th: "ตุลย์" },
  { symbol: "♏", th: "พิจิก" },
  { symbol: "♐", th: "ธนู" },
  { symbol: "♑", th: "มังกร" },
  { symbol: "♒", th: "กุมภ์" },
  { symbol: "♓", th: "มีน" },
];

const RADIUS = 3.1;

function WheelGroup() {
  const group = useRef<Group>(null);
  const core = useRef<Mesh>(null);

  const glyphs = useMemo(
    () =>
      ZODIAC_SIGNS.map((sign, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return {
          ...sign,
          pos: [Math.cos(angle) * RADIUS, Math.sin(angle) * RADIUS, 0] as [
            number,
            number,
            number,
          ],
        };
      }),
    [],
  );

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.z += delta * 0.09;
    if (core.current) core.current.rotation.y += delta * 0.4;
  });

  return (
    <group rotation={[-0.55, 0, 0]}>
      <group ref={group}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[RADIUS, 0.02, 16, 96]} />
          <meshStandardMaterial
            color="#a855f7"
            emissive="#a855f7"
            emissiveIntensity={1.6}
            toneMapped={false}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[RADIUS * 0.74, 0.008, 16, 96]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={1.2}
            toneMapped={false}
          />
        </mesh>
        {glyphs.map((g) => (
          <Html
            key={g.th}
            position={g.pos}
            center
            transform
            sprite={false}
            occlude={false}
            style={{ pointerEvents: "none" }}
          >
            <div className="flex flex-col items-center select-none">
              <span
                className="text-2xl"
                style={{
                  color: "#f3f1ff",
                  textShadow: "0 0 12px #a855f7, 0 0 24px #38bdf8",
                }}
              >
                {g.symbol}
              </span>
            </div>
          </Html>
        ))}
      </group>
      <mesh ref={core}>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshStandardMaterial
          color="#f5c14c"
          emissive="#f5c14c"
          emissiveIntensity={0.9}
          wireframe
          toneMapped={false}
        />
      </mesh>
      <pointLight position={[0, 0, 2]} intensity={12} color="#a855f7" distance={8} />
      <pointLight position={[2, 2, 3]} intensity={8} color="#38bdf8" distance={10} />
    </group>
  );
}

export default function ZodiacWheel3D() {
  const mounted = useMounted();

  if (!mounted) {
    return <div className="aspect-square w-full max-w-[520px]" aria-hidden="true" />;
  }

  return (
    <div className="aspect-square w-full max-w-[520px] animate-float-slow">
      <Canvas camera={{ position: [0, 1.4, 7.5], fov: 45 }} gl={{ alpha: true }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.25} />
        <WheelGroup />
      </Canvas>
    </div>
  );
}
