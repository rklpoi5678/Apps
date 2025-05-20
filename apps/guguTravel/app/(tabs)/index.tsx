import { Platform, View, Text, StyleSheet } from 'react-native'
import { useEffect, useState, useRef } from 'react'
import * as Location from 'expo-location'
import { getNearbyOsmData } from '@src/lib/supabase'
import { useLocationStore } from '@/src/store/locationStore'
import CustomMapView from '@/components/map/MapContainer'
import LocationButton from '@/components/ui/LocationButton'
import { LocationCoordinates, OsmPlace } from '@/types/map'
import MapView from 'react-native-maps'


if (!__DEV__) {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
}

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const [currentLocation, setCurrentLocation] = useState<LocationCoordinates | null>(null)
  const [nearbyPlaces, setNearbyPlaces] = useState<OsmPlace[]>([])
  const selectedLocation = useLocationStore((state) => state.selectedLocation)

  
  // 현재 위치 가져오기
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') return;

      const location = await Location.getCurrentPositionAsync({})
      setCurrentLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude})
    })();
  }, []);

  // 현재 위치 기준 3km 이내 + 거리 계산 + 투어사 필터링
  useEffect(() => {
    if (!currentLocation) return;
    
    (async () => {
      const places = await getNearbyOsmData(
        currentLocation.latitude,
        currentLocation.longitude,
        5
      );
      if (places) {
        setNearbyPlaces(places);
      }
    })();
  }, [currentLocation]);

  useEffect(() => {
    if (selectedLocation) {
      // 지도 이동 로직
      mapRef.current?.animateToRegion({
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [selectedLocation]);

  const handleCurrentLocation = () => {
    if (currentLocation) {
      mapRef.current?.animateToRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  };

  const handleMarkerPress = (place: OsmPlace) => {
    console.log('Marker pressed:', place.name);
  };

  if (Platform.OS !== 'android') {
    return (
      <View style={styles.container}>
        <Text>Android 기기에서만 지도가 지원됩니다.</Text>
      </View>
    );
  }

  if (!currentLocation) {
    return (
      <View style={styles.container}>
        <Text>위치 정보를 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomMapView
        mapRef={mapRef}
        currentLocation={currentLocation}
        nearbyPlaces={nearbyPlaces}
        selectedLocation={selectedLocation}
        onMarkerPress={handleMarkerPress}
      />
      <LocationButton onPress={handleCurrentLocation} />
      <View style={styles.attributionContainer}>
        <Text style={styles.attributionText}>
          © OpenStreetMap contributors
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  attributionContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  attributionText: {
    fontSize: 12,
    color: '#666666',
  },
});
