import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  emptyText: {
    color: '#666666',
    marginTop: 8,
  },
});

export const EmptyState = () => {
  return (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={40} color="#8E8E93" />
      <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
    </View>
  );
}; 