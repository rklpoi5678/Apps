import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const styles = StyleSheet.create({
  searchContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  searchInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: 8,
    fontSize: 16,
    color: '#1a1a1a',
  },
});

export const SearchBar = ({ searchQuery, setSearchQuery }: SearchBarProps) => {
  return (
    <Animated.View 
      style={styles.searchContainer}
      entering={FadeInDown.duration(500)}
    >
      <View style={styles.searchInputContainer}>
        <Ionicons name="search" size={20} color="#8E8E93" />
        <TextInput
          style={styles.searchInput}
          placeholder="장소 검색..."
          placeholderTextColor="#8E8E93"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#8E8E93" />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}; 