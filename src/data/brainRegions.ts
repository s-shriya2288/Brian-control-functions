export type BrainRegionID = 'frontal' | 'parietal' | 'temporal' | 'occipital' | 'cerebellum' | 'brainstem';

export interface BrainRegion {
  id: BrainRegionID;
  name: string;
  color: string;
  position: [number, number, number];
  scale: [number, number, number];
  primaryFunctions: string[];
  neurotransmitters: string[];
  whatIfScenario: string;
  searchTerms: string[];
}

export const brainRegions: Record<BrainRegionID, BrainRegion> = {
  frontal: {
    id: 'frontal',
    name: 'Frontal Lobe',
    color: '#ff6b6b',
    position: [0, 1, 1.5],
    scale: [2.2, 1.8, 2],
    primaryFunctions: ['Executive function', 'Motor control', 'Problem solving', 'Speech production (Broca\'s area)'],
    neurotransmitters: ['Dopamine', 'Glutamate'],
    whatIfScenario: 'Damage to the frontal lobe can result in profound personality changes, loss of impulse control, and difficulty with complex planning (e.g., Phineas Gage).',
    searchTerms: ['speech', 'personality', 'motor', 'decision', 'planning', 'frontal', 'broca'],
  },
  parietal: {
    id: 'parietal',
    name: 'Parietal Lobe',
    color: '#4ecdc4',
    position: [0, 2, -0.5],
    scale: [2.2, 1.6, 1.8],
    primaryFunctions: ['Sensory processing', 'Spatial awareness', 'Navigation', 'Touch perception'],
    neurotransmitters: ['GABA', 'Glutamate'],
    whatIfScenario: 'Damage here can cause "hemispatial neglect"—the patient might completely ignore one side of their visual field or even one side of their own body.',
    searchTerms: ['senses', 'spatial', 'navigation', 'touch', 'pain', 'parietal'],
  },
  temporal: {
    id: 'temporal',
    name: 'Temporal Lobe',
    color: '#45b7d1',
    position: [0, -0.2, 0],
    scale: [2.6, 1.2, 2.2],
    primaryFunctions: ['Auditory processing', 'Memory formation (Hippocampus)', 'Language comprehension (Wernicke\'s area)', 'Emotion (Amygdala)'],
    neurotransmitters: ['Serotonin', 'Acetylcholine'],
    whatIfScenario: 'Damage can lead to amnesia or "Wernicke\'s aphasia," where patients can speak fluently but their words lack meaning (word salad).',
    searchTerms: ['hearing', 'memory', 'language', 'emotion', 'temporal', 'wernicke', 'amygdala', 'hippocampus'],
  },
  occipital: {
    id: 'occipital',
    name: 'Occipital Lobe',
    color: '#96ceb4',
    position: [0, 0.5, -2],
    scale: [2, 1.5, 1.5],
    primaryFunctions: ['Visual processing', 'Color recognition', 'Depth perception', 'Motion tracking'],
    neurotransmitters: ['GABA', 'Glutamate'],
    whatIfScenario: 'Even with perfectly healthy eyes, severe damage to the occipital lobe can cause "cortical blindness," an inability to process visual information.',
    searchTerms: ['vision', 'sight', 'eyes', 'visual', 'color', 'occipital'],
  },
  cerebellum: {
    id: 'cerebellum',
    name: 'Cerebellum',
    color: '#ffeead',
    position: [0, -1.5, -1.8],
    scale: [1.6, 1.0, 1.4],
    primaryFunctions: ['Balance', 'Coordination', 'Fine motor control', 'Motor learning'],
    neurotransmitters: ['GABA', 'Glutamate'],
    whatIfScenario: 'Damage profoundly affects movement, causing tremors, unsteady gait, and inability to perform rapid alternating movements (ataxia).',
    searchTerms: ['balance', 'coordination', 'movement', 'motor', 'cerebellum'],
  },
  brainstem: {
    id: 'brainstem',
    name: 'Brain Stem',
    color: '#d4a5a5',
    position: [0, -2.5, -0.5],
    scale: [0.8, 1.5, 0.8],
    primaryFunctions: ['Breathing', 'Heart rate regulation', 'Consciousness', 'Sleep cycles'],
    neurotransmitters: ['Serotonin', 'Norepinephrine', 'Acetylcholine'],
    whatIfScenario: 'Crucial for basic survival. Severe damage is often fatal, causing failure of respiration, heartbeat out of rhythm, or deep coma.',
    searchTerms: ['breathing', 'heart', 'survival', 'sleep', 'consciousness', 'brainstem', 'stem'],
  }
};
