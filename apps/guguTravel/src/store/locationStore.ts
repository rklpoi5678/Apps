import { create } from 'zustand';

interface LocationState {
  selectedLocation: {
    latitude: number;
    longitude: number;
    name: string;
  } | null;
  setSelectedLocation: (location: { latitude: number; longitude: number; name: string } | null) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  selectedLocation: null,
  setSelectedLocation: (location) => set({ selectedLocation: location }),
}));
