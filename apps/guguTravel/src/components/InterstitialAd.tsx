import React, { useEffect, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import { useRouter } from 'expo-router';

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-5223844528723811/2204174667';

export default function InterstitialSplashScreen() {
  const router = useRouter();
  const [adLoaded, setAdLoaded] = useState(false);
  const [fallbackTriggered, setFallbackTriggered] = useState(false);
  const interstitial = useRef(
    InterstitialAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    })
  ).current;

  useEffect(() => {
    const loadedListener = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setAdLoaded(true);
    });

    const closedListener = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      router.replace('/(tabs)');
    });

    const errorListener = interstitial.addAdEventListener(AdEventType.ERROR, () => {
      setTimeout(() => router.replace('/(tabs)'), 1000);
    });

    interstitial.load();

    const fallbackTimeout = setTimeout(() => {
      if (!adLoaded) {
        setFallbackTriggered(true); // fallback 트리거
      }
    }, 4000);

    return () => {
      loadedListener();
      closedListener();
      errorListener();
      clearTimeout(fallbackTimeout);
    };
  }, []);

  // 광고 로딩 후 show
  useEffect(() => {
    if (adLoaded) {
      interstitial.show();
    }
  }, [adLoaded]);

  // fallback 시간 초과 시 이동
  useEffect(() => {
    if (fallbackTriggered) {
      router.replace('/(tabs)');
    }
  }, [fallbackTriggered]);

  return (
    <View>
      <Text>로딩 중... 광고 준비 중</Text>
    </View>
  );
}
