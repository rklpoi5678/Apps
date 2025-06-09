import React,{ useState, useEffect, useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { supabase } from '@/src/lib/supabase';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useLocationStore } from '@/src/store/locationStore';
import { SearchBar } from '@/src/components/SearchBar';
import { PlaceCard } from '@/src/components/PlaceCard';
import { LoadingState } from '@/src/components/LoadingState';
import { ErrorState } from '@/src/components/ErrorState';
import { EmptyState } from '@/src/components/EmptyState';
import { OsmPlace } from '@/types/map';
import AdBanner from '@/src/components/AdBanner';

const ITEMS_PER_PAGE = 10;
const MAX_ITEMS = 30;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

// ────────── 지오메트리 좌표 추출 헬퍼 함수 ──────────
// 이 함수는 TwoScreen 컴포넌트 외부에 정의되어야 합니다.
// 예를 들어, 이 파일의 상단, 또는 별도의 유틸리티 파일에 정의할 수 있습니다.
const extractCoordinates = (geometry: { type: string; coordinates: any } | undefined): [number, number] | null => {
  if (!geometry || !geometry.coordinates) {
    return null;
  }

  let longitude: number | undefined;
  let latitude: number | undefined;

  switch (geometry.type) {
    case 'Point':
      // Point: [longitude, latitude]
      if (Array.isArray(geometry.coordinates) && geometry.coordinates.length >= 2) {
        [longitude, latitude] = geometry.coordinates;
      }
      break;
    case 'LineString':
    case 'MultiPoint':
      // LineString/MultiPoint: [[lon1, lat1], [lon2, lat2], ...]
      // 첫 번째 포인트를 사용
      if (Array.isArray(geometry.coordinates) && geometry.coordinates.length > 0) {
        const firstPoint = geometry.coordinates[0];
        if (Array.isArray(firstPoint) && firstPoint.length >= 2) {
          [longitude, latitude] = firstPoint;
        }
      }
      break;
    case 'Polygon':
    case 'MultiLineString':
      // Polygon/MultiLineString: [[[lon1, lat1], ...], ...]
      // 첫 번째 링/라인의 첫 번째 포인트를 사용
      if (Array.isArray(geometry.coordinates) && geometry.coordinates.length > 0) {
        const firstRingOrLine = geometry.coordinates[0];
        if (Array.isArray(firstRingOrLine) && firstRingOrLine.length > 0) {
          const firstPoint = firstRingOrLine[0];
          if (Array.isArray(firstPoint) && firstPoint.length >= 2) {
            [longitude, latitude] = firstPoint;
          }
        }
      }
      break;
    case 'MultiPolygon':
      // MultiPolygon: [[[[lon1, lat1], ...]], ...]
      // 첫 번째 폴리곤의 첫 번째 링의 첫 번째 포인트를 사용
      if (Array.isArray(geometry.coordinates) && geometry.coordinates.length > 0) {
        const firstPolygon = geometry.coordinates[0];
        if (Array.isArray(firstPolygon) && firstPolygon.length > 0) {
          const firstRing = firstPolygon[0];
          if (Array.isArray(firstRing) && firstRing.length > 0) {
            const firstPoint = firstRing[0];
            if (Array.isArray(firstPoint) && firstPoint.length >= 2) {
              [longitude, latitude] = firstPoint;
            }
          }
        }
      }
      break;
    default:
      console.warn('Unhandled geometry type in extractCoordinates:', geometry.type);
      return null;
  }

  // 최종 유효성 검사: 추출된 위도와 경도가 유효한 숫자인지 확인
  if (typeof latitude === 'number' && typeof longitude === 'number' && !isNaN(latitude) && !isNaN(longitude)) {
    return [longitude, latitude]; // [경도, 위도] 순서로 반환
  }

  return null;
};
// ──────────────────────────────────────────

export default function TwoScreen() {
  const router = useRouter();
  const setSelectedLocation = useLocationStore((state) => state.setSelectedLocation);
  const [searchQuery, setSearchQuery] = useState('');
  const [Places, setPlaces] = useState<OsmPlace[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<OsmPlace[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [userLocation, setUserLocation] = useState<{latitude: number; longitude: number} | null>(null);

  
  // 거리 계산 함수
  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // 지구의 반경 (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }, []);
  
  // 검색 시와 일반 로드 시 모두 적용할 유효한 좌표 체크 함수
  const isValidCoordinates = useCallback((latitude: number, longitude: number) => {
    return latitude !== 0 && longitude !== 0 && 
           !isNaN(latitude) && !isNaN(longitude) &&
           latitude >= -90 && latitude <= 90 &&
           longitude >= -180 && longitude <= 180;
  }, []);
  
  // Supabase 데이터 요청 함수
  const fetchDataFromSupabase = useCallback(async (page: number, isSearch: boolean) => {
    try {
      const query = supabase
        .from('raw_osm')
        .select('name, wkb_geometry')
        .not('name', 'is', null);

      if (isSearch) {
        query.ilike('name', `%${searchQuery}%`);
      } else {
        query.range(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE - 1);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching data from Supabase:', err);
      return null;
    }
  }, [searchQuery]); //searchQuery에 의존하므로 의존성 배열에 추가됨
  
  const sortByDistance = useCallback((a: OsmPlace, b: OsmPlace) => (a.distance || Infinity) - (b.distance || Infinity), []);
  
  const isValidPlace = useCallback((place: OsmPlace) => place.distance !== null && place.distance !== undefined, []);
  
  const addDistanceToPlace = useCallback((place: { name: string; wkb_geometry: { type: string; coordinates: any } }) => {
    const extractedCoords = extractCoordinates(place.wkb_geometry);

    if (!extractedCoords) {
      console.error('Failed to extract valid coordinates for distance calculation:', { placeName: place.name, geometryType: place.wkb_geometry?.type, rawCoordinates: place.wkb_geometry?.coordinates });
      return { ...place, distance: null};
    }
    
    const [longitude, latitude] = extractedCoords; // extractCoordinates가 [lon, lat] 순서로 반환한다고 가정
    
    const distance = userLocation
      ? calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          latitude,
          longitude
        )
      : null;
    return { ...place, distance };
  }, [userLocation, calculateDistance]);
  
  // 투어사 데이터 가져오기
  const fetchOsmPlaces = useCallback(async (page = 0, isSearch = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDataFromSupabase(page, isSearch);

      if (!data || data.length === 0) {
        if (isSearch) setError('검색 결과가 없습니다.');
        else setHasMore(false);
        setLoading(false);
        if (page === 0) setPlaces([]); // 검색 결과 없으면 목록 비움
        return;
      }

      const placesWithDistance = data
        .map(addDistanceToPlace)
        .filter(isValidPlace)
        .sort(sortByDistance);

      if (page === 0) {
        setPlaces(placesWithDistance);
      } else {
        // 중복 데이터 방지를 위해 Set 사용 고려 또는 ID 기반 필터링
        setPlaces((prevPlaces) => [...prevPlaces, ...placesWithDistance].sort(sortByDistance));
      }
      setHasMore(placesWithDistance.length === ITEMS_PER_PAGE && (page + 1) * ITEMS_PER_PAGE < MAX_ITEMS);
    } catch (err) {
      console.error('Error:', err)
      setError('데이터를 가져오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  },[fetchDataFromSupabase, addDistanceToPlace, isValidPlace, sortByDistance]); //필요한 의존성배열

  
  const handlePlacePress = useCallback(async (item: OsmPlace) => {
    console.log("handlePlacePress 작동")

    const extractedCoords = extractCoordinates(item.wkb_geometry)
    if (!extractedCoords) {
      console.error('Invalid geometry data: coordinates not in expected format for:', item.name, item.wkb_geometry);
      return;
    }

    const [longitude, latitude] = extractedCoords;


    if (!isValidCoordinates(latitude, longitude)) {
      console.error('Invalid coordinates (extracted or validated) for handlePlacePress:', { latitude, longitude, itemGeometry: item.wkb_geometry });
      return;
    }
    
    setSelectedLocation({ latitude, longitude, name: item.name });
    router.push('/');
  }, [router, setSelectedLocation, isValidCoordinates]); //router와 isValidCoordinates가 변경되면 다시 생성
  
  // --- useEffect Hooks ---
  
  //현재 위치 가져오기
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('위치 권한이 필요합니다.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
      })();
    }, []);

  // 초기 데이터 로드
  useEffect(() => {
    if (userLocation) {
      fetchOsmPlaces(0);
    }
  }, [userLocation, fetchOsmPlaces]); //fetchOsmPlaces는 이제 안정적이므로 의존성제거 (ESLint규칙에 따라 포함)
    
  // 검색어 변경 시 검색 실행 (디바운싱)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      let currentFiltered: OsmPlace[] = [];
      // 검색어가 있을 때만 isSearch=true로 호출
      if (searchQuery.trim()) {
        currentFiltered = Places.filter(place => 
          place.name?.toLowerCase().includes(searchQuery.toLowerCase())
        ).sort(sortByDistance);

        setHasMore(false);
      } else {
        // 검색어가 비워졌을 때 초기 목록으로 복귀
        currentFiltered = [...Places].sort(sortByDistance);
        setHasMore(Places.length < MAX_ITEMS && Places.length % ITEMS_PER_PAGE === 0);
      }
      setFilteredPlaces(currentFiltered);
      setError(currentFiltered.length === 0 && searchQuery.trim() !== '' ? '검색 결과가 없습니다.' : null);
    }, 500);
    
    return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, Places, sortByDistance]);
  
  // 무한 스크롤 핸들러
  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore && !searchQuery) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchOsmPlaces(nextPage);
    }
  }, [loading, hasMore, searchQuery, currentPage, fetchOsmPlaces]);

  return (
    <View style={styles.container}>

      <SearchBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      {loading && currentPage === 0 ? (
        <LoadingState />
      ) : error ? (
        <ErrorState 
          error={error}
          onRetry={() => {
              setError(null);
            if (searchQuery.trim()) {
              fetchOsmPlaces(0, true);
            } else {
              fetchOsmPlaces(0);
            }
          }}
        />
      ) : (
        <>
          <FlatList
            data={filteredPlaces}
            renderItem={({ item, index }) => (
              <PlaceCard
                item={item}
                index={index}
                onPress={handlePlacePress}
              />
            )}
            keyExtractor={(item, index) => `${item.name}-${item.wkb_geometry?.coordinates[0]}-${item.wkb_geometry?.coordinates[1]}-${index}`}
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={false}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() => 
              loading && currentPage > 0 ? (
                <View style={{ padding: 16, alignItems: 'center' }}>
                  <LoadingState />
                </View>
              ) : null
            }
            ListEmptyComponent={<EmptyState />}
          />
          <AdBanner />
        </>
      )}
    </View>
    
  );
}
