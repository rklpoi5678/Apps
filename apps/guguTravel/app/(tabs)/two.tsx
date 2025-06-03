import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useState, useEffect } from 'react';
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
  const ITEMS_PER_PAGE = 10;
  const MAX_ITEMS = 30;

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

  // 거리 계산 함수
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // 지구의 반경 (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // 검색 시와 일반 로드 시 모두 적용할 유효한 좌표 체크 함수
  const isValidCoordinates = (latitude: number, longitude: number) => {
    return latitude !== 0 && longitude !== 0 && 
           !isNaN(latitude) && !isNaN(longitude) &&
           latitude >= -90 && latitude <= 90 &&
           longitude >= -180 && longitude <= 180;
  };

  // 투어사 데이터 가져오기
  const fetchOsmPlaces = async (page = 0, isSearch = false) => {
    try {
      if (isSearch) {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('raw_osm')
          .select('name, wkb_geometry')
          .ilike('name', `%${searchQuery}%`)
          .not('name', 'is', null);

        if (error) throw error;
        
        if (!data || data.length === 0) {
          setError('검색 결과가 없습니다.');
          return;
        }

        //검색 시
        const placesWithDistance = data.map(place => {
          const [longitude, latitude] = place.wkb_geometry.coordinates;
          if (!isValidCoordinates(latitude, longitude)) {
            return { ...place, distance: null };
          }
          const distance = userLocation ? calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            latitude,
            longitude
          ) : 0;
          return { ...place, distance };
        })
        .filter(place => place.distance !== null && place.distance !== undefined)
        .sort((a, b) => (a.distance || 0) - (b.distance || 0));

        setPlaces(placesWithDistance);
        setFilteredPlaces(placesWithDistance);
        setHasMore(false);
      } else {
        if (!userLocation) return;
        
        const { data, error } = await supabase
          .from('raw_osm')
          .select('name, wkb_geometry')
          .not('name', 'is', null)
          .range(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE - 1);

        if (error) throw error;

        if (!data || data.length === 0) {
          setHasMore(false);
          return;
        }

        // 일반 로드 시
        const placesWithDistance = data.map(place => {
          const [longitude, latitude] = place.wkb_geometry.coordinates;
          if (!isValidCoordinates(latitude, longitude)) {
            return { ...place, distance: null };
          }
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            latitude,
            longitude
          );
          return { ...place, distance };
        })
        .filter(place => place.distance !== null && place.distance !== undefined)
        .sort((a, b) => (a.distance || 0) - (b.distance || 0));

        if (page === 0) {
          setPlaces(placesWithDistance);
          setFilteredPlaces(placesWithDistance);
        } else {
          const updatedPlaces = [...Places, ...placesWithDistance]
            .sort((a, b) => (a.distance || 0) - (b.distance || 0));
          setPlaces(updatedPlaces);
          setFilteredPlaces(updatedPlaces);
        }

        setHasMore(placesWithDistance.length === ITEMS_PER_PAGE && 
                  (page + 1) * ITEMS_PER_PAGE < MAX_ITEMS);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('데이터를 가져오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    if (userLocation) {
      fetchOsmPlaces(0);
    }
  }, [userLocation]);

  // 검색어 변경 시 검색 실행
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchOsmPlaces(0, true);
      } else if (userLocation) {
        fetchOsmPlaces(0);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // 무한 스크롤 핸들러
  const handleLoadMore = () => {
    if (!loading && hasMore && !searchQuery) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchOsmPlaces(nextPage);
    }
  };

  const handlePlacePress = async (item: OsmPlace) => {
    let latitude = 0;
    let longitude = 0;

    try {
      if (item.wkb_geometry && Array.isArray(item.wkb_geometry.coordinates)) {
        longitude = Number(item.wkb_geometry.coordinates[0]) || 0;
        latitude = Number(item.wkb_geometry.coordinates[1]) || 0;
        
        if (latitude === 0 || longitude === 0 || 
            isNaN(latitude) || isNaN(longitude) ||
            latitude < -90 || latitude > 90 ||
            longitude < -180 || longitude > 180) {
          console.error('Invalid coordinates:', { latitude, longitude });
          return;
        }
      } else {
        console.error('Invalid geometry data');
        return;
      }
    } catch (err) {
      console.error('Error parsing coordinates:', err);
      return;
    }

    setSelectedLocation({
      latitude,
      longitude,
      name: item.name
    });

    router.push('/');
  };

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
          onRetry={() => fetchOsmPlaces(0, !!searchQuery)}
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
            keyExtractor={(item, index) => `${item.name}-${index}`}
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
