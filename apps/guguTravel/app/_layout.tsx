// app/_layout.tsx (RootLayout)
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as Sentry from '@sentry/react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState, useCallback } from 'react';
import { AppOpenAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import 'react-native-reanimated';
import { useColorScheme } from 'react-native';


Sentry.init({
  dsn: 'https://836c76c37eae48ccd70e17b9bdfe23c6@o4509365761867776.ingest.us.sentry.io/4509365764751360', //실제 DNS로 교체하십시오
  debug: true, // `true`로 설정하면, Sentry는 이벤트 전송 중 문제가 발생할 경우 유용한 디버깅 정보를 출력하려고 시도합니다. 프로덕션에서는 `false`로 설정하세요.
  tracesSampleRate: 1.0, // 추적을 위한 트랜잭션의 100%를 캡처하려면 tracesSampleRate를 1.0으로 설정하세요. 프로덕션에서 이 값을 조정하세요.
  sendDefaultPii: true
});

/* ────── 전역 Splash 제어 ────── */
SplashScreen.preventAutoHideAsync().catch(() => {});

console.log("start")

/* ────── 광고 Unit ID ────── */
  const AD_UNIT_ID = __DEV__ 
  ? TestIds.APP_OPEN // 개발 환경에서는 테스트 ID 사용
    : 'ca-app-pub-5223844528723811/2644353905'// 실제 Android 광고 ID

const APP_OPEN_AD_TIMEOUT_MS = 4000; // 4초 안에 광고가 로드x 시 앱진입

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = { initialRouteName: '(tabs)' };

//rootlayout 컴포넌트 정의
function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, fontsError] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const [appOpenAdProcessed, setAppOpenAdProcessed] = useState(false);
  // Ref to store the loaded AppOpenAd instance
  const loadedAppOpenAd = useRef<AppOpenAd | null>(null);
  // Ref to prevent showing the ad more than once per session (as per your original logic)
  const hasShownAdThisSession = useRef(false);

  // Function to load the App Open Ad
  const loadAppOpenAd = useCallback(() => {
    if (!AD_UNIT_ID) {
      console.warn("❌ adUnitID가 정의되지 않음. 광고는 비활성화됩니다.");
      setAppOpenAdProcessed(true); // Mark as processed if no ad ID
      return;
    }

    const adInstance = AppOpenAd.createForAdRequest(AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: true,
    });

    const handleLoaded = () => {
      console.log('AppOpenAd LOADED');
      loadedAppOpenAd.current = adInstance; // Store the loaded instance
    };

    const handleError = (error: any) => {
      console.error('AppOpenAd FAILED to load:', error);
      setAppOpenAdProcessed(true); // Mark as processed on error to proceed
      loadedAppOpenAd.current = null; // Clear loaded ad on error
    };

    const handleClosed = () => {
      console.log('AppOpenAd CLOSED');
      hasShownAdThisSession.current = true; // Mark as shown for the session
      setAppOpenAdProcessed(true); // Mark as processed when closed
      loadedAppOpenAd.current = null; // Clear loaded ad after showing
    };

    adInstance.addAdEventListener(AdEventType.LOADED, handleLoaded);
    adInstance.addAdEventListener(AdEventType.CLOSED, handleClosed);
    adInstance.addAdEventListener(AdEventType.ERROR, handleError);

    adInstance.load();

    // Cleanup listeners if the component unmounts before load
    return () => {
      adInstance.removeAllListeners();
    };
  }, []); // No dependencies as it's a pure load function

  // Effect for initial font loading and ad processing
  useEffect(() => {
    if (fontsError) {
      console.error('❌ 폰트 로드 실패:', fontsError);
      SplashScreen.hideAsync();
      setAppOpenAdProcessed(true); // Proceed even if fonts fail
      return;
    }

    if (!fontsLoaded || appOpenAdProcessed) {
      return; // Wait for fonts or if ad already processed
    }

    // Attempt to load the ad
    const cleanupLoad = loadAppOpenAd();

    // Fallback timer: Hide splash and mark ad as processed if ad doesn't load within timeout
    const fallbackTimer = setTimeout(() => {
      if (!appOpenAdProcessed) { // Only hide if ad hasn't been processed yet
        console.log("⏱️ 광고 로드 타임아웃. 스플래시 화면 숨김.");
        SplashScreen.hideAsync();
        setAppOpenAdProcessed(true);
      }
    }, APP_OPEN_AD_TIMEOUT_MS);

    // Main cleanup
    return () => {
      clearTimeout(fallbackTimer);
      if (cleanupLoad) cleanupLoad(); // Clean up ad listeners if provided
    };
  }, [fontsLoaded, fontsError, appOpenAdProcessed, loadAppOpenAd]);

  // Effect to show the ad once loaded and ready
  useEffect(() => {
    // Only try to show if fonts are loaded, ad is processed,
    // an ad is actually loaded, and it hasn't been shown this session.
    if (fontsLoaded && appOpenAdProcessed && loadedAppOpenAd.current && !hasShownAdThisSession.current) {
      // Hide splash just before showing the ad (redundant if LOADED already handled it, but safe)
      SplashScreen.hideAsync();
      loadedAppOpenAd.current.show();
      // hasShownAdThisSession.current will be set in handleClosed
    }
  }, [fontsLoaded, appOpenAdProcessed]);


  /* ────────── 렌더링 ────────── */
  if (!fontsLoaded || !appOpenAdProcessed) {
    return null; // Don't render anything until fonts and ad are processed
  }

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

// 루트 레이아웃 컴포넌트를 센트리.wrap으로 감싸 제스처 정보 및 프로파일링 데이터를 캡쳐한다.
export default Sentry.wrap(RootLayout);