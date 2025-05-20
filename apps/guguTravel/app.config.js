import 'dotenv/config';

export default {
  expo: {
    name: 'guguTravel',
    slug: 'guguTravel',
    version: '1.0.0',
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
      config:{
        googleMobileAdsAppId: process.env.EXPO_PUBLIC_GOOGLE_IOS_ADS_APP_ID,
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
        googleMaps: { apiKey: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_GEO_API_KEY },
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
          android_app_id: process.env.EXPO_PUBLIC_GOOGLE_MOBILE_ADS_APP_ID,
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
        android: process.env.EXPO_PUBLIC_GOOGLE_MOBILE_ADS_APP_ID,
        ios: process.env.EXPO_PUBLIC_GOOGLE_IOS_ADS_APP_ID
      },
      maps: {
        android: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_GEO_API_KEY,
      }
    }
  },
};
