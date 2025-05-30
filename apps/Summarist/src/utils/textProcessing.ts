// 문장 토크나이저
export const tokenizeSentences = (text: string): string[] => {
  // 문장 구분자: 마침표, 물음표, 느낌표 + 공백 또는 줄바꿈
  const sentenceRegex = /[^.!?]+[.!?]+(\s|$)/g;
  const sentences = text.match(sentenceRegex) || [];
  return sentences.map(s => s.trim()).filter(s => s.length > 0);
};

// 단어 토크나이저
export const tokenizeWords = (text: string): string[] => {
  return text
    .toLowerCase()
    .replace(/[^\w\s가-힣]/g, '') // 특수문자 제거
    .split(/\s+/) // 공백으로 분리
    .filter(word => word.length > 0); // 빈 문자열 제거
};

// TF-IDF 계산
export const calculateTFIDF = (sentences: string[]): Map<string, number>[] => {
  const wordFrequency: Map<string, number> = new Map();
  const sentenceWordFrequencies: Map<string, number>[] = [];
  
  // 각 문장의 단어 빈도 계산
  sentences.forEach(sentence => {
    const words = tokenizeWords(sentence);
    const frequency = new Map<string, number>();
    
    words.forEach(word => {
      frequency.set(word, (frequency.get(word) || 0) + 1);
      wordFrequency.set(word, (wordFrequency.get(word) || 0) + 1);
    });
    
    sentenceWordFrequencies.push(frequency);
  });

  // TF-IDF 계산
  return sentenceWordFrequencies.map(sentenceFreq => {
    const tfidf = new Map<string, number>();
    
    sentenceFreq.forEach((freq, word) => {
      const tf = freq / sentenceFreq.size;
      const idf = Math.log(sentences.length / (wordFrequency.get(word) || 1));
      tfidf.set(word, tf * idf);
    });
    
    return tfidf;
  });
};

// 문장 간 유사도 계산 (코사인 유사도)
export const calculateSimilarity = (
  tfidf1: Map<string, number>,
  tfidf2: Map<string, number>
): number => {
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  // 모든 단어에 대해 계산
  const allWords = new Set([...tfidf1.keys(), ...tfidf2.keys()]);
  
  allWords.forEach(word => {
    const val1 = tfidf1.get(word) || 0;
    const val2 = tfidf2.get(word) || 0;
    
    dotProduct += val1 * val2;
    norm1 += val1 * val1;
    norm2 += val2 * val2;
  });

  if (norm1 === 0 || norm2 === 0) return 0;
  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}; 