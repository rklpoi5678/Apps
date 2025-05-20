import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { useLocationStore } from '@/src/store/locationStore';

export default function ModalScreen() {
  const selectedLocation = useLocationStore((state) => state.selectedLocation);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* 헤더 섹션 */}
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/150' }} 
            style={styles.profileImage}
          />
          <Text style={styles.name}>김서울</Text>
          <Text style={styles.title}>서울 전문 투어 가이드</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text style={styles.rating}>4.8 (128 리뷰)</Text>
          </View>
        </View>

        {/* 정보 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>투어 가이드 정보</Text>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color="#007AFF" />
            <Text style={styles.infoText}>투어 가능 시간: 09:00 - 18:00</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="language-outline" size={20} color="#007AFF" />
            <Text style={styles.infoText}>언어: 한국어, 영어, 일본어</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="#007AFF" />
            <Text style={styles.infoText}>주요 투어 지역: 강남, 홍대, 명동</Text>
          </View>
        </View>

        {/* 소개 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>가이드 소개</Text>
          <Text style={styles.description}>
            10년 이상의 투어 가이드 경험을 바탕으로 서울의 숨겨진 명소와 맛집을 소개해드립니다. 
            역사와 문화에 대한 깊은 이해를 바탕으로 의미 있는 여행을 만들어드립니다.
          </Text>
        </View>

        {/* 투어 코스 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>추천 투어 코스</Text>
          <View style={styles.courseCard}>
            <Text style={styles.courseTitle}>서울 역사 탐방 코스</Text>
            <Text style={styles.courseDescription}>
              경복궁 → 북촌한옥마을 → 인사동 → 광화문
            </Text>
            <Text style={styles.courseDuration}>소요시간: 4시간</Text>
          </View>
        </View>

        {/* 연락처 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>연락처</Text>
          <TouchableOpacity style={styles.contactButton}>
            <Ionicons name="call-outline" size={20} color="white" />
            <Text style={styles.contactButtonText}>전화하기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.contactButton, styles.messageButton]}>
            <Ionicons name="chatbubble-outline" size={20} color="white" />
            <Text style={styles.contactButtonText}>메시지 보내기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  rating: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  courseCard: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  courseDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  courseDuration: {
    fontSize: 14,
    color: '#007AFF',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    gap: 10,
  },
  messageButton: {
    backgroundColor: '#34C759',
  },
  contactButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
