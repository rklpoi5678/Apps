import 'dotenv/config';

const GOOGLE_ADS_ANDROID_ID = process.env.EXPO_PUBLIC_GOOGLE_MOBILE_ADS_APP_ID;
const GOOGLE_MAPS_KEY = process.env.GOOGLE_ANDROID_GEO_API_KEY;

if (!GOOGLE_ADS_ANDROID_ID) {
  throw new Error("❌ Google Ads App ID가 .env에 정의되어 있지 않습니다.");
}

export default {
  expo: {
    name: 'guguTravel',
    slug: 'guguTravel',
    version: '1.0.1',
    orientation: 'portrait',
    icon: './assets/images/guguTravel_app_icon.png',
    scheme: 'gugutravel',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    splash: {
      image: './assets/images/guguTravel_splash.png',
      resizeMode: 'cover',
      backgroundColor: '#ffffff',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      bundlerIdentifier: 'com.anonymous.guguTravel',
      supportsTablet: true,
      infoPlist: {
        NSUserTrackingUsageDescription: 'This identifier will be used to deliver personalized ads to you.',
        SKAdNetworkItems: [
          {
            SKAdNetworkIdentifier: 'cstr6suwn9.skadnetwork',
          },
        ],
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      permissions: [
        'android.permission.ACCESS_FINE_LOCATION',
        'android.permission.ACCESS_COARSE_LOCATION',
      ],
      config:{
        googleMaps: { apiKey: GOOGLE_MAPS_KEY },
      },
      package: 'com.anonymous.guguTravel',
      
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/guguTravel_favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'react-native-google-mobile-ads',
        {
          androidAppId: GOOGLE_ADS_ANDROID_ID,
        },
      ],
      [
        'expo-build-properties',
        {
          android: {
            useCleartextTraffic: true,
            architecture: ['arm64-v8a'],
          },
        },
      ],

    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      eas:{
        projectId:"24a832d5-a4ca-453d-a500-da18b15b6f1d"
      },
      googleAds: {
        android: GOOGLE_ADS_ANDROID_ID,
      },
      maps: {
        android: GOOGLE_MAPS_KEY,
      },
    }
  },
};
