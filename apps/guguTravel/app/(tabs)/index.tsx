// screens/MapScreen.tsx
import {
  Platform,
  View,
  Text,
  StyleSheet,
  AppState,
  AppStateStatus,
} from 'react-native';
import { useEffect, useState, useRef, useCallback } from 'react';
import * as Location from 'expo-location';
import { getNearbyOsmData } from '@src/lib/supabase';
import { useLocationStore } from '@/src/store/locationStore';
import CustomMapView from '@/components/map/MapContainer';
import LocationButton from '@/components/ui/LocationButton';
import { LocationCoordinates, OsmPlace } from '@/types/map';
import MapView from 'react-native-maps';
import {
  preloadInterstitial,
  showInterstitial,
} from '@/src/components/InterstitialAd';
import { useNavigation } from '@react-navigation/native';

////////////////////////////////////////////////////////////////////////////////
// config
////////////////////////////////////////////////////////////////////////////////
const INTERSTITIAL_COOLDOWN = 2 * 60 * 1000; // 2 분

////////////////////////////////////////////////////////////////////////////////
export default function MapScreen() {
  /* ───────── 지도 상태 ───────── */
  const mapRef = useRef<MapView>(null);
  const [currentLocation, setCurrentLocation] =
    useState<LocationCoordinates | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<OsmPlace[]>([]);
  const selectedLocation = useLocationStore((s) => s.selectedLocation);

  /* ───────── Interstitial 관리 ───────── */
  const navigation = useNavigation();
  /** 최근 광고가 실제로 화면에 표시된 시각  */
  const lastAdShownRef = useRef<number>(Date.now()); // ← **현재 시간으로 초기화**

  /** 조건을 만족하면 Interstitial 노출 */
  const maybeShowInterstitial = useCallback(() => {
    const now = Date.now();
    if (now - lastAdShownRef.current < INTERSTITIAL_COOLDOWN) {
      // 아직 쿨다운 중 → 다음 광고만 미리 로드
      preloadInterstitial();
      return;
    }

    showInterstitial(() => {
      // 광고가 **정상적으로 닫혔을 때만** 타임스탬프 갱신
      lastAdShownRef.current = Date.now();
    });
  }, []);

  /* 앱이 켜질 때 --> 다음 광고 예열 */
  useEffect(() => {
    preloadInterstitial();
  }, []);

  /* ① 탭을 떠나기 직전(blur) */
  useEffect(() => {
    const unsub = navigation.addListener('blur', maybeShowInterstitial);
    return unsub;
  }, [navigation, maybeShowInterstitial]);

  /* ② 백그라운드 → 포그라운드 복귀 */
  useEffect(() => {
    const onState = (s: AppStateStatus) => {
      if (s === 'active') maybeShowInterstitial();
    };
    const subscription = AppState.addEventListener('change', onState);
    return () => subscription.remove();
  }, [maybeShowInterstitial]);

  /* ───────── 위치 허용 & 현재 위치 ───────── */
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const loc = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  /* ───────── 반경 5 km OSM 데이터 ───────── */
  useEffect(() => {
    if (!currentLocation) return;
    (async () => {
      const places = await getNearbyOsmData(
        currentLocation.latitude,
        currentLocation.longitude,
        5,
      );
      places && setNearbyPlaces(places);
    })();
  }, [currentLocation]);

  /* ───────── 외부 선택 → 지도 이동 ───────── */
  useEffect(() => {
    if (selectedLocation) {
      mapRef.current?.animateToRegion({
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [selectedLocation]);

  /* ───────── UI 렌더링 ───────── */
  if (Platform.OS !== 'android')
    return (
      <Centered>
        <Text>Android 기기에서만 지도가 지원됩니다.</Text>
      </Centered>
    );

  if (!currentLocation)
    return (
      <Centered>
        <Text>위치 정보를 불러오는 중...</Text>
      </Centered>
    );

  return (
    <View style={styles.container}>
      <CustomMapView
        mapRef={mapRef}
        currentLocation={currentLocation}
        nearbyPlaces={nearbyPlaces}
        selectedLocation={selectedLocation}
        onMarkerPress={(p) => console.log('Marker pressed:', p.name)}
      />
      <LocationButton
        onPress={() =>
          mapRef.current?.animateToRegion({
            ...currentLocation,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          })
        }
      />
      <View style={styles.attribution}>
        <Text style={styles.caption}>© OpenStreetMap contributors</Text>
      </View>
    </View>
  );
}

////////////////////////////////////////////////////////////////////////////////
// 공통 컴포넌트 & 스타일
////////////////////////////////////////////////////////////////////////////////
const Centered = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.centered}>{children}</View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  attribution: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  caption: { fontSize: 12, color: '#666' },
});
