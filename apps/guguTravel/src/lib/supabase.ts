import 'react-native-url-polyfill/auto'
import 'react-native-get-random-values'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import Constants from 'expo-constants'

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl ?? ''
const supabaseKey = Constants.expoConfig?.extra?.supabaseAnonKey ?? ''

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
    db: {
        schema: 'public',
    },
})

// Geo 데이터를 가져오는 함수
export async function getOsmData() {
  const { data, error } = await supabase
    .from('raw_osm')
    .select('name, wkb_geometry')
    .not('name', 'is', null)  // name이 null이 아닌 데이터만

  if (error) {
    console.error('Error fetching OSM data:', error)
    return null
  }

  return data
}

// 특정 영역 내의 데이터만 가져오는 함수 (예: 현재 위치 기준 반경 3km)
export async function getNearbyOsmData(latitude: number, longitude: number, radiusKm: number = 3) {
  const { data, error } = await supabase
    .rpc('get_nearby_places', {
      lat: latitude,
      lon: longitude,
      radius: radiusKm
    })

  if (error) {
    console.error('Error fetching nearby OSM data:', error)
    return null
  }

  return data
}
