// screens/UserProfileScreen.tsx

import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
} from "react-native"
import { signOut, User } from "firebase/auth"
import {
  doc,
  getDoc,
  updateDoc,
  DocumentData,
} from "firebase/firestore"
import { Edit, Calendar, Award, TrendingUp } from "lucide-react-native"
import { auth, db } from "@/firebaseConfig" // 본인의 Firebase 설정
import { rankColors, categoryColors, badgeColors } from "@/lib/theme-config"
import { UserProfile } from "@/types/profile"
import { AuthorAvatar } from "@/lib/firebase-action"

export default function UserProfileScreen() {
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState("")
  const [editedBio, setEditedBio] = useState("")

  // 현재 로그인된 Firebase User
  const currentUser: User | null = auth.currentUser

  // 3) Firestore에서 사용자 프로필 불러오기
  useEffect(() => {
    if (!currentUser) {
      Alert.alert("로그인 오류", "사용자를 찾을 수 없습니다.")
      return
    }
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "users", currentUser.uid)
        const snap = await getDoc(docRef)
        if (snap.exists()) {
          const data = snap.data() as DocumentData
          const profile: UserProfile = {
            uid: currentUser.uid,
            name: data.name,
            rank: data.rank,
            points: data.points,
            bio: data.bio,
            joinDate: data.joinDate,
            avatar: data.avatar,
            stats: {
              debatesCreated: data.stats.debatesCreated,
              argumentsPosted: data.stats.argumentsPosted,
              votesReceived: data.stats.votesReceived,
              winRate: data.stats.winRate,
            },
            badges: data.badges,
            favoriteTopics: data.favoriteTopics,
          }
          setUserProfile(profile)
        } else {
          Alert.alert("프로필 없음", "등록된 사용자 프로필이 없습니다.")
        }
      } catch (err) {
        console.error("프로필 로드 실패:", err)
        Alert.alert("오류", "프로필을 불러오는 중 오류가 발생했습니다.")
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  // 4) 프로필 정보 저장
  const onSaveProfile = async () => {
    if (!editedName.trim()) {
      Alert.alert("알림", "이름을 비워둘 수 없습니다.")
      return
    }
    if (!userProfile) return

    setLoading(true)
    try {
      const userRef = doc(db, "users", userProfile.uid)
      await updateDoc(userRef, {
        name: editedName.trim(),
        bio: editedBio.trim(),
        updatedAt: new Date(),
      })
      setUserProfile({
        ...userProfile,
        name: editedName.trim(),
        bio: editedBio.trim(),
      })
      setIsEditing(false)
      Alert.alert("알림", "프로필이 저장되었습니다.")
    } catch (err) {
      console.error("프로필 저장 실패:", err)
      Alert.alert("오류", "프로필을 저장하는 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  // 5) 로그아웃
  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (err) {
      console.error("로그아웃 실패:", err)
      Alert.alert("오류", "로그아웃에 실패했습니다.")
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    )
  }

  if (!userProfile) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>프로필을 불러올 수 없습니다.</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerInner}>
          {currentUser && currentUser.uid && (
            <AuthorAvatar
              style={styles.avatar}
              authorRef={doc(db, "users", currentUser.uid)}
            />
          )}
          <View style={styles.headerTextWrapper}>
            <View style={styles.nameRow}>
              {isEditing ? (
                <TextInput
                  style={[styles.name, styles.nameInput]}
                  value={editedName}
                  onChangeText={setEditedName}
                  placeholder="이름을 입력하세요"
                  placeholderTextColor="#999"
                />
              ) : (
                <Text style={styles.name}>{userProfile.name}</Text>
              )}

              {isEditing ? (
                <>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={onSaveProfile}
                  >
                    <Text style={styles.editButtonText}>저장</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => setIsEditing(false)}
                  >
                    <Text style={styles.editButtonText}>취소</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => {
                      setEditedName(userProfile.name)
                      setEditedBio(userProfile.bio)
                      setIsEditing(true)
                    }}
                  >
                    <Edit size={16} color="#fff" />
                    <Text style={styles.editButtonText}>프로필 편집</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={handleSignOut}
                  >
                    <Edit size={16} color="#fff" />
                    <Text style={styles.editButtonText}>로그아웃</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>

            <Text style={styles.username}>{currentUser?.email}</Text>

            <View style={styles.rankRow}>
              <View
                style={[
                  styles.rankBadge,
                  { backgroundColor: rankColors[userProfile.rank] || "#E5E7EB" },
                ]}
              >
                <Text style={styles.rankText}>{userProfile.rank}</Text>
              </View>
              <Text style={styles.pointsText}>
                {userProfile.points} 포인트
              </Text>
            </View>

            {isEditing ? (
              <TextInput
                style={[styles.bio, styles.bioInput]}
                value={editedBio}
                onChangeText={setEditedBio}
                placeholder="간단한 자기소개"
                placeholderTextColor="#999"
                multiline
              />
            ) : (
              <Text style={styles.bio}>{userProfile.bio}</Text>
            )}

            <View style={styles.joinedRow}>
              <Calendar size={14} color="#DBEAFE" />
              <Text style={styles.joinedText}>
                가입일 {userProfile.joinDate.split("T")[0]}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.contentPadding}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: "#3B82F6" }]}>
              {userProfile.stats.debatesCreated}
            </Text>
            <Text style={styles.statLabel}>생성한 토론</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: "#10B981" }]}>
              {userProfile.stats.argumentsPosted}
            </Text>
            <Text style={styles.statLabel}>작성한 의견</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: "#8B5CF6" }]}>
              {userProfile.stats.votesReceived}
            </Text>
            <Text style={styles.statLabel}>받은 투표</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: "#F97316" }]}>
              {userProfile.stats.winRate}%
            </Text>
            <Text style={styles.statLabel}>승률</Text>
          </View>
        </View>

        {/* <View style={styles.analyticsGrid}>
          <TouchableOpacity style={[styles.analyticsCard, isEditing && styles.disabledCard]}>
            <ActivityIndicator size="small" color="#3B82F6" style={styles.analyticsIcon} />
            <Text style={styles.analyticsTitle}>내 분석</Text>
            <Text style={styles.analyticsSubtitle}>
              자세한 성과 지표를 확인하세요
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.analyticsCard, isEditing && styles.disabledCard]}>
            <ActivityIndicator size="small" color="#8B5CF6" style={styles.analyticsIcon} />
            <Text style={styles.analyticsTitle}>토론 분석</Text>
            <Text style={styles.analyticsSubtitle}>
              토론 참여도를 분석하세요
            </Text>
          </TouchableOpacity>
        </View> */}

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Award size={20} color="#FBBF24" />
            <Text style={styles.cardHeaderTitle}>뱃지</Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.badgeRow}>
              {userProfile.badges.map(badge => (
                <View
                  key={badge}
                  style={[
                    styles.badgePill,
                    { backgroundColor: badgeColors[badge] || "#6B7280" },
                  ]}
                >
                  <Award size={12} color="#FFF" style={{ marginRight: 4 }} />
                  <Text style={styles.badgeText}>{badge}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <TrendingUp size={20} color="#10B981" />
            <Text style={styles.cardHeaderTitle}>관심 주제</Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.badgeRow}>
              {userProfile.favoriteTopics.map(topic => (
                <View
                  key={topic}
                  style={[
                    styles.topicPill,
                    { backgroundColor: categoryColors[topic] || "#6B7280" },
                  ]}
                >
                  <Text style={styles.topicText}>{topic}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: { fontSize: 16, color: "#666" },

  header: {
    backgroundColor: "#3B82F6",
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  headerInner: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#fff",
  },
  headerTextWrapper: {
    flex: 1,
    marginLeft: 12,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  nameInput: {
    flex: 1,
    backgroundColor: "#fff",
    color: "#111827",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 18,
  },
  editButton: {
    marginLeft: 12,
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
  },
  editButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#fff",
  },
  username: {
    fontSize: 14,
    color: "#E0E7FF",
    marginTop: 4,
  },
  rankRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  rankBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  rankText: {
    color: "#666",
    fontWeight: "600",
  },
  pointsText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#E0E7FF",
  },
  bio: {
    fontSize: 12,
    color: "#E0E7FF",
    marginTop: 8,
  },
  bioInput: {
    backgroundColor: "#fff",
    color: "#111827",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 14,
    marginTop: 4,
  },
  joinedRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  joinedText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#DBEAFE",
  },

  contentPadding: {
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: "#F9FAFB",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    alignItems: "center",
    elevation: 2,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },

  analyticsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  analyticsCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 4,
    alignItems: "center",
    elevation: 2,
  },
  disabledCard: {
    opacity: 0.4,
  },
  analyticsIcon: {
    marginBottom: 8,
  },
  analyticsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  analyticsSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginLeft: 8,
  },
  cardContent: {
    padding: 12,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  badgePill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
  },
  topicPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  topicText: {
    fontSize: 12,
    color: "#fff",
  },
})
