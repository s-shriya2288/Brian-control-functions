'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Environment } from '@react-three/drei';
import { BrainModel } from '../components/BrainModel';
import { OverlayUI } from '../components/OverlayUI';
import { SidePanel } from '../components/SidePanel';

export default function Home() {
  return (
    <main className="w-screen h-screen bg-black overflow-hidden relative font-sans">
      
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <Suspense fallback={null}>
            {/* Environment and Stars */}
            <color attach="background" args={['#050510']} />
            <fog attach="fog" args={['#050510', 10, 30]} />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Environment preset="city" />
            
            {/* Controls */}
            <OrbitControls 
              enablePan={false} 
              enableZoom={true} 
              minDistance={5} 
              maxDistance={20}
              autoRotate
              autoRotateSpeed={0.5}
            />
            
            {/* The Brain */}
            <BrainModel />
          </Suspense>
        </Canvas>
      </div>

      {/* 2D UI Overlay Layer */}
      <OverlayUI />
      <SidePanel />

    </main>
  );
}
