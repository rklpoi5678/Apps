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
    let longitude: number | undefined;
    let latitude: number | undefined;
  
    // 지오메트리 타입에 따른 좌표 결정
    if (place.wkb_geometry && place.wkb_geometry.coordinates) {
      switch (place.wkb_geometry.type) {
        case 'Point':
          // 포인트의 경우, 좌표는 [경도, 위도]
          [longitude, latitude] = place.wkb_geometry.coordinates;
          break;
        case 'LineString':
        case 'MultiPoint':
          // LineString/MultiPoint의 경우, 좌표는 포인트 배열: [[lon1, lat1], [lon2, lat2], ...]
          // 첫 번째 포인트를 취하거나 중심/중간점을 계산할 수 있습니다.
          // 거리를 위해, 빠른 추정에는 첫 번째 포인트를 취하는 것이 종종 충분합니다.
          if (Array.isArray(place.wkb_geometry.coordinates) && place.wkb_geometry.coordinates.length > 0) {
            [longitude, latitude] = place.wkb_geometry.coordinates[0];
          }
          break;
        case 'Polygon':
        case 'MultiLineString':
          // Polygon/MultiLineString의 경우, 좌표는 중첩된 배열: [[[lon1, lat1], ...], ...]
          // 첫 번째 링/라인의 첫 번째 포인트를 추출해야 합니다.
          if (Array.isArray(place.wkb_geometry.coordinates) && place.wkb_geometry.coordinates.length > 0) {
            const firstRing = place.wkb_geometry.coordinates[0];
            if (Array.isArray(firstRing) && firstRing.length > 0) {
              [longitude, latitude] = firstRing[0];
            }
          }
          break;
        case 'MultiPolygon':
          // 더욱 중첩됨: [[[[lon1, lat1], ...]], ...]
          if (Array.isArray(place.wkb_geometry.coordinates) && place.wkb_geometry.coordinates.length > 0) {
            const firstPolygon = place.wkb_geometry.coordinates[0];
            if (Array.isArray(firstPolygon) && firstPolygon.length > 0) {
              const firstRing = firstPolygon[0];
              if (Array.isArray(firstRing) && firstRing.length > 0) {
                [longitude, latitude] = firstRing[0];
              }
            }
          }
          break;
        default:
          console.warn('처리되지 않은 지오메트리 타입:', place.wkb_geometry.type);
          // 타입이 알 수 없는 경우의 대체 또는 오류 처리
          return { ...place, distance: null };
      }
    }
  
    // 이제 위도와 경도가 성공적으로 추출되었고 유효한지 확인
    if (latitude === undefined || longitude === undefined || !isValidCoordinates(latitude, longitude)) {
      console.error('유효하지 않은 좌표 (추출 실패 또는 유효하지 않음):', {latitude, longitude, geometryType: place.wkb_geometry?.type});
      return { ...place, distance: null };
    }
    const distance = userLocation
      ? calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          latitude,
          longitude
        )
      : null;
    return { ...place, distance };
  }, [userLocation, calculateDistance, isValidCoordinates]);
  
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
    if (!item.wkb_geometry?.coordinates) {
      console.error('Invalid geometry data')
      return;
    }
    const [longitude, latitude] = item.wkb_geometry.coordinates;

    if (!isValidCoordinates(latitude, longitude)) {
      console.error('Invalid coordinates:', { latitude, longitude });
      return;
    }
    
    setSelectedLocation({ latitude, longitude, name: item.name });
    router.push('/');
  }, [isValidCoordinates, router, setSelectedLocation]); //router와 isValidCoordinates가 변경되면 다시 생성
  
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
    }, [searchQuery, userLocation, fetchOsmPlaces]);
  
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
