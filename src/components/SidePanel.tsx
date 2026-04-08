'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBrainStore } from '../store/useBrainStore';
import { brainRegions } from '../data/brainRegions';
import { X, Activity, Brain, AlertTriangle } from 'lucide-react';

export const SidePanel: React.FC = () => {
  const selectedRegionId = useBrainStore((state) => state.selectedRegion);
  const setSelectedRegion = useBrainStore((state) => state.setSelectedRegion);

  const region = selectedRegionId ? brainRegions[selectedRegionId] : null;

  return (
    <AnimatePresence>
      {region && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="fixed top-0 right-0 h-full w-[400px] z-50 p-6 overscroll-contain overflow-y-auto"
        >
          {/* Glassmorphism Panel */}
          <div className="relative h-full w-full rounded-2xl bg-slate-900/40 backdrop-blur-3xl border border-white/10 shadow-2xl p-8 text-slate-100 flex flex-col gap-6">
            
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3 mb-2"
                >
                  <div className="w-4 h-4 rounded-full shadow-[0_0_10px_currentColor]" style={{ color: region.color, backgroundColor: region.color }} />
                  <h2 className="text-3xl font-bold tracking-tight">{region.name}</h2>
                </motion.div>
                <div className="h-1 w-20 rounded-full" style={{ backgroundColor: region.color }} />
              </div>
              <button 
                onClick={() => setSelectedRegion(null)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close panel"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Primary Functions */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4"
            >
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-3">
                <Brain className="w-4 h-4" />
                Primary Functions
              </h3>
              <ul className="space-y-2">
                {region.primaryFunctions.map((func, i) => (
                  <li key={i} className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span className="text-sm">{func}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Neurotransmitters */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4" />
                Neurotransmitters
              </h3>
              <div className="flex flex-wrap gap-2">
                {region.neurotransmitters.map((nt, i) => (
                  <span key={i} className="px-3 py-1 bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 rounded-full text-xs font-medium">
                    {nt}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* What If Scenario */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-auto bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <AlertTriangle className="w-24 h-24 text-amber-500" />
              </div>
              <h3 className="text-sm font-semibold text-amber-500 uppercase tracking-widest flex items-center gap-2 mb-3 relative z-10">
                <AlertTriangle className="w-4 h-4" />
                "What If?" Scenario
              </h3>
              <p className="text-sm text-amber-100/80 leading-relaxed relative z-10">
                {region.whatIfScenario}
              </p>
            </motion.div>
            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
