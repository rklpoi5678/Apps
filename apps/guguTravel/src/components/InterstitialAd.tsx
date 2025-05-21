// src/ads/interstitial.ts
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';

/* 실제 Unit ID는 .env 로부터 */
const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : Platform.select({
      ios: process.env.EXPO_PUBLIC_GOOGLE_IOS_ADS_APP_ID,
      android: process.env.EXPO_PUBLIC_GOOGLE_MOBILE_ADS_APP_ID,
    })!;

/** 싱글턴 인스턴스  */
let ad = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

/** 마지막으로 **성공적으로 화면에 노출** 된 시각 (epoch-ms) */
let lastShown = 0;

/** 다음 광고 미리 로드 */
export const preloadInterstitial = () => {
  if (!ad.loaded) ad.load();
};

/**
 * 전면 광고를 요청한다.
 *
 * - `minIntervalMs` 이내에 이미 한 번 노출되었다면 *바로 리턴* 하며,
 *   대신 **다음 광고만** 백그라운드 로드한다.
 * - 광고가 실제로 보여지면 `true`, 쿨다운으로 스킵되면 `false` 를 반환한다.
 */
export function showInterstitial(
  onClose?: () => void,
  minIntervalMs: number = 120_000, // 기본 2분
): boolean {
  const now = Date.now();

  /* ───── 쿨-다운: 아직 간격이 안 지났으면 Skip ───── */
  if (now - lastShown < minIntervalMs) {
    preloadInterstitial();
    return false;
  }

  /* ───── ‘닫힘’ & ‘에러’ 공통 후처리 ───── */
  const prepareNext = () => {
    lastShown = Date.now();          // 실제 노출(or 시도) 시각 기록
    onClose?.();

    // 새 인스턴스로 교체하여 다음 광고 선 로드
    ad = InterstitialAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });
    preloadInterstitial();
  };

  /* ───── 광고 노출 로직 ───── */
  const doShow = () => {
    ad.addAdEventListener(AdEventType.CLOSED, prepareNext);
    ad.addAdEventListener(AdEventType.ERROR, prepareNext);
    ad.show();
  };

  if (ad.loaded) {
    doShow();
  } else {
    const loadedSub = ad.addAdEventListener(AdEventType.LOADED, () => {
      loadedSub();        // once
      doShow();
    });
    ad.load();
  }

  return true;
}
