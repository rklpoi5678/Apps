<<<<<<< HEAD
import React from 'react';
import { View, ScrollView } from 'react-native';
import { useSummaryStore } from '../../src/store/summary';
import { SummaryOutputCard } from '../../components/SummaryOutputCard';

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
=======
import React from 'react';
import { View, ScrollView } from 'react-native';
import { useSummaryStore } from '../../src/store/summary';
import { SummaryOutputCard } from '../../components/SummaryOutputCard';

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
>>>>>>> dde90587f3d9999a117838a03d7309400a6cb1f7
}; 