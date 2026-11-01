"use client";

import { Float, MeshDistortMaterial } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const palette = {
  dark: { a: "#9a7dff", b: "#4f9bff", dust: "#b9a8ff", light: 1.4, dustOpacity: 0.9 },
  light: { a: "#6d3df0", b: "#2563eb", dust: "#5b3bd6", light: 1.0, dustOpacity: 0.7 },
};

function Dust({ count, color, opacity }: { count: number; color: string; opacity: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.4 + Math.random() * 3.2;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      p[i * 3] = r * Math.sin(ph) * Math.cos(th);
      p[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.8;
      p[i * 3 + 2] = r * Math.cos(ph);
    }
    return p;
  }, [count]);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 0.04; });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color={color} transparent opacity={opacity} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function Core({ a, b, mobile }: { a: string; b: string; mobile: boolean }) {
  const group = useRef<THREE.Group>(null);
  const wire = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  useFrame((state, dt) => {
    if (group.current) {
      // ease the whole object toward the pointer
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, state.pointer.x * 0.7, 3, dt);
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -state.pointer.y * 0.5, 3, dt);
    }
    if (wire.current) { wire.current.rotation.y -= dt * 0.25; wire.current.rotation.x += dt * 0.12; }
    if (ring.current) ring.current.rotation.z += dt * 0.3;
  });
  return (
    <group ref={group}>
      <Float speed={1.6} rotationIntensity={0.4} floatIntensity={0.8}>
        <mesh>
          <icosahedronGeometry args={[1.25, mobile ? 6 : 12]} />
          <MeshDistortMaterial color={a} distort={0.38} speed={1.8} roughness={0.12} metalness={0.7} emissive={a} emissiveIntensity={0.18} />
        </mesh>
        <mesh ref={wire}>
          <icosahedronGeometry args={[1.75, 1]} />
          <meshBasicMaterial color={b} wireframe transparent opacity={0.45} />
        </mesh>
        <mesh ref={ring} rotation={[1.2, 0.3, 0]}>
          <torusGeometry args={[2.25, 0.012, 8, 120]} />
          <meshBasicMaterial color={b} transparent opacity={0.8} />
        </mesh>
        <mesh rotation={[0.4, 1.1, 0]}>
          <torusGeometry args={[2.55, 0.01, 8, 120]} />
          <meshBasicMaterial color={a} transparent opacity={0.55} />
        </mesh>
      </Float>
    </group>
  );
}

export default function HeroScene() {
  const { resolvedTheme } = useTheme();
  const c = palette[resolvedTheme === "light" ? "light" : "dark"];
  const [mobile, setMobile] = useState(false);
  const [visible, setVisible] = useState(true);
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobile(window.matchMedia("(max-width: 767px)").matches);
    // stop rendering when scrolled out of view: saves battery
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    if (host.current) io.observe(host.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={host} className="h-full w-full">
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={mobile ? [1, 1.25] : [1, 1.7]}
        camera={{ position: [0, 0, 8.2], fov: 45 }}
        gl={{ alpha: true, antialias: !mobile, powerPreference: "high-performance" }}
        style={{ touchAction: "pan-y" }}
      >
        <ambientLight intensity={c.light * 0.55} />
        <directionalLight position={[3, 4, 5]} intensity={c.light * 2.2} color="#ffffff" />
        <pointLight position={[-4, -2, 3]} intensity={c.light * 30} color={c.b} />
        <pointLight position={[3, -3, -2]} intensity={c.light * 18} color={c.a} />
        <Core a={c.a} b={c.b} mobile={mobile} />
        <Dust count={mobile ? 220 : 520} color={c.dust} opacity={c.dustOpacity} />
      </Canvas>
    </div>
  );
}
