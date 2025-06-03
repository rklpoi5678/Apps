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
})); 