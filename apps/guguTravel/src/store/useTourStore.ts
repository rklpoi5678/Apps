import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface TourState {
  tours: Tour[];
  addTour: (tour: Tour) => void;
  removeTour: (id: string) => void;
}

export interface Tour {
  id: string;
  name: string;
  title: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
  };
  phone: string;
  localPrice?: number;
  distance?: number;
}

export const useTourStore = create<TourState>()(
  persist(
    immer((set) => ({
      tours: [
        {
          id: '1',
          name: '홍대',
          title: '홍대 투어',
          description: '홍대 투어 설명',
          location: { latitude: 37.5665, longitude: 126.9780 },
          phone: '010-1234-5678',
          localPrice: 10000,
        },
        {
          id: '2',
          name: '대구',
          title: '대구 투어',
          description: '대구 투어 설명',
          location: { latitude: 35.832872, longitude: 128.558635 },
          phone: '010-1234-5678',
          localPrice: 10000,
        },
      ],
      addTour: (tour) =>
        set((state) => {
          state.tours.push(tour);
        }),
      removeTour: (id) =>
        set((state) => {
          state.tours = state.tours.filter((tour) => tour.id !== id);
        }),
    })),
    {
      name: 'tour-storage',
    }
  )
); 