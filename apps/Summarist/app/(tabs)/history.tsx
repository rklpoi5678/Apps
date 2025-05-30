import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme, Text, IconButton, SegmentedButtons } from 'react-native-paper';
import { getSummaryHistory, deleteSummaryRecord, SummaryRecord } from '../../src/features/summary/services/storage';
import { useSummaryStore } from '../../src/store/summary';
import { router } from 'expo-router';
import { SummaryResult } from '../../src/features/summary/types';

type ViewMode = 'recent' | 'all';

export default function HistoryTab() {
  const theme = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>('recent');
  const [history, setHistory] = useState<SummaryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { recentSummaries } = useSummaryStore();

  useEffect(() => {
    if (viewMode === 'all') {
      loadHistory();
    }
  }, [viewMode]);

  const loadHistory = async () => {
    try {
      const records = await getSummaryHistory();
      setHistory(records);
    } catch (error) {
      console.error('기록 불러오기 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSummaryRecord(id);
      await loadHistory();
    } catch (error) {
      console.error('기록 삭제 실패:', error);
    }
  };

  const renderItem = ({ item }: { item: SummaryResult | SummaryRecord }) => (
    <TouchableOpacity
      className="mx-4 my-2 p-4 rounded-xl shadow-sm"
      style={{ backgroundColor: theme.colors.surface }}
      onPress={() => router.push({
        pathname: 'summary-detail',
        params: { id: item.id }
      })}
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text 
          className="text-sm"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          {new Date(item.createdAt).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
        {viewMode === 'all' && (
          <IconButton
            icon="delete-outline"
            size={20}
            onPress={() => handleDelete(item.id)}
            iconColor={theme.colors.error}
          />
        )}
      </View>
      <Text 
        className="text-base leading-6"
        style={{ color: theme.colors.onSurface }}
        numberOfLines={2}
      >
        {item.originalText}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading && viewMode === 'all') {
    return (
      <SafeAreaView 
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: theme.colors.background }}
      >
        <Text style={{ color: theme.colors.onBackground }}>로딩 중...</Text>
      </SafeAreaView>
    );
  }

  const data = viewMode === 'recent' ? recentSummaries : history;

  return (
    <SafeAreaView 
      className="flex-1"
      style={{ backgroundColor: theme.colors.background }}
    >
      <View className="p-4">
        <SegmentedButtons
          value={viewMode}
          onValueChange={value => setViewMode(value as ViewMode)}
          buttons={[
            { value: 'recent', label: '최근 요약' },
            { value: 'all', label: '전체 기록' },
          ]}
        />
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingVertical: 16 }}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center p-5">
            <Text 
              className="text-base text-center"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              {viewMode === 'recent' 
                ? '최근 요약 기록이 없습니다.'
                : '저장된 요약 기록이 없습니다.'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
} 