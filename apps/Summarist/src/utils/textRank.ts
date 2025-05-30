import { tokenizeSentences, calculateTFIDF, calculateSimilarity } from './textProcessing';

interface TextRankResult {
  sentences: string[];
  scores: number[];
}

export const textRank = (
  text: string,
  summaryRatio: number = 0.3,
  dampingFactor: number = 0.85,
  maxIterations: number = 100
): TextRankResult => {
  // 문장 분리
  const sentences = tokenizeSentences(text);
  if (sentences.length <= 1) {
    return { sentences, scores: [1] };
  }

  // TF-IDF 계산
  const tfidfVectors = calculateTFIDF(sentences);
  
  // 유사도 행렬 생성
  const similarityMatrix: number[][] = Array(sentences.length)
    .fill(0)
    .map(() => Array(sentences.length).fill(0));

  for (let i = 0; i < sentences.length; i++) {
    for (let j = 0; j < sentences.length; j++) {
      if (i !== j) {
        similarityMatrix[i][j] = calculateSimilarity(tfidfVectors[i], tfidfVectors[j]);
      }
    }
  }

  // PageRank 알고리즘 적용
  const scores = Array(sentences.length).fill(1 / sentences.length);
  const newScores = Array(sentences.length).fill(0);

  for (let iter = 0; iter < maxIterations; iter++) {
    for (let i = 0; i < sentences.length; i++) {
      let sum = 0;
      for (let j = 0; j < sentences.length; j++) {
        if (i !== j) {
          const similaritySum = similarityMatrix[j].reduce((a, b) => a + b, 0);
          if (similaritySum > 0) {
            sum += (similarityMatrix[j][i] / similaritySum) * scores[j];
          }
        }
      }
      newScores[i] = (1 - dampingFactor) + dampingFactor * sum;
    }

    // 점수 업데이트
    const diff = scores.reduce((sum, score, i) => sum + Math.abs(score - newScores[i]), 0);
    scores.splice(0, scores.length, ...newScores);

    if (diff < 1e-6) break;
  }

  return { sentences, scores };
};

export const summarizeText = (text: string, summaryRatio: number = 0.3): string => {
  const { sentences, scores } = textRank(text, summaryRatio);
  
  // 점수에 따라 문장 정렬
  const sentenceScores = sentences.map((sentence, index) => ({
    sentence,
    score: scores[index]
  }));

  sentenceScores.sort((a, b) => b.score - a.score);

  // 요약 비율에 따라 상위 문장 선택
  const numSentences = Math.max(1, Math.ceil(sentences.length * summaryRatio));
  const selectedSentences = sentenceScores
    .slice(0, numSentences)
    .sort((a, b) => sentences.indexOf(a.sentence) - sentences.indexOf(b.sentence))
    .map(item => item.sentence);

  return selectedSentences.join(' ');
}; 