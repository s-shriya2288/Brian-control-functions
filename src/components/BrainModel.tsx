import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sphere, Box, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { brainRegions, BrainRegionID, BrainRegion } from '../data/brainRegions';
import { useBrainStore } from '../store/useBrainStore';

// Note: A real GLTF/GLB requires external assets. Since we don't have a reliable hosted GLTF brain,
// we create a highly stylized abstract representation of brain regions, which looks premium.
const LobeComponent: React.FC<{ region: BrainRegion }> = ({ region }) => {
  const ref = useRef<THREE.Mesh>(null);
  const hoveredRegion = useBrainStore((state) => state.hoveredRegion);
  const selectedRegion = useBrainStore((state) => state.selectedRegion);
  const setHoveredRegion = useBrainStore((state) => state.setHoveredRegion);
  const setSelectedRegion = useBrainStore((state) => state.setSelectedRegion);
  
  const isHovered = hoveredRegion === region.id;
  const isSelected = selectedRegion === region.id;

  const targetScale = isSelected ? new THREE.Vector3(...region.scale).multiplyScalar(1.1) : new THREE.Vector3(...region.scale);
  
  useFrame((state, delta) => {
    if (ref.current) {
      // Gentle floating animation
      ref.current.position.y = region.position[1] + Math.sin(state.clock.elapsedTime * 2 + region.position[0]) * 0.05;
      
      // Smooth scaling
      ref.current.scale.lerp(targetScale, 0.1);
      
      // Material animation
      const material = ref.current.material as THREE.MeshPhysicalMaterial;
      const targetEmissive = isSelected ? 0.8 : (isHovered ? 0.4 : 0.1);
      material.emissiveIntensity = THREE.MathUtils.lerp(material.emissiveIntensity, targetEmissive, 0.1);
    }
  });

  return (
    <group position={region.position}>
      <mesh
        ref={ref}
        onPointerOver={(e) => { e.stopPropagation(); setHoveredRegion(region.id); }}
        onPointerOut={(e) => { e.stopPropagation(); if(hoveredRegion === region.id) setHoveredRegion(null); }}
        onClick={(e) => { e.stopPropagation(); setSelectedRegion(isSelected ? null : region.id); }}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhysicalMaterial 
          color={region.color} 
          emissive={region.color}
          emissiveIntensity={0.1}
          transmission={0.6}
          opacity={0.8}
          transparent
          roughness={0.2}
          thickness={1.5}
        />
      </mesh>
      {isSelected && (
        <Html position={[0, region.scale[1] * 1.5, 0]} center>
          <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-sm font-semibold pointer-events-none whitespace-nowrap border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            {region.name}
          </div>
        </Html>
      )}
    </group>
  );
};

// Particles representing "Thought Simulation"
const SimulateParticles = () => {
  const isSimulatingThoughts = useBrainStore((state) => state.isSimulatingThoughts);
  const pointsRef = useRef<THREE.Points>(null);
  
  const particleCount = 200;
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const regionKeys = Object.keys(brainRegions) as BrainRegionID[];
    
    for (let i = 0; i < particleCount; i++) {
      const region = brainRegions[regionKeys[Math.floor(Math.random() * regionKeys.length)]];
      pos[i * 3] = region.position[0] + (Math.random() - 0.5) * region.scale[0];
      pos[i * 3 + 1] = region.position[1] + (Math.random() - 0.5) * region.scale[1];
      pos[i * 3 + 2] = region.position[2] + (Math.random() - 0.5) * region.scale[2];
      
      const c = new THREE.Color(region.color);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current && isSimulatingThoughts) {
      const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for(let i=0; i<particleCount; i++) {
        pos[i*3 + 1] += Math.sin(state.clock.elapsedTime * 5 + i) * 0.02;
        pos[i*3] += Math.cos(state.clock.elapsedTime * 3 + i) * 0.01;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      pointsRef.current.rotation.y += delta * 0.2;
    }
  });

  if (!isSimulatingThoughts) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={particleCount} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.15} vertexColors transparent opacity={0.8} />
    </points>
  );
};

export const BrainModel: React.FC = () => {
  const { camera } = useThree();
  const selectedRegion = useBrainStore((state) => state.selectedRegion);
  const cameraTarget = useBrainStore((state) => state.cameraTarget);
  
  useFrame(() => {
    // Smooth camera target transition
    const target = new THREE.Vector3(...cameraTarget);
    camera.lookAt(target);
    
    // If a region is selected, gently move camera closer 
    if (selectedRegion) {
      const regionPos = new THREE.Vector3(...brainRegions[selectedRegion].position);
      const camPos = new THREE.Vector3().copy(regionPos).add(new THREE.Vector3(0, 2, 8));
      camera.position.lerp(camPos, 0.02);
    } else {
      camera.position.lerp(new THREE.Vector3(0, 0, 10), 0.02);
    }
  });

  return (
    <group>
      {/* Dynamic Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#45b7d1" />
      <pointLight position={[0, 0, 0]} intensity={0.8} />
      
      <group>
        {(Object.keys(brainRegions) as BrainRegionID[]).map((regionId) => (
          <LobeComponent key={regionId} region={brainRegions[regionId]} />
        ))}
      </group>
      <SimulateParticles />
    </group>
  );
};
