import type { ExpoConfig, ConfigContext } from 'expo/config';

const VERSION_NAME = '1.0.4';
const VERSION_CODE = 1000004;

const AND_PACKAGE = "com.youngikim.appsgugutravel"
const IOS_PACKAGE = "com.youngikim.appsgugutravel"

const GOOGLE_MAPS = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL
const SUPABASE__ANON_URL = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
const EAS = process.env.EXPO_PUBLIC_EAS_PROJECT_ID
const GOOGLE_ADS = process.env.EXPO_PUBLIC_GOOGLE_MOBILE_ADS_APP_ID


export default ({ config }: ConfigContext): ExpoConfig => {
  return{
    ...config,
  version: VERSION_NAME,

  android:{
    ...config.android,
    package: AND_PACKAGE,
    versionCode: VERSION_CODE,
    config: {
    googleMaps: {apiKey: GOOGLE_MAPS},
  },
  },
  ios:{
    ...config.ios,
    bundleIdentifier: IOS_PACKAGE,
    buildNumber: VERSION_CODE + '',
  },
  extra: {
    supabaseUrl: SUPABASE_URL,
    supabaseAnonKey: SUPABASE__ANON_URL,
    eas: {projectId: EAS },
    googleAds: {android_app_id: GOOGLE_ADS },
    },
  }
}
