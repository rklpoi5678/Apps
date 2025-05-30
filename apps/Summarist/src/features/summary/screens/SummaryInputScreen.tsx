import React from 'react';
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator, Alert } from 'react-native';
import { useSummaryStore } from '../../../store/summary';
import { summarizeText } from '../services/summary';
import { saveSummaryToStorage } from '../services/storage';
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
      setSummaryResult(result);
      await saveSummaryToStorage(inputText, result);
      
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