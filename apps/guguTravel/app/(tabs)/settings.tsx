import { View, Text, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const openOSMWebsite = () => {
    Linking.openURL('https://www.openstreetmap.org/');
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.row}>
          <Ionicons name="information-circle-outline" size={24} color="#007AFF" style={styles.icon} />
          <Text style={styles.infoText}>
            본 앱은 OpenStreetMap 기여자들의 데이터를 사용합니다.
          </Text>
        </View>
        <View style={styles.row}>
          <Ionicons name="copy-outline" size={24} color="#666666" style={styles.icon} />
          <Text style={styles.infoText}>
            © OpenStreetMap contributors
            Powered by Overpass API
          </Text>
        </View>
        <Text 
          style={[styles.infoText, styles.link]}
          onPress={openOSMWebsite}
        >
          OpenStreetMap 방문하기
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
  },
  link: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
});
