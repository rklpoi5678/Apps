import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SummaryRecord {
  id: string;
  originalText: string;
  summary: string;
  insights: string[];
  checklist: string[];
  createdAt: string;
}

const STORAGE_KEY = '@summarist_history';

export const saveSummaryToStorage = async (
  originalText: string,
  result: {
    summary: string;
    insights: string[];
    checklist: string[];
  }
): Promise<void> => {
  try {
    // 기존 기록 가져오기
    const existingData = await AsyncStorage.getItem(STORAGE_KEY);
    const history: SummaryRecord[] = existingData ? JSON.parse(existingData) : [];

    // 새로운 기록 생성
    const newRecord: SummaryRecord = {
      id: Date.now().toString(),
      originalText,
      ...result,
      createdAt: new Date().toISOString(),
    };

    // 새 기록을 배열 앞에 추가
    history.unshift(newRecord);

    // 최대 50개까지만 저장
    const trimmedHistory = history.slice(0, 50);

    // 저장
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error('요약 기록 저장 중 오류:', error);
    throw error;
  }
};

export const getSummaryHistory = async (): Promise<SummaryRecord[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('요약 기록 불러오기 중 오류:', error);
    return [];
  }
};

export const deleteSummaryRecord = async (id: string): Promise<void> => {
  try {
    const history = await getSummaryHistory();
    const updatedHistory = history.filter(record => record.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('요약 기록 삭제 중 오류:', error);
    throw error;
  }
}; 