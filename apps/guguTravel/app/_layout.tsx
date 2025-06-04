// app/_layout.tsx (RootLayout)
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import { AppOpenAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import 'react-native-reanimated';
import { useColorScheme } from 'react-native';

console.log("start")
/* ────── 전역 Splash 제어 ────── */
SplashScreen.preventAutoHideAsync().catch(() => {});

/* ────── 광고 Unit ID ────── */
  const adUnitId = __DEV__ 
  ? TestIds.APP_OPEN // 개발 환경에서는 테스트 ID 사용
    : 'ca-app-pub-5223844528723811/2644353905'// 실제 Android 광고 ID

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = { initialRouteName: '(tabs)' };

export default function RootLayout() {
  const colorScheme                  = useColorScheme();
  const adHasShownRef                = useRef(false);
  const [fontsLoaded, fontsError]    = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  if (!adUnitId) console.warn("❌ adUnitID가 정의되지 않음. 광고는 비활성화됩니다.");
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


  /* ────────── 에러 전파 ────────── */
  useEffect(() => {
    if (fontsError) {
      console.error('❌ 폰트 로드 실패:', fontsError);
      SplashScreen.hideAsync();
      adHasShownRef.current = true;
    }
  }, [fontsError]);

  /* ────────── 렌더링 ────────── */
  // if (!fontsLoaded) return null; // 폰트 준비 전엔 아무것도 그리지 않음

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
