import React from 'react';
import { View, Text, ScrollView } from 'react-native';

interface SummaryOutputCardProps {
  summary: string;
  insights: string[];
  checklist: string[];
}

export const SummaryOutputCard = ({ summary, insights, checklist }: SummaryOutputCardProps) => {
  return (
    <ScrollView className="bg-white rounded-xl p-4 my-2 shadow-sm">
      <View className="mb-5">
        <Text className="text-lg font-semibold mb-3 text-gray-800">📝 요약</Text>
        <Text className="text-base leading-6 text-gray-600">{summary}</Text>
      </View>

      <View className="mb-5">
        <Text className="text-lg font-semibold mb-3 text-gray-800">💡 인사이트</Text>
        {insights.map((insight, index) => (
          <View key={index} className="flex-row mb-2">
            <Text className="text-base mr-2 text-gray-500">•</Text>
            <Text className="flex-1 text-base leading-6 text-gray-600">{insight}</Text>
          </View>
        ))}
      </View>

      <View className="mb-5">
        <Text className="text-lg font-semibold mb-3 text-gray-800">✅ 실행 체크리스트</Text>
        {checklist.map((item, index) => (
          <View key={index} className="flex-row mb-2 items-center">
            <Text className="text-base mr-2 text-gray-500">□</Text>
            <Text className="flex-1 text-base leading-6 text-gray-600">{item}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}; 