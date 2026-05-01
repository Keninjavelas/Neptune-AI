"use client";
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleSystem({ isCritical }: { isCritical: boolean }) {
  const ref = useRef<THREE.Points>(null!);
  
  const count = 3000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    const speed = isCritical ? 1.5 : 0.2;
    ref.current.rotation.x += delta * speed * 0.1;
    ref.current.rotation.y += delta * speed * 0.15;
    
    // Wave effect
    const time = state.clock.getElapsedTime();
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const x = pos[i * 3];
      const z = pos[i * 3 + 2];
      pos[i * 3 + 1] += Math.sin(time + x) * 0.002 * (isCritical ? 5 : 1);
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={isCritical ? '#ef4444' : '#22d3ee'}
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.4}
      />
    </Points>
  );
}

export default function LivingBackground({ isCritical }: { isCritical: boolean }) {
  return (
    <div className="fixed inset-0 -z-10 bg-[#0F172A]">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <color attach="background" args={['#0F172A']} />
        <ParticleSystem isCritical={isCritical} />
      </Canvas>
    </div>
  );
}
