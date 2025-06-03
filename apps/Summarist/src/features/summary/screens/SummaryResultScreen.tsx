import React from 'react';
import { View, ScrollView } from 'react-native';
import { useSummaryStore } from '../../../store/summary';
import { SummaryOutputCard } from '../components/SummaryOutputCard';

export const SummaryResultScreen = () => {
  const summaryResult = useSummaryStore((state) => state.summaryResult);

  if (!summaryResult) {
    return null;
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <SummaryOutputCard
          summary={summaryResult.summary}
          insights={summaryResult.insights}
          checklist={summaryResult.checklist}
        />
      </View>
    </ScrollView>
  );
}; 