import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { SummaryResult } from '../features/summary/types';

interface SummaryState {
  // 입력 텍스트
  inputText: string;
  setInputText: (text: string) => void;
  clearInputText: () => void;
  
  // 요약 결과
  summaryResult: SummaryResult | null;
  setSummaryResult: (result: SummaryResult | null) => void;
  
  // 로딩 상태
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // 최근 요약 기록 (persist)
  recentSummaries: SummaryResult[];
  addRecentSummary: (summary: SummaryResult) => void;
  removeRecentSummary: (id: string) => void;
  clearRecentSummaries: () => void;
  
  // 설정
  settings: {
    maxRecentSummaries: number;
    summaryRatio: number;
    autoSave: boolean;
  };
  updateSettings: (settings: Partial<SummaryState['settings']>) => void;
}

export const useSummaryStore = create<SummaryState>()(
  persist(
    immer((set, get) => ({
      // 입력 텍스트 상태 (persist 제외)
      inputText: '',
      setInputText: (text) => set((state) => {
        state.inputText = text;
      }),
      clearInputText: () => set((state) => {
        state.inputText = '';
      }),
      
      // 요약 결과 상태 (persist 제외)
      summaryResult: null,
      setSummaryResult: (result) => set((state) => {
        state.summaryResult = result;
      }),
      
      // 로딩 상태 (persist 제외)
      isLoading: false,
      setIsLoading: (loading) => set((state) => {
        state.isLoading = loading;
      }),
      
      // 최근 요약 기록 (persist 포함)
      recentSummaries: [],
      addRecentSummary: (summary) => set((state) => {
        // 중복 제거
        const existingIndex = state.recentSummaries.findIndex(s => s.id === summary.id);
        if (existingIndex >= 0) {
          state.recentSummaries.splice(existingIndex, 1);
        }
        
        // 최신 항목을 맨 앞에 추가
        state.recentSummaries.unshift(summary);
        
        // 최대 개수 제한
        if (state.recentSummaries.length > state.settings.maxRecentSummaries) {
          state.recentSummaries.splice(state.settings.maxRecentSummaries);
        }
      }),
      removeRecentSummary: (id) => set((state) => {
        const index = state.recentSummaries.findIndex(s => s.id === id);
        if (index >= 0) {
          state.recentSummaries.splice(index, 1);
        }
      }),
      clearRecentSummaries: () => set((state) => {
        state.recentSummaries = [];
      }),
      
      // 설정 (persist 포함)
      settings: {
        maxRecentSummaries: 20,
        summaryRatio: 0.3,
        autoSave: true,
      },
      updateSettings: (newSettings) => set((state) => {
        Object.assign(state.settings, newSettings);
      }),
    })),
    {
      name: 'summary-store',
      partialize: (state) => ({
        // persist할 항목만 선택
        recentSummaries: state.recentSummaries,
        settings: state.settings,
      }),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        // 버전 마이그레이션 로직
        if (version === 0) {
          // v0에서 v1로 마이그레이션
          return {
            ...persistedState,
            settings: {
              maxRecentSummaries: 20,
              summaryRatio: 0.3,
              autoSave: true,
              ...persistedState.settings,
            },
          };
        }
        return persistedState;
      },
    }
  )
);
