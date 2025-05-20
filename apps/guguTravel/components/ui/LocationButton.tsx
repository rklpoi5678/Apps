import { StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LocationButtonProps {
  onPress: () => void;
}

export default function LocationButton({ onPress }: LocationButtonProps) {
  return (
    <TouchableOpacity 
      style={styles.button}
      onPress={onPress}
    >
      <Ionicons name="locate" size={24} color="#007AFF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 100,
    right: 20,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
