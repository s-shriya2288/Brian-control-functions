import { create } from 'zustand';
import { BrainRegionID } from '../data/brainRegions';

interface BrainState {
  hoveredRegion: BrainRegionID | null;
  setHoveredRegion: (id: BrainRegionID | null) => void;
  selectedRegion: BrainRegionID | null;
  setSelectedRegion: (id: BrainRegionID | null) => void;
  isSimulatingThoughts: boolean;
  setSimulatingThoughts: (isSimulating: boolean) => void;
  isRotating: boolean;
  setRotating: (isRotating: boolean) => void;
  cameraTarget: [number, number, number];
  setCameraTarget: (target: [number, number, number]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useBrainStore = create<BrainState>((set) => ({
  hoveredRegion: null,
  setHoveredRegion: (id) => set({ hoveredRegion: id }),
  selectedRegion: null,
  setSelectedRegion: (id) => set({ selectedRegion: id }),
  isSimulatingThoughts: false,
  setSimulatingThoughts: (isSimulating) => set({ isSimulatingThoughts: isSimulating }),
  isRotating: false,
  setRotating: (isRotating) => set({ isRotating }),
  cameraTarget: [0, 0, 0],
  setCameraTarget: (target) => set({ cameraTarget: target }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
