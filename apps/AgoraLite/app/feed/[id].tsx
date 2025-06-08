// app/feed/[id].tsx

import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/firebaseConfig"

import type { Debate } from "@/types/home"
import type { UserProfile } from "@/types/profile"

import AuthorName, { AuthorAvatar, formatDate, isFirestoreTimestamp, onVote } from "@/lib/firebase-action"
import { Entypo, Ionicons } from "@expo/vector-icons"


export default function FeedDetailPage() {
  const params = useLocalSearchParams();
  // Ensure id is always a string
  const id = Array.isArray(params.id) ? params.id[0] : params.id ? String(params.id) : undefined;
  const router = useRouter()

  // 2) 상태 정의
  const [debate, setDebate] = useState<Debate | null>(null)
  const [authorAvatar, setAuthorAvatar] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingAvatar, setLoadingAvatar] = useState(true)

  // 3) Firestore에서 단일 토론 문서 불러오기
  useEffect(() => {
    if (!id) {
      Alert.alert("오류", "토론 ID가 없습니다.")
      router.back()
      return
    }

    const fetchDebate = async () => {
      try {
        const docRef = doc(db, "debates", id)
        const usersnap = await getDoc(docRef)
        if (usersnap.exists()) {
          // 문서가 존재하면 state에 저장
          const data = usersnap.data() as Debate
          setDebate({ ...data, id: usersnap.id })
        } else {
          // 문서를 찾지 못한 경우 경고 후 뒤로 이동
          Alert.alert("오류", "해당 토론을 찾을 수 없습니다.")
          router.back()
        }
      } catch (error) {
        console.error("토론 불러오기 실패:", error)
        Alert.alert("오류", "토론 데이터를 불러오는 중 문제가 발생했습니다.")
        router.back()
      } finally {
        setLoading(false)
      }
    }

    fetchDebate()
  }, [id])

  useEffect(() => {
    if (!debate?.author) {
      setLoadingAvatar(false)
      return
    }
    const fetchAvatar = async () => {
      try {
        const userRef = doc(db, "users", debate.author!)
        const userSnap = await getDoc(userRef)
        
        if (userSnap.exists()) {
          const userData = userSnap.data() as UserProfile
          setAuthorAvatar(userData.avatar)
        }
      } catch (error) {
        console.error("작성자 아바타 불러오기 실패:", error)
      } finally {
        setLoadingAvatar(false)
      }
    }

    fetchAvatar()
  }, [debate?.author])

  // 4) 로딩 중 UI
  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </SafeAreaView>
    )
  }

  // 5) 문서가 없는 경우
  if (!debate) {
    return (
      <SafeAreaView style={styles.center}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text style={styles.errorText}>토론을 찾을 수 없습니다</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>뒤로가기</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View>
          {/* 9) 메타 정보 (작성자, 생성 시간 등) */}
          <View style={styles.metaRow}>
            {loadingAvatar ? (
              <ActivityIndicator size="small" color="#6B7280" />
            ) : (
              debate.author && authorAvatar && (
                <AuthorAvatar
                  style={styles.authorAvatar}
                  authorRef={doc(db, "users", debate.author)}
                />
              )
            )}
            <View style={styles.metaTextContainer}>
            {debate.author && (
              <AuthorName style={styles.metaText} authorRef={doc(db, "users", debate.author)} />
            )}
            {/* Show createdAt if present and valid */}
            {/* Type guard for Firestore Timestamp */}
            {debate.createdAt && (
              <Text style={styles.metaText}>
                 {isFirestoreTimestamp(debate.createdAt)
                  ? formatDate(debate.createdAt)
                  : (debate.createdAt instanceof Date
                    ? debate.createdAt.toLocaleString('ko-KR')
                    : new Date(debate.createdAt).toLocaleString('ko-KR'))}
                {debate.timeAgo && (
                  <Text style={styles.metaText}>· {debate.timeAgo}</Text>
                )}
              </Text>
            )}
            </View>
          </View>

          {/* 8) 토론 제목 */}
          <Text style={styles.title}>{debate.title}</Text>

          {/* 7) 카테고리 및 뱃지 */}
          <View style={styles.headerRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{debate.category}</Text>
            </View>
            {debate.trending && (
              <View style={[styles.smallBadge, styles.trendingBadge]}>
                <Ionicons name="trending-up" size={14} color="#fff" />
                <Text style={styles.smallBadgeText}>인기</Text>
              </View>
            )}
            {debate.isFeatured && (
              <View style={[styles.smallBadge, styles.featuredBadge]}>
                <Entypo name="star" size={14} color="#fff" />
                <Text style={styles.smallBadgeText}>추천</Text>
              </View>
            )}
          </View>

          {/* 10) 상세 설명 */}
          <View style={styles.section}>
            <Text style={styles.description}>{debate.description}</Text>
          </View>

          {/* 11) 추천/반대 */}
          <View style={styles.votesRow}>
            <TouchableOpacity style={styles.voteButton} onPress={() => onVote(debate.id, 'like')}>
              <Entypo name="arrow-with-circle-up" size={20} color="#6B7280" />
              <Text style={styles.voteText}>{debate.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.voteButton} onPress={() => onVote(debate.id, 'dislike')}>
              <Entypo name="arrow-with-circle-down" size={20} color="#6B7280" />
              <Text style={styles.voteText}>{debate.dislikes}</Text>
            </TouchableOpacity>
          </View>
            {/* TODO: 댓글 */}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: "#EF4444",
  },
  backButton: {
    marginTop: 24,
    backgroundColor: "#3B82F6",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
  },

  contentContainer: {
    padding: 16,
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  categoryBadge: {
    backgroundColor: '#6B7280',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginRight: 8,
    shadowColor: '#6B7280',
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  smallBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginRight: 6,
    marginTop: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 1,
    elevation: 1,
  },
  trendingBadge: {
    backgroundColor: '#FBBF24',
  },
  featuredBadge: {
    backgroundColor: '#EF4444',
  },
  smallBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
    letterSpacing: 0.2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 10,
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
    backgroundColor: '#White',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  metaTextContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 6,
    fontWeight: '500',
  },
  authorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 16,
    marginRight: 6,
  },
  description: {
    fontSize: 14.5,
    color: '#374151',
    lineHeight: 22,
    fontWeight: '400',
  },
  section: {
    marginBottom: 20,
  }, 
  votesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  voteText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
})
