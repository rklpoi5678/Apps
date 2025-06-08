import { StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { LocationCoordinates, OsmPlace } from '@/types/map';

interface CustomMapViewProps {
  mapRef: React.RefObject<MapView | null>;
  currentLocation: LocationCoordinates;
  nearbyPlaces: OsmPlace[];
  selectedLocation: LocationCoordinates | null;
  onMarkerPress?: (place: OsmPlace) => void;
  onMapReady?: () => void;
}

const NEARBY_PLACE_COLOR = '#ff3b30';
const SELECTED_LOCATION_COLOR = '#007AFF';

export default function CustomMapView({ 
  mapRef, 
  currentLocation, 
  nearbyPlaces, 
  selectedLocation,
  onMarkerPress,
  onMapReady
}: CustomMapViewProps) {

  return (
    <MapView 
      onMapReady={onMapReady}
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
      {nearbyPlaces.map((place, index) => {
        const [longitude, latitude] = place.wkb_geometry.coordinates;
        if (typeof latitude !== 'number' || typeof longitude !== 'number') {
          console.warn(`Skipping marker for ${place.name || 'unnamed place'}: Invalid coordinates provided.`);
          return null;
        }

        return (
          <Marker
            key={`${place.name || 'unnamed'}-${longitude}-${latitude}-${index}`}
            coordinate={{ latitude: latitude, longitude: longitude }}
            title={place.name}
            description={`거리: ${place.distance?.toFixed(1)}km`}
            pinColor={NEARBY_PLACE_COLOR}
            anchor={{ x: 0.5, y: 1.0 }}
            calloutAnchor={{ x: 0.5, y: 0.0 }}
            onPress={() => onMarkerPress?.(place)}
          />
        );
      })}

      {selectedLocation && (
        <Marker
          key="selected-location-marker"
          coordinate={{
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude
          }}
          title={selectedLocation.name}
          pinColor={SELECTED_LOCATION_COLOR}
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
