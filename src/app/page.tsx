'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Environment } from '@react-three/drei';
import { BrainModel } from '../components/BrainModel';
import { OverlayUI } from '../components/OverlayUI';
import { SidePanel } from '../components/SidePanel';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useBrainStore } from '../store/useBrainStore';

export default function Home() {
  const isRotating = useBrainStore(state => state.isRotating);
  return (
    <main className="w-screen h-screen bg-black overflow-hidden relative font-sans">
      
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
          <Suspense fallback={null}>
            {/* Environment and Stars */}
            <color attach="background" args={['#020205']} />
            <fog attach="fog" args={['#020205', 15, 40]} />
            <Stars radius={100} depth={50} count={6000} factor={4} saturation={0} fade speed={1} />
            <Environment preset="city" />
            
            {/* Controls */}
            <OrbitControls 
              makeDefault
              enablePan={true} 
              enableZoom={true} 
              minDistance={5} 
              maxDistance={30}
              dampingFactor={0.05}
              autoRotate={isRotating}
              autoRotateSpeed={2.0}
            />
            
            {/* The Brain */}
            <BrainModel />
            
            <EffectComposer>
              <Bloom luminanceThreshold={1} mipmapBlur intensity={0.4} radius={0.4} />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </div>

      {/* 2D UI Overlay Layer */}
      <OverlayUI />
      <SidePanel />

    </main>
  );
}
