"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, type ThreeElements } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "@/lib/hooks/useMedia";

const EMBER = "#ff4d19";
const BONE = "#ede9e1";

/**
 * Scattered points around the core — depth, not decoration. Generated
 * once at module load (not during render, which must stay pure) since
 * the field's exact positions are decorative and never need to change.
 */
function makeFieldPositions(count: number, radius: number) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = radius * (0.65 + Math.random() * 0.6);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
}

const FIELD_POSITIONS = makeFieldPositions(140, 3.2);

/**
 * A faceted core with two orbiting rings and a loose point field —
 * reads as "the system, made object": a node with structure around it,
 * slowly turning. Pointer adds a gentle tilt on top of the constant spin.
 */
function Node() {
  const group = useRef<THREE.Group>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const field = useRef<THREE.Points>(null);
  const pointer = useRef({ x: 0, y: 0 });

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.7, 1), []);
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry]);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.16;
    group.current.rotation.x += delta * 0.04;

    if (ringA.current) ringA.current.rotation.z += delta * 0.22;
    if (ringB.current) ringB.current.rotation.x += delta * 0.14;
    if (field.current) field.current.rotation.y -= delta * 0.03;

    // Gentle pointer-tilt on top of the constant spin — never fights it.
    const targetX = pointer.current.y * 0.25;
    const targetZ = -pointer.current.x * 0.25;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.02;
    group.current.rotation.z += (targetZ - group.current.rotation.z) * 0.02;

    pointer.current.x = state.pointer.x;
    pointer.current.y = state.pointer.y;
  });

  return (
    <>
      <points ref={field}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[FIELD_POSITIONS, 3]}
          />
        </bufferGeometry>
        <pointsMaterial color={BONE} size={0.02} sizeAttenuation transparent opacity={0.45} />
      </points>

      <mesh ref={ringA} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[2.5, 0.006, 8, 128]} />
        <meshBasicMaterial color={EMBER} transparent opacity={0.35} />
      </mesh>
      <mesh ref={ringB} rotation={[0, Math.PI / 3, Math.PI / 5]}>
        <torusGeometry args={[2.15, 0.005, 8, 128]} />
        <meshBasicMaterial color={BONE} transparent opacity={0.22} />
      </mesh>

      <group ref={group}>
        <lineSegments geometry={edges}>
          <lineBasicMaterial color={BONE} transparent opacity={0.55} />
        </lineSegments>
        <mesh geometry={geometry}>
          <meshBasicMaterial color={EMBER} wireframe transparent opacity={0.2} />
        </mesh>
        <points geometry={geometry}>
          <pointsMaterial color={EMBER} size={0.05} sizeAttenuation />
        </points>
      </group>
    </>
  );
}

function StaticNode(props: ThreeElements["group"]) {
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.7, 1), []);
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry]);
  return (
    <group {...props}>
      <mesh rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[2.5, 0.006, 8, 128]} />
        <meshBasicMaterial color={EMBER} transparent opacity={0.35} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={BONE} transparent opacity={0.55} />
      </lineSegments>
      <points geometry={geometry}>
        <pointsMaterial color={EMBER} size={0.05} sizeAttenuation />
      </points>
    </group>
  );
}

/**
 * One contained WebGL moment — not a scene, not a game. A rotating
 * wireframe core with two orbiting rings, standing in where a portrait
 * would otherwise sit. Frozen (no rAF loop) under prefers-reduced-motion.
 */
export function TraceNode() {
  const reduced = useReducedMotion();

  return (
    <Canvas
      camera={{ position: [0, 0, 6.4], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      className="touch-none!"
    >
      {reduced ? <StaticNode rotation={[0.4, 0.6, 0]} /> : <Node />}
    </Canvas>
  );
}
