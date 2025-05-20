import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { OsmPlace } from '@/types/map';

interface PlaceCardProps {
  item: OsmPlace;
  index: number;
  onPress: (item: OsmPlace) => void;
}

const styles = StyleSheet.create({
  placeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  placeCardContent: {
    gap: 8,
    backgroundColor: 'white',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'white',
  },
  placeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  placeInfo: {
    fontSize: 14,
    color: '#888888',
  },
  placeDistance: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
});

export const PlaceCard = ({ item, index, onPress }: PlaceCardProps) => {
  let latitude = 0;
  let longitude = 0;

  try {
    if (item.wkb_geometry && Array.isArray(item.wkb_geometry.coordinates)) {
      longitude = Number(item.wkb_geometry.coordinates[0]) || 0;
      latitude = Number(item.wkb_geometry.coordinates[1]) || 0;
    }
  } catch (err) {
    console.error('Error parsing coordinates:', err);
  }

  return (
    <Animated.View entering={FadeInDown.delay(index * 100)}>
      <TouchableOpacity 
        style={styles.placeCard}
        activeOpacity={0.7}
        onPress={() => onPress(item)}
      >
        <View style={styles.placeCardContent}>
          <View style={styles.rowContainer}>
            <Ionicons name="location" size={20} color="#007AFF" />
            <Text style={styles.placeName}>{item.name}</Text>
          </View>
          <View style={styles.rowContainer}>
            <Ionicons name="map-outline" size={16} color="#8E8E93" />
            <Text style={styles.placeInfo}>
              {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </Text>
          </View>
          {item.distance && (
            <View style={styles.rowContainer}>
              <Ionicons name="navigate-outline" size={16} color="#007AFF" />
              <Text style={styles.placeDistance}>
                {item.distance.toFixed(1)}km
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}; 