import React from 'react';
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator, Alert } from 'react-native';
import { useSummaryStore } from '../../src/store/summary';
import { summarizeText } from '../../src/services/summary';
import { saveSummaryToStorage } from '../../src/services/storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  SummaryInput: undefined;
  SummaryResult: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SummaryInput'>;

export const SummaryInputScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { 
    inputText, 
    summaryResult, 
    isLoading, 
    setInputText, 
    setSummaryResult, 
    setIsLoading 
  } = useSummaryStore();

  const handleSummarize = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    try {
      const result = await summarizeText(inputText);
      
      // 더미 데이터로 결과 생성
      const dummyResult = {
        summary: "이 문서는 프로젝트 관리에 대한 핵심 개념을 설명합니다. 주요 내용은 다음과 같습니다:\n1. 프로젝트의 목표와 범위 설정\n2. 팀 구성과 역할 분담\n3. 일정 관리와 마일스톤 설정\n4. 리스크 관리와 대응 전략\n5. 품질 관리와 검증 방법",
        insights: [
          "프로젝트의 성공은 명확한 목표 설정에서 시작됩니다.",
          "팀원 간의 효과적인 커뮤니케이션이 프로젝트 진행의 핵심입니다.",
          "리스크 관리는 사전 예방이 가장 중요합니다."
        ],
        checklist: [
          "프로젝트 목표 문서화하기",
          "주요 이해관계자 미팅 일정 잡기",
          "초기 리스크 평가 진행하기",
          "팀 역할 분담 문서 작성하기",
          "첫 번째 마일스톤 계획 수립하기"
        ]
      };

      setSummaryResult(dummyResult);
      await saveSummaryToStorage(inputText, dummyResult);
      
      // 결과 화면으로 이동
      navigation.navigate('SummaryResult');
    } catch (error) {
      console.error('요약 중 오류 발생:', error);
      Alert.alert('오류', '요약을 생성하는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white p-4">
      <TextInput
        className="flex-1 border border-gray-200 rounded-lg p-3 mb-4 text-base bg-gray-50"
        multiline
        placeholder="텍스트를 여기에 붙여넣으세요..."
        value={inputText}
        onChangeText={setInputText}
        textAlignVertical="top"
        editable={!isLoading}
      />
      <TouchableOpacity 
        className={`bg-blue-500 p-4 rounded-lg items-center mb-4 ${isLoading ? 'opacity-50' : ''}`}
        onPress={handleSummarize}
        disabled={isLoading || !inputText.trim()}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-base font-semibold">요약하기</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}; 