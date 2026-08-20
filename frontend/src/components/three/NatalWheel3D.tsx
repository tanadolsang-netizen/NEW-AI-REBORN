"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import type { Group, Mesh } from "three";
import { useMounted } from "@/lib/useMounted";

type Body = { body: string; sign: string; degree: number };

const SIGNS = [
  "เมษ(Aries)", "พฤษภ(Taurus)", "เมถุน(Gemini)", "กรกฎ(Cancer)",
  "สิงห์(Leo)", "กันย์(Virgo)", "ตุลย์(Libra)", "พิจิก(Scorpio)",
  "ธนู(Sagittarius)", "มังกร(Capricorn)", "กุมภ์(Aquarius)", "มีน(Pisces)",
];

const SIGN_GLYPHS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

const PLANET_GLYPHS: Record<string, string> = {
  Sun: "☉",
  Moon: "☽",
  Mercury: "☿",
  Venus: "♀",
  Mars: "♂",
  Jupiter: "♃",
  Saturn: "♄",
  Uranus: "♅",
  Neptune: "♆",
  Pluto: "♇",
};

const PLANET_COLORS: Record<string, string> = {
  Sun: "#f5c14c",
  Moon: "#e5e7ff",
  Mercury: "#38bdf8",
  Venus: "#f472b6",
  Mars: "#f87171",
  Jupiter: "#a855f7",
  Saturn: "#facc15",
  Uranus: "#22d3ee",
  Neptune: "#818cf8",
  Pluto: "#94a3b8",
};

const RING_RADIUS = 3.1;
const PLANET_RADIUS = 2.0;

function absoluteDegree(body: Body): number {
  const idx = SIGNS.indexOf(body.sign);
  return (idx >= 0 ? idx : 0) * 30 + body.degree;
}

function angleFor(absDeg: number): number {
  return (absDeg / 360) * Math.PI * 2;
}

function Planet({
  b,
  hovered,
  onHover,
}: {
  b: Body;
  hovered: boolean;
  onHover: (name: string | null) => void;
}) {
  const mesh = useRef<Mesh>(null);
  const angle = angleFor(absoluteDegree(b));
  const pos: [number, number, number] = [
    Math.cos(angle) * PLANET_RADIUS,
    Math.sin(angle) * PLANET_RADIUS,
    0,
  ];
  const color = PLANET_COLORS[b.body] ?? "#a855f7";

  useFrame((state) => {
    if (mesh.current) {
      const t = state.clock.elapsedTime;
      mesh.current.scale.setScalar(hovered ? 1.6 : 1 + Math.sin(t * 2 + angle) * 0.06);
    }
  });

  return (
    <group position={pos}>
      <mesh
        ref={mesh}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(b.body);
        }}
        onPointerOut={() => onHover(null)}
      >
        <sphereGeometry args={[0.14, 24, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.4} toneMapped={false} />
      </mesh>
      <Html center transform occlude={false} style={{ pointerEvents: "none" }}>
        <div className="flex flex-col items-center select-none">
          <span
            className="text-lg font-bold"
            style={{ color, textShadow: `0 0 10px ${color}` }}
          >
            {PLANET_GLYPHS[b.body] ?? b.body[0]}
          </span>
          {hovered && (
            <div className="glass-strong mt-1 whitespace-nowrap rounded-lg px-2 py-1 text-[11px] text-foreground">
              {b.body} · {b.sign.split("(")[0]} {b.degree.toFixed(1)}°
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}

function WheelGroup({ bodies, ascendant }: { bodies: Body[]; ascendant: Body }) {
  const ring = useRef<Group>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const ascAngle = angleFor(absoluteDegree(ascendant));

  useFrame((_, delta) => {
    if (ring.current) ring.current.rotation.z += delta * 0.015;
  });

  const glyphs = useMemo(
    () =>
      SIGN_GLYPHS.map((symbol, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return {
          symbol,
          pos: [Math.cos(angle) * RING_RADIUS, Math.sin(angle) * RING_RADIUS, 0] as [
            number,
            number,
            number,
          ],
        };
      }),
    [],
  );

  return (
    <group rotation={[-0.5, 0, 0]}>
      <group ref={ring}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[RING_RADIUS, 0.018, 16, 96]} />
          <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={1.3} toneMapped={false} />
        </mesh>
        {glyphs.map((g, i) => (
          <Html key={i} position={g.pos} center transform occlude={false} style={{ pointerEvents: "none" }}>
            <span className="text-xl" style={{ color: "#f3f1ff", textShadow: "0 0 10px #a855f7" }}>
              {g.symbol}
            </span>
          </Html>
        ))}
      </group>

      <group position={[Math.cos(ascAngle) * (RING_RADIUS + 0.35), Math.sin(ascAngle) * (RING_RADIUS + 0.35), 0]}>
        <Html center transform occlude={false} style={{ pointerEvents: "none" }}>
          <span className="text-[11px] font-bold tracking-wide text-accent-gold" style={{ textShadow: "0 0 8px #f5c14c" }}>
            ASC
          </span>
        </Html>
      </group>

      {bodies.map((b) => (
        <Planet key={b.body} b={b} hovered={hovered === b.body} onHover={setHovered} />
      ))}

      <pointLight position={[0, 0, 2]} intensity={10} color="#a855f7" distance={9} />
      <pointLight position={[3, 3, 4]} intensity={6} color="#38bdf8" distance={12} />
    </group>
  );
}

export default function NatalWheel3D({ bodies, ascendant }: { bodies: Body[]; ascendant: Body }) {
  const mounted = useMounted();

  if (!mounted) {
    return <div className="aspect-square w-full" aria-hidden="true" />;
  }

  return (
    <div className="aspect-square w-full touch-none">
      <Canvas camera={{ position: [0, 1.6, 8.5], fov: 42 }} gl={{ alpha: true }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.3} />
        <WheelGroup bodies={bodies} ascendant={ascendant} />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={5}
          maxDistance={13}
          autoRotate={false}
        />
      </Canvas>
      <p className="mt-2 text-center text-xs text-muted">ลากเพื่อหมุนวงล้อ · เลื่อนเมาส์ชี้ดาวเพื่อดูรายละเอียด</p>
    </div>
  );
}
