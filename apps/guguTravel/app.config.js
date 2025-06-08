import 'dotenv/config'

const VERSION_NAME = '1.0.4';
const VERSION_CODE = 1000004;

const AND_PACKAGE = "com.youngikim.appsgugutravel"
const IOS_PACKAGE = "com.youngikim.appsgugutravel"

const GOOGLE_MAPS = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY

export default ({ config }) => {
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
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      eas: {projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID },
      googleAds: {android_app_id: process.env.EXPO_PUBLIC_GOOGLE_MOBILE_ADS_APP_ID },
    },
  }
}
