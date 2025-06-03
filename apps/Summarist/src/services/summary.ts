import { summarizeText as textRankSummarize } from '../utils/textRank';

interface SummaryResult {
  summary: string;
  insights: string[];
  checklist: string[];
}

export const summarizeText = async (text: string): Promise<SummaryResult> => {
  // TextRank를 사용하여 요약 생성
  const summary = textRankSummarize(text, 0.3);

  // 인사이트 생성 (요약에서 핵심 문장 추출)
  const insights = textRankSummarize(text, 0.2)
    .split('.')
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .slice(0, 3);

  // 체크리스트 생성 (요약에서 동사로 시작하는 문장 추출)
  const checklist = textRankSummarize(text, 0.4)
    .split('.')
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .filter(s => /^[가-힣]/.test(s)) // 한글로 시작하는 문장만 선택
    .slice(0, 5)
    .map(s => s.replace(/^[가-힣]+/, m => m + '하기')); // 동사형으로 변환

  return {
    summary,
    insights,
    checklist
  };
}; 