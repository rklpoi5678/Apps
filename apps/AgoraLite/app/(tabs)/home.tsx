import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from "react-native"
import {
  MessageSquare,
  ThumbsUp,
  Clock,
  ChevronLeft,
  ChevronRight,
  ThumbsDown,
} from "lucide-react-native"
import type { Debate } from "@/types/home"
import { fetchFeaturedDebates, fetchTrendingDebates } from "@/lib/firebase-debate"
import { router } from "expo-router"
import AuthorName from "@/lib/firebase-action"
import { db } from "@/firebaseConfig"
import { doc } from "firebase/firestore"

const categories = [
  "전체",
  '기술',
  '경제',
  '사회',
  '직장 & 커리어',
  '정치',
  "스포츠",
  "과학",
  "철학",
  "대중문화",
  '환경',
  '교육',
  '건강',
  '기타',
]

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [currentSlide, setCurrentSlide] = useState(0)

  const [featuredDebates, setFeaturedDebates] = useState<Debate[]>([])
  const [trendingDebates, setTrendingDebates] = useState<Debate[]>([])
  const [loading, setLoading] = useState(true)

  // Firestore에서 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 초기 로드: 추천 토론 & 인기 토론
        const [feat, trend] = await Promise.all([fetchFeaturedDebates(), fetchTrendingDebates()])
        setFeaturedDebates(feat)
        setTrendingDebates(trend)
      } catch (err) {
        console.error("Firestore 데이터 로드 실패:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])
  
  // 카테고리 필터 적용
  const filteredDebates =
    selectedCategory === "전체"
      ? trendingDebates
      : trendingDebates.filter((debate) => debate.category === selectedCategory)

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6"/>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      {/* 오늘의 추천 토론 섹션 */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>오늘의 추천 토론</Text>
        <View style={styles.sliderControls}>
          <Pressable><ChevronLeft size={16} /></Pressable>
          <Pressable><ChevronRight size={16} /></Pressable>
        </View>
      </View>

        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.cardSlider}>
          {featuredDebates.map((debate, idx) => (
            <TouchableOpacity
            key={debate.id}
            style={[
              styles.featureCard,
              { marginLeft: idx === 0 ? 16 : 8, marginRight: idx === featuredDebates.length - 1 ? 16 : 8 },
            ]}
            onPress={() => router.push(`/feed/${debate.id}`)}
          >
              <Text style={styles.category}>{debate.category}</Text>
              <Text style={styles.cardTitle}>{debate.title}</Text>
              <Text style={styles.cardDescription}>{debate.description}</Text>
              <View style={styles.metaRow}>
                <MessageSquare size={12} />
                <Text style={styles.metaText}>참여자 {debate.participants}명</Text>
                <Clock size={12} />
                <Text style={styles.metaText}>{debate.timeLeft} 남음</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

      <ScrollView horizontal style={styles.categoryScroll} showsHorizontalScrollIndicator={false}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              category === selectedCategory && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                category === selectedCategory && styles.categoryTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 인기 토론 렌더링 */}
      <Text style={styles.sectionTitle}>인기 토론</Text>
      {filteredDebates.map((debate) => (
        <TouchableOpacity
          key={debate.id}
          style={styles.debateCard}
          onPress={() => router.push(`/feed/${debate.id}`)}
        >
          <Text style={styles.cardTitle}>{debate.title}</Text>
          <Text style={styles.category}>{debate.category}</Text>
          <View style={styles.metaRow}>
            <ThumbsUp size={14} />
            <Text style={styles.metaText}>{debate.likes}</Text>
            <ThumbsDown size={14} />
            <Text style={styles.metaText}>{debate.dislikes}</Text>
            <MessageSquare size={14} />
            <Text style={styles.metaText}>{debate.comments}</Text>
            {debate.author && (
              <>
                <AuthorName style={styles.metaText} authorRef={doc(db, "users", debate.author)} />
                <Text style={styles.metaText}>• {debate.timeAgo}</Text>
              </>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", paddingBottom: 100 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { backgroundColor: "#3B82F6", padding: 16 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "white" },
  headerSubtitle: { fontSize: 12, color: "#DBEAFE" },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#111827", padding: 16 },
  sliderControls: { flexDirection: "row", gap: 8 },
  cardSlider: { paddingHorizontal: 16 },
  featureCard: { width: 200, padding: 16, backgroundColor: "white", borderRadius: 8 },
  category: { fontSize: 10, color: "#6366F1" },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#111827", marginTop: 4 },
  cardDescription: { fontSize: 12, color: "#6B7280", marginVertical: 6 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" },
  metaText: { fontSize: 10, color: "#6B7280" },
  categoryScroll: { paddingHorizontal: 16, marginVertical: 8 },
  categoryButton: { marginRight: 8, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: "#E5E7EB" },
  categoryButtonActive: { backgroundColor: "#111827" },
  categoryText: { fontSize: 12, color: "#374151" },
  categoryTextActive: { fontSize: 12, color: "white" },
  debateCard: { marginHorizontal: 16, marginBottom: 12, padding: 16, backgroundColor: "white", borderRadius: 8 },
})
