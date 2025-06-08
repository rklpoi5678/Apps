import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native"
import { MessageSquare, Plus, TrendingUp } from "lucide-react-native"
import { fetchAllDebates, LastDoc } from "@/lib/firebase-debate"
import { Debate } from "@/types/home"
import { auth, db } from "@/firebaseConfig"
import { useRouter } from "expo-router"
import AuthorName, { formatDate, isFirestoreTimestamp } from "@/lib/firebase-action"
import { doc } from "firebase/firestore"

const categories = [
  '전체',
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

export default function FeedPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [loading, setLoading] = useState(true)
  const [debates, setDebates] = useState<Debate[]>([])
  const [lastDoc, setLastDoc] = useState<LastDoc>(null)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const router = useRouter()
  const user = auth.currentUser

  // Firestore에서 데이터 가져오기 (초기 로드)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { debates: initial, nextLastDoc } = await fetchAllDebates()
        setDebates(initial)
        setLastDoc(nextLastDoc)
        if (!nextLastDoc) setHasMore(false)
      } catch (err) {
        console.error("Firestore 데이터 로드 실패:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // 스크롤 끝에 닿으면 추가 로드
  const loadMore = async () => {
    if (!hasMore || loadingMore) return

    setLoadingMore(true)
    try {
      const { debates: more, nextLastDoc } = await fetchAllDebates(selectedCategory, lastDoc)
      // 1) 현재 상태(debates)에 이미 포함된 ID를 Set으로 추출
    const existingIds = new Set(debates.map((d) => d.id))

    // 2) more 배열 중에서 새로 추가할 것만 필터링
    const filteredMore = more.filter((d) => !existingIds.has(d.id))
    
    // 3) 중복 없는 항목만 합치기
    setDebates((prev) => [...prev, ...filteredMore])
      setLastDoc(nextLastDoc)
      if (!nextLastDoc) setHasMore(false)
    } catch (err) {
      console.error("추가 로드 실패:", err)
    } finally {
      setLoadingMore(false)
    }
  }

  const filteredDebates =
    selectedCategory === "전체"
      ? debates
      : debates.filter((debate) => debate.category === selectedCategory)

    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6"/>
        </View>
      )
    }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredDebates}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.cardList, filteredDebates.length === 0 && styles.emptyContainer]}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => router.push(`/feed/${item.id}`)}>
            <View style={styles.cardHeader}>
              <View style={styles.categoryRow}>
                <Text style={styles.badge}>{item.category}</Text>
                {item.trending && (
                  <View style={styles.trendingBadge}>
                    <TrendingUp size={12} color="#FB923C" />
                    <Text style={styles.trendingText}>인기</Text>
                  </View>
                )}
              </View>
              <Text style={styles.cardTitle}>
                {item.title.length > 50 ? `${item.title.slice(0, 50)}...` : item.title}
              </Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.summary}>
                {item.description.length > 100 ? `${item.description.slice(0, 100)}...` : item.description}
              </Text>
              <View style={styles.footerRow}>
                <View style={styles.metaRow}>
                  <MessageSquare size={14} color="#6B7280" />
                  <Text style={styles.metaText}>의견:{item.participants}</Text>
                  {item.author && (
                    <AuthorName style={styles.metaText} authorRef={doc(db, "users", item.author)} />
                  )}
                </View>
                {/* createdAt */}
            {item.createdAt && (
              <Text style={styles.metaText}>
                · {isFirestoreTimestamp(item.createdAt)
                  ? formatDate(item.createdAt)
                  : (item.createdAt instanceof Date
                    ? item.createdAt.toLocaleString('ko-KR')
                    : new Date(item.createdAt).toLocaleString('ko-KR'))}
              </Text>
            )}
            {item.timeAgo && (
              <Text style={styles.metaText}>· {item.timeAgo}</Text>
            )}
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>해당 카테고리에 등록된 토론이 없습니다.</Text>
          </View>
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
          loadingMore ? <ActivityIndicator size="small" color="#3B82F6" /> : null
        }
        ListHeaderComponent={() => (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive,
              ]}
              onPress={() => 
                {
                  setSelectedCategory(category);
                  setLastDoc(null)
                  setHasMore(true)
                  loadMore()
                }
              }
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        )}
      />

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => {
          if (user) {
            router.push('_component/create-debate-modal' as never)
          } else {
            router.push('profile' as never)
          }
        }}
      >
        <Plus size={24} color="white" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  subtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryButton: {
    marginRight: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#E5E7EB"
  },
  categoryButtonActive: {
    backgroundColor: "#111827",
  },
  categoryText: {
    fontSize: 12,
    color: "#374151",
  },
  categoryTextActive: {
    fontSize: 12,
    color: "#FFFFFF",
  },
  cardList: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    marginBottom: 8,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  badge: {
    fontSize: 10,
    backgroundColor: "#E5E7EB",
    color: "#374151",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: "hidden",
  },
  trendingBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FED7AA",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 4,
  },
  trendingText: {
    fontSize: 10,
    color: "#FB923C",
    marginLeft: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
  },
  cardContent: {},
  summary: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 8,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 10,
    color: "#6B7280",
    marginLeft: 4,
  },
  emptyContentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#111827",
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
})
