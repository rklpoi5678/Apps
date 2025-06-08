import 'react-native-url-polyfill/auto'
import 'react-native-get-random-values'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import Constants from 'expo-constants'
import { OsmPlace } from '@/types/map'

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseKey = Constants.expoConfig?.extra?.supabaseAnonKey;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL or key not found in app.json');
}

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

// getOsmData는 전체 데이터를 가져오므로 주의 (규모가 작을 때만 사용)
// 대규모 데이터라면 getNearbyOsmData를 사용하거나, 페이징/필터링 로직 추가 고려
export async function getOsmData() {
  const { data, error } = await supabase
    .from('raw_osm')
    .select('name, wkb_geometry')
    .not('name', 'is', null)  // name이 null이 아닌 데이터만
    //.limit(100) // 예시: 100개만 가져오도록 제한 (페이징 구현 시 활용)
    // .order('created_at', { ascending: false }); // 예시: 정렬 추가
  
  if (error) {
    console.error('Error fetching OSM data:', error)
    return null;
  }

  return data;
}

// 특정 영역 내의 데이터만 가져오는 함수 (예: 현재 위치 기준 반경 3km)
export async function getNearbyOsmData(latitude: number, longitude: number, radiusKm: number = 3): Promise<OsmPlace[] | null> {
  //클라이언트 측 유효성 검사
  if (typeof latitude !== 'number' || typeof longitude !== 'number' || typeof radiusKm !== 'number' || isNaN(latitude) || isNaN(longitude) || isNaN(radiusKm)) {
    console.error('Invalid arguments for getNearbyOsmData: lat, lon, and radiusKm must be numbers.')
    return null
  }
  const { data, error } = await supabase
    .rpc('get_nearby_places', {
      lat: latitude,
      lon: longitude,
      radius: radiusKm
    }) as { data: OsmPlace[] | null, error: any } // 타입 단언으로 더욱 명확하게 해준다.

  if (error) {
    console.error('Error fetching nearby OSM data:', error.message || error); // 좀 더 구체적인 메시지 출력
    return null;
  }

  return data;
}
