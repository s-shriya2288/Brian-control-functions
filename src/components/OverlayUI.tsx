'use client';
import React, { useState, useEffect } from 'react';
import { Search, Zap, Loader2 } from 'lucide-react';
import { useBrainStore } from '../store/useBrainStore';
import { brainRegions, BrainRegionID } from '../data/brainRegions';

export const OverlayUI: React.FC = () => {
  const [localSearch, setLocalSearch] = useState('');
  
  const setSelectedRegion = useBrainStore(state => state.setSelectedRegion);
  const isSimulating = useBrainStore(state => state.isSimulatingThoughts);
  const setSimulating = useBrainStore(state => state.setSimulatingThoughts);
  const setCameraTarget = useBrainStore(state => state.setCameraTarget);

  useEffect(() => {
    if (localSearch.trim() === '') return;
    
    const query = localSearch.toLowerCase();
    
    // Find matching region
    for (const [id, region] of Object.entries(brainRegions)) {
      if (
        region.name.toLowerCase().includes(query) || 
        region.searchTerms.some(term => term.toLowerCase().includes(query))
      ) {
        setSelectedRegion(id as BrainRegionID);
        setCameraTarget(region.position);
        break; // stop at first match
      }
    }
  }, [localSearch, setSelectedRegion, setCameraTarget]);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 flex flex-col justify-between p-8">
      
      {/* Top Header & Search */}
      <div className="flex justify-between items-start pointer-events-auto w-full max-w-7xl mx-auto">
        <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center animate-pulse">
            <Loader2 className="text-white w-6 h-6 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wider">Neuro-Navigator Pro</h1>
            <p className="text-xs text-slate-400 font-medium">Interactive 3D Cerebral Mapping</p>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-80 pl-11 pr-4 py-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl text-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-xl"
            placeholder="Search regions, functions (e.g. 'Speech')"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="pointer-events-auto flex justify-center w-full">
        <button
          onClick={() => setSimulating(!isSimulating)}
          className={`flex items-center gap-3 px-8 py-4 rounded-full font-bold text-sm tracking-widest transition-all duration-300 shadow-[0_0_30px_-5px_currentColor] border ${
            isSimulating 
            ? 'bg-purple-600/20 text-purple-300 border-purple-500 shadow-purple-500/50' 
            : 'bg-white/10 text-white border-white/20 hover:bg-white/20 hover:scale-105'
          }`}
        >
          <Zap className={`w-5 h-5 ${isSimulating ? 'text-purple-400 fill-purple-400 animate-pulse' : ''}`} />
          {isSimulating ? 'HALT SIMULATION' : 'SIMULATE THOUGHT'}
        </button>
      </div>

    </div>
  );
};
