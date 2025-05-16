import React from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useTourStore } from '../store/useTourStore';

export const MapScreen: React.FC = () => {
  const tours = useTourStore((state) => state.tours);

  return (
    <View className="flex-1">
      <MapView
        className="flex-1"
        initialRegion={{
          latitude: 37.5665,
          longitude: 126.9780,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {tours.map((tour) => (
          <Marker
            key={tour.id}
            coordinate={{
              latitude: tour.location.latitude,
              longitude: tour.location.longitude,
            }}
            title={tour.title}
            description={tour.description}
          />
        ))}
      </MapView>
    </View>
  );
}; 