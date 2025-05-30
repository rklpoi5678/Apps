import { summarizeText as textRankSummarize, generateInsights, generateChecklist } from '../../../utils/textRank-improved';

export interface SummaryResult {
  summary: string;
  insights: string[];
  checklist: string[];
  metadata: {
    originalLength: number;
    summaryLength: number;
    compressionRatio: number;
    processingTime: number;
    sentenceCount: number;
    wordCount: number;
  };
}

export interface SummaryOptions {
  summaryRatio?: number;
  includeInsights?: boolean;
  includeChecklist?: boolean;
  minTextLength?: number;
}

const DEFAULT_OPTIONS: Required<SummaryOptions> = {
  summaryRatio: 0.3,
  includeInsights: true,
  includeChecklist: true,
  minTextLength: 50,
};

export const summarizeTextAdvanced = async (
  text: string,
  options: SummaryOptions = {}
): Promise<SummaryResult> => {
  const startTime = performance.now();
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  // 입력 검증
  if (!text || typeof text !== 'string') {
    throw new Error('유효한 텍스트를 입력해주세요.');
  }
  
  const trimmedText = text.trim();
  if (trimmedText.length < opts.minTextLength) {
    throw new Error(`텍스트가 너무 짧습니다. 최소 ${opts.minTextLength}자 이상 입력해주세요.`);
  }
  
  // 텍스트 전처리
  const preprocessedText = preprocessText(trimmedText);
  
  try {
    // 병렬 처리로 성능 향상
    const [summary, insights, checklist] = await Promise.all([
      Promise.resolve(summarizeText(preprocessedText, opts.summaryRatio)),
      opts.includeInsights ? Promise.resolve(generateInsights(preprocessedText)) : Promise.resolve([]),
      opts.includeChecklist ? Promise.resolve(generateChecklist(preprocessedText)) : Promise.resolve([])
    ]);
    
    const endTime = performance.now();
    const processingTime = endTime - startTime;
    
    // 메타데이터 계산
    const originalLength = trimmedText.length;
    const summaryLength = summary.length;
    const compressionRatio = summaryLength / originalLength;
    const sentenceCount = (summary.match(/[.!?]+/g) || []).length;
    const wordCount = summary.split(/\s+/).filter(word => word.length > 0).length;
    
    // 결과 검증
    if (!summary || summary.length === 0) {
      throw new Error('요약을 생성할 수 없습니다. 텍스트를 확인해주세요.');
    }
    
    return {
      summary: summary.trim(),
      insights: insights.filter(insight => insight.length > 0),
      checklist: checklist.filter(item => item.length > 0),
      metadata: {
        originalLength,
        summaryLength,
        compressionRatio: Math.round(compressionRatio * 100) / 100,
        processingTime: Math.round(processingTime),
        sentenceCount,
        wordCount
      }
    };
    
  } catch (error) {
    console.error('요약 처리 중 오류:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('요약 처리 중 예상치 못한 오류가 발생했습니다.');
  }
};

// 텍스트 전처리 함수
function preprocessText(text: string): string {
  return text
    // 연속된 공백 정리
    .replace(/\s+/g, ' ')
    // 연속된 줄바꿈 정리
    .replace(/\n\s*\n/g, '\n')
    // 특수문자 정리 (한글, 영문, 숫자, 기본 문장부호만 유지)
    .replace(/[^\w\s가-힣.!?,:;()\-"']/g, '')
    // 앞뒤 공백 제거
    .trim();
}

// 요약 품질 평가 함수
export const evaluateSummaryQuality = (
  originalText: string,
  summary: string
): {
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 100;
  
  const originalLength = originalText.length;
  const summaryLength = summary.length;
  const compressionRatio = summaryLength / originalLength;
  
  // 압축률 평가
  if (compressionRatio > 0.8) {
    score -= 20;
    feedback.push('요약이 원문과 너무 유사합니다.');
  } else if (compressionRatio < 0.1) {
    score -= 15;
    feedback.push('요약이 너무 짧을 수 있습니다.');
  }
  
  // 문장 구조 평가
  const summarysentences = (summary.match(/[.!?]+/g) || []).length;
  if (summarysentences === 0) {
    score -= 30;
    feedback.push('요약에 완전한 문장이 없습니다.');
  }
  
  // 내용 다양성 평가 (단어 중복도)
  const words = summary.toLowerCase().split(/\s+/);
  const uniqueWords = new Set(words);
  const diversity = uniqueWords.size / words.length;
  
  if (diversity < 0.5) {
    score -= 10;
    feedback.push('요약의 어휘 다양성이 부족합니다.');
  }
  
  // 최종 점수 조정
  score = Math.max(0, Math.min(100, score));
  
  if (feedback.length === 0) {
    feedback.push('좋은 품질의 요약입니다.');
  }
  
  return { score, feedback };
};

// 배치 요약 처리 (여러 텍스트 동시 처리)
export const summarizeMultipleTexts = async (
  texts: string[],
  options: SummaryOptions = {}
): Promise<SummaryResult[]> => {
  if (!Array.isArray(texts) || texts.length === 0) {
    throw new Error('유효한 텍스트 배열을 입력해주세요.');
  }
  
  const results = await Promise.allSettled(
    texts.map(text => summarizeTextAdvanced(text, options))
  );
  
  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      console.error(`텍스트 ${index + 1} 요약 실패:`, result.reason);
      throw new Error(`텍스트 ${index + 1} 요약에 실패했습니다: ${result.reason.message}`);
    }
  });
};

// 기존 함수와의 호환성을 위한 래퍼
export const summarizeText = async (text: string): Promise<Omit<SummaryResult, 'metadata'>> => {
  const result = await summarizeTextAdvanced(text);
  return {
    summary: result.summary,
    insights: result.insights,
    checklist: result.checklist
  };
};
