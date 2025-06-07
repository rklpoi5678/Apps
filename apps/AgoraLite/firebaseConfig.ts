// firebaseConfig.ts
import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { initializeAuth , getReactNativePersistence} from "firebase/auth"
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage"
import Constants from "expo-constants"

const API_KEY = Constants.expoConfig?.extra?.apiKey
const AUTH_DOMAIN = Constants.expoConfig?.extra?.authDomain
const PROJECT_ID = Constants.expoConfig?.extra?.projectId
const STORAGE_BUCKET = Constants.expoConfig?.extra?.storageBucket
const APP_ID = Constants.expoConfig?.extra?.appId
const MEASUREMENT_ID = Constants.expoConfig?.extra?.measurementId
// Firebase 콘솔에서 복사해 온 설정 객체
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  // databaseURL: 'https://a...', //Realtime Database 사용 시 필요
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
}

// Firebase 앱 초기화
let app
if (!getApps().length) {
    app = initializeApp(firebaseConfig)
} else {
    app = getApp()
}

// 인증(필요 시)
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
})
// Firestore 참조
export const db = getFirestore(app)
