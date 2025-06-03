import { tokenizeSentences, calculateTFIDF, calculateSimilarity } from './textProcessing';

interface TextRankResult {
  sentences: string[];
  scores: number[];
}

interface TextRankOptions {
  summaryRatio: number;
  dampingFactor: number;
  maxIterations: number;
  convergenceThreshold: number;
  maxSentences: number;
}

const DEFAULT_OPTIONS: TextRankOptions = {
  summaryRatio: 0.3,
  dampingFactor: 0.85,
  maxIterations: 100,
  convergenceThreshold: 1e-6,
  maxSentences: 1000, // 성능을 위한 최대 문장 수 제한
};

export const textRank = (
  text: string,
  options: Partial<TextRankOptions> = {}
): TextRankResult => {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  // 문장 분리
  const sentences = tokenizeSentences(text);
  
  if (sentences.length <= 1) {
    return { sentences, scores: [1] };
  }

  // 성능을 위해 문장 수 제한
  const limitedSentences = sentences.slice(0, opts.maxSentences);
  const n = limitedSentences.length;

  // TF-IDF 계산
  const tfidfVectors = calculateTFIDF(limitedSentences);
  
  // 희소 유사도 행렬 생성 (메모리 효율성)
  const similarityMap = new Map<string, number>();
  const getKey = (i: number, j: number) => `${i}-${j}`;
  
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const similarity = calculateSimilarity(tfidfVectors[i], tfidfVectors[j]);
      if (similarity > 0.1) { // 임계값 이하는 저장하지 않음
        similarityMap.set(getKey(i, j), similarity);
        similarityMap.set(getKey(j, i), similarity);
      }
    }
  }

  // PageRank 알고리즘 적용
  const scores = new Array(n).fill(1 / n);
  const newScores = new Array(n).fill(0);

  for (let iter = 0; iter < opts.maxIterations; iter++) {
    for (let i = 0; i < n; i++) {
      let sum = 0;
      let totalSimilarity = 0;
      
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          const similarity = similarityMap.get(getKey(j, i)) || 0;
          if (similarity > 0) {
            // j번째 문장의 총 유사도 계산
            let jTotalSimilarity = 0;
            for (let k = 0; k < n; k++) {
              if (j !== k) {
                jTotalSimilarity += similarityMap.get(getKey(j, k)) || 0;
              }
            }
            
            if (jTotalSimilarity > 0) {
              sum += (similarity / jTotalSimilarity) * scores[j];
            }
          }
        }
      }
      
      newScores[i] = (1 - opts.dampingFactor) / n + opts.dampingFactor * sum;
    }

    // 수렴 확인
    const diff = scores.reduce((sum, score, i) => sum + Math.abs(score - newScores[i]), 0);
    scores.splice(0, scores.length, ...newScores);

    if (diff < opts.convergenceThreshold) {
      console.log(`TextRank converged after ${iter + 1} iterations`);
      break;
    }
  }

  return { sentences: limitedSentences, scores };
};

export const summarizeText = (text: string, summaryRatio: number = 0.3): string => {
  if (!text.trim()) return '';
  
  const { sentences, scores } = textRank(text, { summaryRatio });
  
  if (sentences.length === 0) return '';
  if (sentences.length === 1) return sentences[0];
  
  // 점수에 따라 문장 정렬
  const sentenceScores = sentences.map((sentence, index) => ({
    sentence,
    score: scores[index],
    originalIndex: index
  }));

  sentenceScores.sort((a, b) => b.score - a.score);

  // 요약 비율에 따라 상위 문장 선택
  const numSentences = Math.max(1, Math.ceil(sentences.length * summaryRatio));
  const selectedSentences = sentenceScores
    .slice(0, numSentences)
    .sort((a, b) => a.originalIndex - b.originalIndex) // 원래 순서로 정렬
    .map(item => item.sentence);

  return selectedSentences.join(' ').trim();
};

// 개선된 인사이트 생성
export const generateInsights = (text: string): string[] => {
  if (!text.trim()) return [];
  
  const { sentences, scores } = textRank(text, { summaryRatio: 0.2 });
  
  const insights = sentences
    .map((sentence, index) => ({
      sentence: sentence.trim(),
      score: scores[index]
    }))
    .filter(item => item.sentence.length > 10) // 너무 짧은 문장 제외
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(item => {
      // 문장을 인사이트 형태로 변환
      let insight = item.sentence;
      
      // 마침표 제거
      insight = insight.replace(/[.!?]+$/, '');
      
      // "~다", "~이다" 등을 "~함" 형태로 변환
      insight = insight.replace(/다$/, '함');
      insight = insight.replace(/이다$/, '임');
      
      return insight;
    })
    .filter((insight, index, arr) => arr.indexOf(insight) === index); // 중복 제거

  return insights.slice(0, 3);
};

// 개선된 체크리스트 생성
export const generateChecklist = (text: string): string[] => {
  if (!text.trim()) return [];
  
  const sentences = tokenizeSentences(text);
  
  const actionItems = sentences
    .filter(sentence => {
      const trimmed = sentence.trim();
      // 동작을 나타내는 패턴 찾기
      return (
        /해야|해야 한다|필요하다|중요하다|권장|추천|확인|검토|준비|실행|진행|완료/.test(trimmed) ||
        /하자|하기|하는 것|하도록|하여야/.test(trimmed) ||
        /^[가-힣\s]*[을를]?\s*(하|시|실시|진행|완료|확인|검토|준비|작성|제출|검사)/.test(trimmed)
      );
    })
    .map(sentence => {
      let item = sentence.trim();
      
      // 마침표 제거
      item = item.replace(/[.!?]+$/, '');
      
      // 체크리스트 형태로 변환
      if (!item.endsWith('하기') && !item.endsWith('확인') && !item.endsWith('검토')) {
        // "~다" → "~하기"
        item = item.replace(/한다$/, '하기');
        item = item.replace(/다$/, '하기');
        
        // "~해야" → "~하기"
        item = item.replace(/해야$/, '하기');
        item = item.replace(/해야 한다$/, '하기');
        
        // "~이다" → "~확인하기"
        item = item.replace(/이다$/, ' 확인하기');
      }
      
      return item;
    })
    .filter(item => item.length > 5 && item.length < 100) // 적절한 길이 필터링
    .filter((item, index, arr) => arr.indexOf(item) === index) // 중복 제거
    .slice(0, 5);

  return actionItems;
};
