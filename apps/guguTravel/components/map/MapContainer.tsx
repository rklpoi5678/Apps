import { StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { LocationCoordinates, OsmPlace } from '@/types/map';

interface CustomMapViewProps {
  mapRef: React.RefObject<MapView | null>;
  currentLocation: LocationCoordinates | null;
  nearbyPlaces: OsmPlace[];
  selectedLocation: LocationCoordinates | null;
  onMarkerPress?: (place: OsmPlace) => void;
}

export default function CustomMapView({ 
  mapRef, 
  currentLocation, 
  nearbyPlaces, 
  selectedLocation,
  onMarkerPress 
}: CustomMapViewProps) {
  if (!currentLocation) return null;

  return (
    <MapView 
      ref={mapRef}
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      showsUserLocation={true}
      showsMyLocationButton={false}
      initialRegion={{
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      {nearbyPlaces.map((place) => (
        <Marker
          key={`${place.name}-${place.distance}`}
          coordinate={{
            latitude: place.wkb_geometry.coordinates[1],
            longitude: place.wkb_geometry.coordinates[0]
          }}
          title={place.name}
          description={`거리: ${place.distance.toFixed(1)}km`}
          pinColor="#ff3b30"
          anchor={{ x: 0.5, y: 1.0 }}
          calloutAnchor={{ x: 0.5, y: 0.0 }}
          onPress={() => onMarkerPress?.(place)}
        />
      ))}

      {selectedLocation && (
        <Marker
          key="selected-location"
          coordinate={{
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude
          }}
          title={selectedLocation.name}
          pinColor="#007AFF"
          anchor={{ x: 0.5, y: 1.0 }}
          calloutAnchor={{ x: 0.5, y: 0.0 }}
        />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
