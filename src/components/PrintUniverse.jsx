import React, { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

// ── Mouse parallax camera ────────────────────────────────────────────────────
function SceneRig({ mouse }) {
  useFrame(({ camera }) => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.current[0] * 1.8, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.current[1] * 0.9 + 0.4, 0.04);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

// ── Central printer hub ──────────────────────────────────────────────────────
function PrinterHub() {
  const groupRef = useRef();
  const paperRef = useRef();
  const scanRef  = useRef();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.18;

    // Paper emerging cycle
    if (paperRef.current) {
      const cycle = (t * 0.22) % 1;
      paperRef.current.position.y = 0.58 + cycle * 0.72;
      paperRef.current.material.opacity =
        cycle < 0.1 ? cycle * 10
        : cycle < 0.78 ? 1
        : 1 - (cycle - 0.78) * 4.55;
    }

    // Scan line sweep
    if (scanRef.current) {
      scanRef.current.position.y = Math.sin(t * 2.8) * 0.13;
    }
  });

  return (
    <group ref={groupRef}>
      {/* ── Main body ── */}
      <RoundedBox args={[2.2, 1.32, 1.62]} radius={0.13} smoothness={4}>
        <meshStandardMaterial color="#101820" metalness={0.78} roughness={0.18} />
      </RoundedBox>

      {/* ── Top output tray ── */}
      <RoundedBox position={[0, 0.78, 0]} args={[1.98, 0.24, 1.42]} radius={0.09} smoothness={4}>
        <meshStandardMaterial color="#182230" metalness={0.65} roughness={0.28} />
      </RoundedBox>

      {/* ── Mint glow slot line ── */}
      <mesh position={[0, 0.89, 0.22]}>
        <boxGeometry args={[1.46, 0.028, 0.04]} />
        <meshBasicMaterial color="#32d1a0" />
      </mesh>
      <pointLight position={[0, 1.15, 0.5]} intensity={1.4} color="#32d1a0" distance={2.8} />

      {/* ── Front panel ── */}
      <RoundedBox position={[0, 0.05, 0.82]} args={[2.02, 1.12, 0.055]} radius={0.08} smoothness={4}>
        <meshStandardMaterial color="#0d1620" metalness={0.58} roughness={0.42} />
      </RoundedBox>

      {/* ── Screen background ── */}
      <mesh position={[0.34, 0.13, 0.847]}>
        <planeGeometry args={[0.76, 0.53]} />
        <meshBasicMaterial color="#1a3545" />
      </mesh>

      {/* ── Screen mint overlay ── */}
      <mesh position={[0.34, 0.13, 0.848]}>
        <planeGeometry args={[0.72, 0.49]} />
        <meshBasicMaterial color="#32d1a0" transparent opacity={0.82} />
      </mesh>
      <pointLight position={[0.4, 0.2, 1.4]} intensity={0.8} color="#32d1a0" distance={1.6} />

      {/* ── Scan line ── */}
      <mesh ref={scanRef} position={[0.34, 0, 0.849]}>
        <planeGeometry args={[0.70, 0.022]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.65} />
      </mesh>

      {/* ── Action buttons ── */}
      {[-0.42, -0.60, -0.78].map((x, i) => (
        <mesh key={i} position={[x, -0.16, 0.848]}>
          <circleGeometry args={[0.044, 16]} />
          <meshBasicMaterial color={i === 0 ? "#32d1a0" : "#253848"} />
        </mesh>
      ))}

      {/* ── Input tray ── */}
      <RoundedBox position={[0, -0.77, 0.16]} args={[1.82, 0.13, 1.12]} radius={0.05} smoothness={4}>
        <meshStandardMaterial color="#182230" metalness={0.52} roughness={0.4} />
      </RoundedBox>

      {/* ── Emerging paper ── */}
      <mesh ref={paperRef} position={[0, 0.58, 0]}>
        <planeGeometry args={[1.32, 0.94]} />
        <meshStandardMaterial
          color="#f8f8f4"
          roughness={0.95}
          metalness={0}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ── Corner accent dots ── */}
      {[
        [-0.96, 0.56, 0.848], [0.96, 0.56, 0.848],
        [-0.96, -0.38, 0.848], [0.96, -0.38, 0.848],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[0.034, 10, 10]} />
          <meshBasicMaterial color="#32d1a0" />
        </mesh>
      ))}

      {/* ── Side accent stripe ── */}
      <mesh position={[1.12, 0.2, 0]}>
        <boxGeometry args={[0.012, 0.8, 1.5]} />
        <meshBasicMaterial color="#32d1a0" transparent opacity={0.5} />
      </mesh>
      <mesh position={[-1.12, 0.2, 0]}>
        <boxGeometry args={[0.012, 0.8, 1.5]} />
        <meshBasicMaterial color="#32d1a0" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// ── Orbiting print product ────────────────────────────────────────────────────
function Document({ radius, speed, startAngle, w, h, color, tilt = 0 }) {
  const ref = useRef();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const a = t * speed + startAngle;
    ref.current.position.x = Math.cos(a) * radius;
    ref.current.position.z = Math.sin(a) * radius;
    ref.current.position.y = Math.sin(t * 0.48 + startAngle * 1.3) * 0.38;
    ref.current.rotation.y = -a + Math.PI / 2;
    ref.current.rotation.z = tilt + Math.sin(t * 0.32 + startAngle) * 0.055;
    ref.current.rotation.x = Math.sin(t * 0.38 + startAngle * 0.7) * 0.07;
  });

  return (
    <RoundedBox ref={ref} args={[w, h, 0.017]} radius={0.013} smoothness={3}>
      <meshStandardMaterial color={color} roughness={0.72} metalness={0.04} />
    </RoundedBox>
  );
}

// ── Orbit path ring ───────────────────────────────────────────────────────────
function OrbitRing({ radius, opacity = 0.06 }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.006, 6, 100]} />
      <meshBasicMaterial color="#32d1a0" transparent opacity={opacity} />
    </mesh>
  );
}

// ── Document config ───────────────────────────────────────────────────────────
const DOCS = [
  { radius: 2.62, speed: 0.38, startAngle: 0.0, w: 0.88, h: 0.56, color: "#f9f9f5", tilt:  0.10 }, // business card
  { radius: 3.48, speed: 0.24, startAngle: 1.2, w: 0.63, h: 0.89, color: "#fafaf8", tilt: -0.06 }, // A4 doc
  { radius: 2.92, speed: 0.31, startAngle: 2.4, w: 0.72, h: 0.52, color: "#f5f2ec", tilt:  0.08 }, // brochure
  { radius: 3.72, speed: 0.19, startAngle: 3.6, w: 0.62, h: 0.62, color: "#fff9f5", tilt:  0.00 }, // photo
  { radius: 2.42, speed: 0.44, startAngle: 4.8, w: 0.46, h: 0.80, color: "#f0f5ff", tilt: -0.12 }, // flyer
  { radius: 3.18, speed: 0.27, startAngle: 0.8, w: 0.42, h: 0.27, color: "#fffbf0", tilt:  0.05 }, // label
];

// ── Inner scene ───────────────────────────────────────────────────────────────
function Scene({ mouse }) {
  return (
    <>
      <SceneRig mouse={mouse} />

      {/* Lighting */}
      <ambientLight intensity={0.32} />
      <directionalLight position={[6, 9, 5]} intensity={1.6} color="#ffffff" />
      <pointLight position={[-5, 5, 3]} intensity={3.2} color="#32d1a0" />
      <pointLight position={[5, -4, -3]} intensity={1.6} color="#ff6b35" />
      <hemisphereLight args={["#1a3a4a", "#080e16", 0.45]} />

      {/* Main printer object */}
      <Float speed={1.4} rotationIntensity={0.07} floatIntensity={0.44}>
        <PrinterHub />
      </Float>

      {/* Orbiting documents */}
      {DOCS.map((d, i) => <Document key={i} {...d} />)}

      {/* Orbit rings */}
      <OrbitRing radius={2.62} opacity={0.055} />
      <OrbitRing radius={3.48} opacity={0.042} />
      <OrbitRing radius={3.72} opacity={0.032} />

      {/* Ambient particles */}
      <Sparkles count={130} scale={10} size={0.9} speed={0.18} opacity={0.38} color="#32d1a0" />
      <Sparkles count={40} scale={8} size={0.5} speed={0.1} opacity={0.18} color="#ff6b35" />
    </>
  );
}

// ── Canvas export ─────────────────────────────────────────────────────────────
export default function PrintUniverse({ mouse }) {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 9.2], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <Scene mouse={mouse} />
      </Suspense>
    </Canvas>
  );
}
