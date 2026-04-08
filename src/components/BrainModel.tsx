import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { brainRegions, BrainRegionID, BrainRegion } from '../data/brainRegions';
import { useBrainStore } from '../store/useBrainStore';

const OrganicLobe: React.FC<{ region: BrainRegion }> = ({ region }) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  
  const hoveredRegion = useBrainStore((state) => state.hoveredRegion);
  const selectedRegion = useBrainStore((state) => state.selectedRegion);
  const setHoveredRegion = useBrainStore((state) => state.setHoveredRegion);
  const setSelectedRegion = useBrainStore((state) => state.setSelectedRegion);
  
  const isHovered = hoveredRegion === region.id;
  const isSelected = selectedRegion === region.id;

  const targetScale = isSelected 
    ? new THREE.Vector3(...region.scale).multiplyScalar(1.25) 
    : new THREE.Vector3(...region.scale);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation per lobe
      groupRef.current.position.y = region.position[1] + Math.sin(state.clock.elapsedTime * 1.5 + region.position[0]) * 0.05;
      
      // Smooth scaling when selected
      groupRef.current.scale.lerp(targetScale, 0.1);
    }
    
    // Pulsating Intense Glow when selected
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshPhysicalMaterial;
      if (isSelected) {
        // Bright pulse for selected
        const pulse = 2.0 + Math.sin(state.clock.elapsedTime * 6) * 1.0;
        material.emissiveIntensity = THREE.MathUtils.lerp(material.emissiveIntensity, pulse, 0.1);
        material.opacity = THREE.MathUtils.lerp(material.opacity, 1.0, 0.1);
      } else {
        // Dim unselected completely
        const targetIntensity = isHovered ? 0.8 : 0.02;
        material.emissiveIntensity = THREE.MathUtils.lerp(material.emissiveIntensity, targetIntensity, 0.1);
        material.opacity = THREE.MathUtils.lerp(material.opacity, 0.35, 0.1);
      }
    }
  });

  return (
    <group ref={groupRef} position={region.position}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => { e.stopPropagation(); setHoveredRegion(region.id); }}
        onPointerOut={(e) => { e.stopPropagation(); if(hoveredRegion === region.id) setHoveredRegion(null); }}
        onClick={(e) => { e.stopPropagation(); setSelectedRegion(isSelected ? null : region.id); }}
      >
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color={region.color}
          emissive={region.color}
          emissiveIntensity={0.15}
          roughness={0.4}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.2}
          distort={0.5} 
          speed={isSelected ? 3 : 1.5} 
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Label for selected region */}
      {isSelected && (
        <Html position={[0, 1.8, 0]} center zIndexRange={[100, 0]}>
          <div className="bg-white/10 backdrop-blur-xl px-5 py-2 rounded-full text-white text-md font-extrabold pointer-events-none whitespace-nowrap border border-white/50 shadow-[0_0_30px_rgba(255,255,255,0.6)] select-none">
            {region.name}
          </div>
        </Html>
      )}
    </group>
  );
};

const SimulateParticles = () => {
  const isSimulatingThoughts = useBrainStore((state) => state.isSimulatingThoughts);
  const pointsRef = useRef<THREE.Points>(null);
  
  const particleCount = 400;
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const regionKeys = Object.keys(brainRegions) as BrainRegionID[];
    
    for (let i = 0; i < particleCount; i++) {
      const region = brainRegions[regionKeys[Math.floor(Math.random() * regionKeys.length)]];
      pos[i * 3] = region.position[0] + (Math.random() - 0.5) * region.scale[0] * 1.5;
      pos[i * 3 + 1] = region.position[1] + (Math.random() - 0.5) * region.scale[1] * 1.5;
      pos[i * 3 + 2] = region.position[2] + (Math.random() - 0.5) * region.scale[2] * 1.5;
      
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
        pos[i*3 + 1] += Math.sin(state.clock.elapsedTime * 8 + i) * 0.03;
        pos[i*3] += Math.cos(state.clock.elapsedTime * 6 + i) * 0.02;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  if (!isSimulatingThoughts) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.12} vertexColors transparent opacity={0.9} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
};

export const BrainModel: React.FC = () => {
  const { camera } = useThree();
  const selectedRegion = useBrainStore((state) => state.selectedRegion);
  const cameraTarget = useBrainStore((state) => state.cameraTarget);
  const isRotating = useBrainStore((state) => state.isRotating);
  
  const rootGroupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    const storeState = useBrainStore.getState();
    // Smooth panning of OrbitControls target instead of forcing camera.position
    const ctrl = state.controls as any;
    if (ctrl) {
      let targetPos = new THREE.Vector3(0, 0, 0);
      if (storeState.selectedRegion) {
        targetPos = new THREE.Vector3(...brainRegions[storeState.selectedRegion].position);
      }
      ctrl.target.lerp(targetPos, 0.05);
      ctrl.update();
    }

    // Note: Rotation is now handled by OrbitControls autoRotate natively!
  });

  return (
    <group ref={rootGroupRef}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 15, 10]} intensity={1.5} color="#ffffff" shadow-mapSize={[1024, 1024]} castShadow />
      <directionalLight position={[-10, -10, -10]} intensity={0.8} color="#45b7d1" />
      <pointLight position={[0, 0, 0]} intensity={1.2} distance={10} color="#ffffff" />
      
      <group>
        {(Object.keys(brainRegions) as BrainRegionID[]).map((regionId) => (
          <OrganicLobe key={regionId} region={brainRegions[regionId]} />
        ))}
      </group>
      <SimulateParticles />
    </group>
  );
};
