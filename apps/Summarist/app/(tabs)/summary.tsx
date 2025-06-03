<<<<<<< HEAD
import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, useTheme, Snackbar } from 'react-native-paper';
import { useSummaryStore } from '../../src/store/summary';
import { summarizeText } from '../../src/features/summary/services/summary';
import { saveSummaryToStorage } from '../../src/features/summary/services/storage';
import { SummaryOutputCard } from '../../src/features/summary/components/SummaryOutputCard';
import { SummaryResult } from '../../src/features/summary/types';

export default function SummaryTab() {
  const theme = useTheme();
  const { 
    inputText, 
    summaryResult, 
    isLoading, 
    setInputText, 
    setSummaryResult, 
    setIsLoading,
    addRecentSummary
  } = useSummaryStore();

  const [error, setError] = useState<string | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      setError('텍스트를 입력해주세요.');
      setShowSnackbar(true);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // 1. 텍스트 요약 실행
      const result = await summarizeText(inputText);
      
      // 2. 결과를 상태에 저장
      const summaryWithMetadata: SummaryResult = {
        ...result,
        id: Date.now().toString(),
        createdAt: Date.now(),
        originalText: inputText
      };
      
      setSummaryResult(summaryWithMetadata);
      addRecentSummary(summaryWithMetadata);
      
      // 3. 저장소에 저장
      await saveSummaryToStorage(inputText, summaryWithMetadata);
      
      // 4. 성공 메시지 표시
      setShowSnackbar(true);
    } catch (error) {
      console.error('요약 중 오류 발생:', error);
      setError('요약 중 오류가 발생했습니다. 다시 시도해주세요.');
      setShowSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
      style={{ backgroundColor: theme.colors.background }}
    >
      <ScrollView 
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="p-4 space-y-4">
          <TextInput
            mode="outlined"
            multiline
            numberOfLines={6}
            placeholder="텍스트를 여기에 붙여넣으세요..."
            value={inputText}
            onChangeText={setInputText}
            className="min-h-[120px]"
            disabled={isLoading}
            style={{ backgroundColor: theme.colors.surface }}
          />
          <Button
            mode="contained"
            onPress={handleSummarize}
            loading={isLoading}
            disabled={isLoading || !inputText.trim()}
            className="mt-2"
          >
            {isLoading ? '요약 중...' : '요약하기'}
          </Button>
        </View>

        {summaryResult && (
          <View className="p-4">
            <SummaryOutputCard
              summary={summaryResult.summary}
              insights={summaryResult.insights}
              checklist={summaryResult.checklist}
            />
          </View>
        )}
      </ScrollView>

      <Snackbar
        visible={showSnackbar}
        onDismiss={() => setShowSnackbar(false)}
        duration={3000}
        action={{
          label: '확인',
          onPress: () => setShowSnackbar(false),
        }}
        style={{ backgroundColor: error ? theme.colors.error : theme.colors.primary }}
      >
        {error || '요약이 완료되었습니다.'}
      </Snackbar>
    </KeyboardAvoidingView>
  );
=======
import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, useTheme, Snackbar } from 'react-native-paper';
import { useSummaryStore } from '../../src/store/summary';
import { summarizeText } from '../../src/features/summary/services/summary';
import { saveSummaryToStorage } from '../../src/features/summary/services/storage';
import { SummaryOutputCard } from '../../src/features/summary/components/SummaryOutputCard';
import { SummaryResult } from '../../src/features/summary/types';

export default function SummaryTab() {
  const theme = useTheme();
  const { 
    inputText, 
    summaryResult, 
    isLoading, 
    setInputText, 
    setSummaryResult, 
    setIsLoading,
    addRecentSummary
  } = useSummaryStore();

  const [error, setError] = useState<string | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      setError('텍스트를 입력해주세요.');
      setShowSnackbar(true);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // 1. 텍스트 요약 실행
      const result = await summarizeText(inputText);
      
      // 2. 결과를 상태에 저장
      const summaryWithMetadata: SummaryResult = {
        ...result,
        id: Date.now().toString(),
        createdAt: Date.now(),
        originalText: inputText
      };
      
      setSummaryResult(summaryWithMetadata);
      addRecentSummary(summaryWithMetadata);
      
      // 3. 저장소에 저장
      await saveSummaryToStorage(inputText, summaryWithMetadata);
      
      // 4. 성공 메시지 표시
      setShowSnackbar(true);
    } catch (error) {
      console.error('요약 중 오류 발생:', error);
      setError('요약 중 오류가 발생했습니다. 다시 시도해주세요.');
      setShowSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
      style={{ backgroundColor: theme.colors.background }}
    >
      <ScrollView 
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="p-4 space-y-4">
          <TextInput
            mode="outlined"
            multiline
            numberOfLines={6}
            placeholder="텍스트를 여기에 붙여넣으세요..."
            value={inputText}
            onChangeText={setInputText}
            className="min-h-[120px]"
            disabled={isLoading}
            style={{ backgroundColor: theme.colors.surface }}
          />
          <Button
            mode="contained"
            onPress={handleSummarize}
            loading={isLoading}
            disabled={isLoading || !inputText.trim()}
            className="mt-2"
          >
            {isLoading ? '요약 중...' : '요약하기'}
          </Button>
        </View>

        {summaryResult && (
          <View className="p-4">
            <SummaryOutputCard
              summary={summaryResult.summary}
              insights={summaryResult.insights}
              checklist={summaryResult.checklist}
            />
          </View>
        )}
      </ScrollView>

      <Snackbar
        visible={showSnackbar}
        onDismiss={() => setShowSnackbar(false)}
        duration={3000}
        action={{
          label: '확인',
          onPress: () => setShowSnackbar(false),
        }}
        style={{ backgroundColor: error ? theme.colors.error : theme.colors.primary }}
      >
        {error || '요약이 완료되었습니다.'}
      </Snackbar>
    </KeyboardAvoidingView>
  );
>>>>>>> dde90587f3d9999a117838a03d7309400a6cb1f7
} 