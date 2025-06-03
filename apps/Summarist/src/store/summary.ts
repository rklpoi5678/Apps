<<<<<<< HEAD
import { create } from 'zustand';
import { SummaryResult } from '../features/summary/types';

interface SummaryState {
  // 입력 텍스트
  inputText: string;
  setInputText: (text: string) => void;
  
  // 요약 결과
  summaryResult: SummaryResult | null;
  setSummaryResult: (result: SummaryResult | null) => void;
  
  // 로딩 상태
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // 최근 요약 기록
  recentSummaries: SummaryResult[];
  addRecentSummary: (summary: SummaryResult) => void;
  clearRecentSummaries: () => void;
}

export const useSummaryStore = create<SummaryState>((set) => ({
  // 입력 텍스트 상태
  inputText: '',
  setInputText: (text) => set({ inputText: text }),
  
  // 요약 결과 상태
  summaryResult: null,
  setSummaryResult: (result) => set({ summaryResult: result }),
  
  // 로딩 상태
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  // 최근 요약 기록
  recentSummaries: [],
  addRecentSummary: (summary) => 
    set((state) => ({
      recentSummaries: [summary, ...state.recentSummaries].slice(0, 10) // 최근 10개만 유지
    })),
  clearRecentSummaries: () => set({ recentSummaries: [] }),
=======
import { create } from 'zustand';
import { SummaryResult } from '../features/summary/types';

interface SummaryState {
  // 입력 텍스트
  inputText: string;
  setInputText: (text: string) => void;
  
  // 요약 결과
  summaryResult: SummaryResult | null;
  setSummaryResult: (result: SummaryResult | null) => void;
  
  // 로딩 상태
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // 최근 요약 기록
  recentSummaries: SummaryResult[];
  addRecentSummary: (summary: SummaryResult) => void;
  clearRecentSummaries: () => void;
}

export const useSummaryStore = create<SummaryState>((set) => ({
  // 입력 텍스트 상태
  inputText: '',
  setInputText: (text) => set({ inputText: text }),
  
  // 요약 결과 상태
  summaryResult: null,
  setSummaryResult: (result) => set({ summaryResult: result }),
  
  // 로딩 상태
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  // 최근 요약 기록
  recentSummaries: [],
  addRecentSummary: (summary) => 
    set((state) => ({
      recentSummaries: [summary, ...state.recentSummaries].slice(0, 10) // 최근 10개만 유지
    })),
  clearRecentSummaries: () => set({ recentSummaries: [] }),
>>>>>>> dde90587f3d9999a117838a03d7309400a6cb1f7
})); 