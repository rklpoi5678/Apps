
module.exports = {
  version: "1.0.2",
  config: {
    googleMaps: {apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY},
  },
  android:{package: "com.youngikim.appsgugutravel"},
  ios:{bundleIdentifier: "com.youngikim.appsgugutravel"},
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    eas: {projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID},
    googleAds: {android_app_id: process.env.EXPO_PUBLIC_GOOGLE_MOBILE_ADS_APP_ID},
    },
}
