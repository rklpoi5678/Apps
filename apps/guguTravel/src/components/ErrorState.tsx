import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  errorText: {
    color: '#FF3B30',
    marginVertical: 8,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export const ErrorState = ({ error, onRetry }: ErrorStateProps) => {
  return (
    <View style={styles.errorContainer}>
      <Ionicons name="alert-circle-outline" size={40} color="#FF3B30" />
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity 
        style={styles.retryButton}
        onPress={onRetry}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Ionicons name="refresh" size={20} color="white" />
          <Text style={styles.retryButtonText}>다시 시도</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}; 