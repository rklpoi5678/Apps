import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import { getSummaryHistory, SummaryRecord } from '../src/features/summary/services/storage';
import { SummaryOutputCard } from '../src/features/summary/components/SummaryOutputCard';

export default function SummaryDetailScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [record, setRecord] = useState<SummaryRecord | null>(null);

  useEffect(() => {
    loadSummaryDetail();
  }, [id]);

  const loadSummaryDetail = async () => {
    try {
      const history = await getSummaryHistory();
      const found = history.find(item => item.id === id);
      if (found) {
        setRecord(found);
      }
    } catch (error) {
      console.error('요약 상세 정보 불러오기 실패:', error);
    }
  };

  if (!record) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.onBackground }}>로딩 중...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <SummaryOutputCard
        summary={record.summary}
        insights={record.insights}
        checklist={record.checklist}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
}); 