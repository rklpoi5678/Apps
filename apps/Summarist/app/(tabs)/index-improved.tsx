<<<<<<< HEAD
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, useTheme, Snackbar } from 'react-native-paper';
import { useSummaryStore } from '../../src/store/summary';
import { summarizeText } from '../../src/features/summary/services/summary';
import { saveSummaryToStorage } from '../../src/features/summary/services/storage';
import { SummaryOutputCard } from '../../src/features/summary/components/SummaryOutputCard';
import { SummaryResult } from '../../src/features/summary/types';

type SnackbarState = {
  visible: boolean;
  message: string;
  type: 'success' | 'error';
};

export default function SummaryTab() {
  const theme = useTheme();
  const isMountedRef = useRef(true);
  
  const { 
    inputText, 
    summaryResult, 
    isLoading, 
    setInputText,
    setSummaryResult, 
    setIsLoading,
    addRecentSummary
  } = useSummaryStore();

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    visible: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const showSnackbar = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    if (!isMountedRef.current) return;
    
    setSnackbar({
      visible: true,
      message,
      type
    });
  }, []);

  const hideSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, visible: false }));
  }, []);

  const handleSummarize = useCallback(async () => {
    const trimmedText = inputText.trim();
    
    if (!trimmedText) {
      showSnackbar('텍스트를 입력해주세요.', 'error');
      return;
    }
    
    if (trimmedText.length < 10) {
      showSnackbar('더 긴 텍스트를 입력해주세요. (최소 10자)', 'error');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await summarizeText(trimmedText);
      
      if (!isMountedRef.current) return;
      
      const summaryWithMetadata: SummaryResult = {
        ...result,
        id: Date.now().toString(),
        createdAt: Date.now(),
        originalText: trimmedText
      };
      
      setSummaryResult(summaryWithMetadata);
      addRecentSummary(summaryWithMetadata);
      
      // 저장은 백그라운드에서 처리
      saveSummaryToStorage(trimmedText, summaryWithMetadata).catch(error => {
        console.warn('저장 중 오류:', error);
      });
      
      showSnackbar('요약이 완료되었습니다.', 'success');
    } catch (error) {
      if (!isMountedRef.current) return;
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : '요약 중 오류가 발생했습니다. 다시 시도해주세요.';
      
      console.error('요약 중 오류 발생:', error);
      showSnackbar(errorMessage, 'error');
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [inputText, setIsLoading, setSummaryResult, addRecentSummary, showSnackbar]);

  const isButtonDisabled = isLoading || !inputText.trim();

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ 
        flex: 1,
        backgroundColor: theme.colors.background 
      }}
    >
      <ScrollView 
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View style={{ padding: 16, gap: 16 }}>
          <TextInput
            mode="outlined"
            multiline
            numberOfLines={6}
            placeholder="텍스트를 여기에 붙여넣으세요..."
            value={inputText}
            onChangeText={setInputText}
            disabled={isLoading}
            accessibilityLabel="요약할 텍스트 입력"
            accessibilityHint="여기에 요약하고 싶은 텍스트를 입력하세요"
            style={{ 
              minHeight: 120,
              backgroundColor: theme.colors.surface 
            }}
          />
          
          <Button
            mode="contained"
            onPress={handleSummarize}
            loading={isLoading}
            disabled={isButtonDisabled}
            accessibilityLabel={isLoading ? '요약 진행 중' : '텍스트 요약하기'}
            accessibilityHint="입력한 텍스트를 요약합니다"
          >
            {isLoading ? '요약 중...' : '요약하기'}
          </Button>
        </View>

        {summaryResult && (
          <View style={{ padding: 16 }}>
            <SummaryOutputCard
              summary={summaryResult.summary}
              insights={summaryResult.insights}
              checklist={summaryResult.checklist}
            />
          </View>
        )}
      </ScrollView>

      <Snackbar
        visible={snackbar.visible}
        onDismiss={hideSnackbar}
        duration={snackbar.type === 'error' ? 4000 : 3000}
        action={{
          label: '확인',
          onPress: hideSnackbar,
        }}
        style={{ 
          backgroundColor: snackbar.type === 'error' 
            ? theme.colors.error 
            : theme.colors.primary 
        }}
      >
        {snackbar.message}
      </Snackbar>
    </KeyboardAvoidingView>
  );
}
=======
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, useTheme, Snackbar } from 'react-native-paper';
import { useSummaryStore } from '../../src/store/summary';
import { summarizeText } from '../../src/features/summary/services/summary';
import { saveSummaryToStorage } from '../../src/features/summary/services/storage';
import { SummaryOutputCard } from '../../src/features/summary/components/SummaryOutputCard';
import { SummaryResult } from '../../src/features/summary/types';

type SnackbarState = {
  visible: boolean;
  message: string;
  type: 'success' | 'error';
};

export default function SummaryTab() {
  const theme = useTheme();
  const isMountedRef = useRef(true);
  
  const { 
    inputText, 
    summaryResult, 
    isLoading, 
    setInputText,
    setSummaryResult, 
    setIsLoading,
    addRecentSummary
  } = useSummaryStore();

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    visible: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const showSnackbar = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    if (!isMountedRef.current) return;
    
    setSnackbar({
      visible: true,
      message,
      type
    });
  }, []);

  const hideSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, visible: false }));
  }, []);

  const handleSummarize = useCallback(async () => {
    const trimmedText = inputText.trim();
    
    if (!trimmedText) {
      showSnackbar('텍스트를 입력해주세요.', 'error');
      return;
    }
    
    if (trimmedText.length < 10) {
      showSnackbar('더 긴 텍스트를 입력해주세요. (최소 10자)', 'error');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await summarizeText(trimmedText);
      
      if (!isMountedRef.current) return;
      
      const summaryWithMetadata: SummaryResult = {
        ...result,
        id: Date.now().toString(),
        createdAt: Date.now(),
        originalText: trimmedText
      };
      
      setSummaryResult(summaryWithMetadata);
      addRecentSummary(summaryWithMetadata);
      
      // 저장은 백그라운드에서 처리
      saveSummaryToStorage(trimmedText, summaryWithMetadata).catch(error => {
        console.warn('저장 중 오류:', error);
      });
      
      showSnackbar('요약이 완료되었습니다.', 'success');
    } catch (error) {
      if (!isMountedRef.current) return;
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : '요약 중 오류가 발생했습니다. 다시 시도해주세요.';
      
      console.error('요약 중 오류 발생:', error);
      showSnackbar(errorMessage, 'error');
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [inputText, setIsLoading, setSummaryResult, addRecentSummary, showSnackbar]);

  const isButtonDisabled = isLoading || !inputText.trim();

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ 
        flex: 1,
        backgroundColor: theme.colors.background 
      }}
    >
      <ScrollView 
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View style={{ padding: 16, gap: 16 }}>
          <TextInput
            mode="outlined"
            multiline
            numberOfLines={6}
            placeholder="텍스트를 여기에 붙여넣으세요..."
            value={inputText}
            onChangeText={setInputText}
            disabled={isLoading}
            accessibilityLabel="요약할 텍스트 입력"
            accessibilityHint="여기에 요약하고 싶은 텍스트를 입력하세요"
            style={{ 
              minHeight: 120,
              backgroundColor: theme.colors.surface 
            }}
          />
          
          <Button
            mode="contained"
            onPress={handleSummarize}
            loading={isLoading}
            disabled={isButtonDisabled}
            accessibilityLabel={isLoading ? '요약 진행 중' : '텍스트 요약하기'}
            accessibilityHint="입력한 텍스트를 요약합니다"
          >
            {isLoading ? '요약 중...' : '요약하기'}
          </Button>
        </View>

        {summaryResult && (
          <View style={{ padding: 16 }}>
            <SummaryOutputCard
              summary={summaryResult.summary}
              insights={summaryResult.insights}
              checklist={summaryResult.checklist}
            />
          </View>
        )}
      </ScrollView>

      <Snackbar
        visible={snackbar.visible}
        onDismiss={hideSnackbar}
        duration={snackbar.type === 'error' ? 4000 : 3000}
        action={{
          label: '확인',
          onPress: hideSnackbar,
        }}
        style={{ 
          backgroundColor: snackbar.type === 'error' 
            ? theme.colors.error 
            : theme.colors.primary 
        }}
      >
        {snackbar.message}
      </Snackbar>
    </KeyboardAvoidingView>
  );
}
>>>>>>> dde90587f3d9999a117838a03d7309400a6cb1f7
