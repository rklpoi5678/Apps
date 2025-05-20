import { StyleSheet, Platform, View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

// 실제 광고 ID와 테스트 ID를 분리
const BANNER_ID = __DEV__ 
  ? TestIds.BANNER // 개발 환경에서는 테스트 ID 사용
  : Platform.OS === 'android'
    ? 'ca-app-pub-5223844528723811/4957255119' // 실제 Android 광고 ID
    : 'ca-app-pub-5223844528723811/4957255119'; // 실제 iOS 광고 ID

export default function AdBanner() {
  return (
    <View style={styles.container}>
      <BannerAd
        unitId={BANNER_ID}
        size={BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => {
          console.log('광고 로드 성공');
        }}
        onAdFailedToLoad={(error) => {
          console.error('광고 로드 실패:', error);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
