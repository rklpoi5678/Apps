import { Platform } from 'react-native'
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps'
import { useTourStore, Tour } from '@src/store/useTourStore'
import { View, Text } from 'react-native'
import * as Location from 'expo-location'
import { useEffect, useState } from 'react'

interface Location {
  latitude: number
  longitude: number
}

// const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
//   const R = 6371; // 지구 반지름 (단위: km)
//   const dLat = (lat2 - lat1) * (Math.PI / 180);
//   const dLon = (lon2 - lon1) * (Math.PI / 180);

//   const a = 
//   Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//   Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
//   Math.sin(dLon / 2) * Math.sin(dLon / 2);

//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   const distance = R * c; // 거리 (단위: km)
//   return distance;
// }

export default function MapScreen() {
  const tours = useTourStore((s) => s.tours)
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null)
  const [nearbyTours, setNearbyTours] = useState<Tour[]>([])
  console.log('Tours data:', tours)  // 디버깅용 로그

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
    const R = 6371; // km
    const calc = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    setNearbyTours(
      tours
        .map((t) => ({
          ...t,
          distance: calc(currentLocation.latitude, currentLocation.longitude, t.location.latitude, t.location.longitude),
        }))
        .filter((t) => t.distance <= 3)
    );
  }, [currentLocation, tours]);

   /* 3️⃣ 플랫폼 가드(Web 차단) */
   if (Platform.OS !== 'android') {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Android 기기에서만 지도가 지원됩니다.</Text>
      </View>
    );
  }

  if (!currentLocation) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>위치 정보를 불러오는 중...</Text>
      </View>
    )
  }

  return (
    <MapView 
    className="flex-1" 
    style={{ flex: 1 }}
    provider={PROVIDER_GOOGLE}
    showsUserLocation
    initialRegion={{
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }}
  >
      {nearbyTours.map((tour) => (
          <Marker
            key={tour.id}
            coordinate={ tour.location }
            pinColor="#ff3b30"
            anchor={{ x: 0.5 , y: 1.0 }}
            calloutAnchor={{ x: 0.5 , y: 0.0 }}
            onPress={() => {
              console.log('Marker pressed')
            }}
          >
          {/* ▶️ “기본” 이름+거리 라벨을 직접 만든다 */}
          {/* <View pointerEvents="none" className="items-center" style={{ marginBottom: 30 }}>
            <View className="bg-white rounded px-2 py-0.5 shadow">
              <Text className="text-xs font-bold">{tour.name}</Text>
              <Text className="text-[10px] text-gray-600">
                거리: {tour.distance?.toFixed(1) ?? '0.0'} km
              </Text>
            </View>
          </View> */}

          {/* ▶️ 마커를 눌렀을 때 뜨는 상세 카드 */}
          {/* <Callout tooltip>
            <View className="bg-white p-3 rounded-lg w-48 shadow">
              <Text className="font-bold text-base mb-1">{tour.name}</Text>
              <Text className="text-gray-600 mb-1">
                거리 {tour.distance?.toFixed(1) ?? '0.0'} km
              </Text>
              <Text className="mb-1">{tour.phone}</Text>
              <Text className="text-blue-600 font-semibold">
                현지 가격 {tour.localPrice ?? '문의'}
              </Text>
            </View>
          </Callout> */}
        </Marker>
      ))}
    </MapView>
  );
}
