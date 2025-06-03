import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <PaperProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="summary-detail" 
          options={{ 
            title: '요약 상세',
            headerShown: true 
          }} 
        />
      </Stack>
    </PaperProvider>
  );
}
