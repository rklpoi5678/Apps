import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#666666',
    marginTop: 8,
  },
});

export const LoadingState = () => {
  return (
    <View style={styles.loadingContainer}>
      <Ionicons name="hourglass-outline" size={40} color="#8E8E93" />
      <Text style={styles.loadingText}>로딩 중...</Text>
    </View>
  );
}; 