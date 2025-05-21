// app/_layout.tsx (RootLayout)
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import { AppOpenAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';

/* ────── 전역 Splash 제어 ────── */
SplashScreen.preventAutoHideAsync().catch(() => {});

/* ────── 광고 Unit ID ────── */
const adUnitId =
  process.env.EXPO_PUBLIC_ADMOB_APP_OPEN_ID ??
  (__DEV__ ? TestIds.APP_OPEN : undefined); // 운영 ID는 .env 로부터

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = { initialRouteName: '(tabs)' };

export default function RootLayout() {
  const colorScheme                  = useColorScheme();
  const router                       = useRouter();
  const pathname                     = usePathname();
  const adHasShownRef                = useRef(false);
  const [fontsLoaded, fontsError]    = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  /* ────────── App-Open Ad 로직 ────────── */
  useEffect(() => {
    if (!fontsLoaded || adHasShownRef.current || !adUnitId) return;

    const ad = AppOpenAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });

    const handleLoaded = () => {
      SplashScreen.hideAsync();     // 광고가 곧 오버레이되므로 Splash 제거
      ad.show();
    };

    const handleClosed = () => {    // 한 세션당 1회
      adHasShownRef.current = true;
    };

    ad.addAdEventListener(AdEventType.LOADED,  handleLoaded);
    ad.addAdEventListener(AdEventType.CLOSED,  handleClosed);
    ad.addAdEventListener(AdEventType.ERROR,   handleClosed); // 실패 시에도 플래그 ON
    ad.load();

    /* 4 초 안에 LOAD 안 되면 Splash 닫고 앱 진입 */
    const fallback = setTimeout(() => {
      if (!adHasShownRef.current) {
        SplashScreen.hideAsync();
        handleClosed();
      }
    }, 4000);

    return () => {
      clearTimeout(fallback);
      ad.removeAllListeners();
    };
  }, [fontsLoaded]);

  /* ────────── 5 초 뒤 지도 탭으로 자동 이동 ────────── */
  useEffect(() => {
    if (!fontsLoaded) return;

    const timer = setTimeout(() => {
      // 이미 /map 에 있으면 패스
      if (!router.canGoBack() || !pathname?.includes('/index')) {
        router.push('/(tabs)');
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [fontsLoaded, pathname]);

  /* ────────── 에러 전파 ────────── */
  useEffect(() => {
    if (fontsError) throw fontsError;
  }, [fontsError]);

  /* ────────── 렌더링 ────────── */
  if (!fontsLoaded) return null; // 폰트 준비 전엔 아무것도 그리지 않음

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName="(tabs)">
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false, animation: 'none' }}
        />
      </Stack>
    </ThemeProvider>
  );
}
