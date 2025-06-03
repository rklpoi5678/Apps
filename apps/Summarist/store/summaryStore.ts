<<<<<<< HEAD
import { create } from 'zustand';

interface SummaryState {
  inputText: string;
  summary: string;
  isLoading: boolean;
  setInputText: (text: string) => void;
  clearInput: () => void;
  setSummary: (text: string) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useSummaryStore = create<SummaryState>((set) => ({
  inputText: '',
  summary: '',
  isLoading: false,
  setInputText: (text) => set({ inputText: text }),
  clearInput: () => set({ inputText: '' }),
  setSummary: (text) => set({ summary: text }),
  setIsLoading: (loading) => set({ isLoading: loading }),
=======
import { create } from 'zustand';

interface SummaryState {
  inputText: string;
  summary: string;
  isLoading: boolean;
  setInputText: (text: string) => void;
  clearInput: () => void;
  setSummary: (text: string) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useSummaryStore = create<SummaryState>((set) => ({
  inputText: '',
  summary: '',
  isLoading: false,
  setInputText: (text) => set({ inputText: text }),
  clearInput: () => set({ inputText: '' }),
  setSummary: (text) => set({ summary: text }),
  setIsLoading: (loading) => set({ isLoading: loading }),
>>>>>>> dde90587f3d9999a117838a03d7309400a6cb1f7
})); 