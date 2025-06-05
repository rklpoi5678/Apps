"use client"

import React, { useState } from "react"
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native"
import {
  MessageSquare,
  ThumbsUp,
  Calendar,
  Edit,
  Award,
  Target,
  TrendingUp,
  Activity,
  BarChart3,
} from "lucide-react-native"
import { ProgressBar } from "react-native-paper" // 간단한 프로그레스 바용
import { categoryColors, rankColors, badgeColors } from "@/lib/theme-config"

// --- 데이터 타입 정의 (타입스크립트용 인터페이스) ---
interface DebateItem {
  id: number
  title: string
  category: string
  status: string
  side: "pro" | "con"
  votes: number
  comments: number
  date: string
  result: string | null
}

interface ArgumentItem {
  id: number
  debateTitle: string
  content: string
  votes: number
  side: "pro" | "con"
  date: string
}

interface VoteItem {
  id: number
  debateTitle: string
  side: "pro" | "con"
  date: string
  status: string
}

const userProfile = {
  name: "Sarah Chen",
  username: "@sarahc_debates",
  avatar: "/placeholder.svg?height=80&width=80",
  rank: "Expert",
  points: 1247,
  nextRankPoints: 1500,
  joinDate: "March 2024",
  bio: "Product Manager passionate about technology ethics and sustainable innovation. Love a good debate!",
  stats: {
    debatesCreated: 12,
    argumentsPosted: 48,
    votesReceived: 156,
    winRate: 65,
  },
  badges: ["First Debate", "Persuasive", "Top Voter", "Debate Master"],
  favoriteTopics: ["Technology", "Science", "Philosophy"],
}

const userDebates: DebateItem[] = [
  {
    id: 1,
    title: "Remote work is more productive than office work",
    category: "Technology",
    status: "active",
    side: "pro",
    votes: 89,
    comments: 24,
    date: "2 hours ago",
    result: null,
  },
  {
    id: 2,
    title: "AI will replace most creative jobs within 10 years",
    category: "Technology",
    status: "concluded",
    side: "con",
    votes: 156,
    comments: 31,
    date: "3 days ago",
    result: "won",
  },
  {
    id: 3,
    title: "Social media has a net negative impact on society",
    category: "Science",
    status: "concluded",
    side: "pro",
    votes: 67,
    comments: 18,
    date: "1 week ago",
    result: "lost",
  },
]

const userArguments: ArgumentItem[] = [
  {
    id: 1,
    debateTitle: "Universal Basic Income should be implemented globally",
    content: "The economic models supporting UBI often overlook the inflationary pressures that would result from...",
    votes: 89,
    side: "con",
    date: "1 day ago",
  },
  {
    id: 2,
    debateTitle: "Climate change is the most urgent global issue",
    content:
      "While climate change is serious, we must also address immediate humanitarian crises that affect millions...",
    votes: 67,
    side: "con",
    date: "3 days ago",
  },
]

const userVotes: VoteItem[] = [
  {
    id: 1,
    debateTitle: "Pineapple belongs on pizza",
    side: "con",
    date: "2 hours ago",
    status: "active",
  },
  {
    id: 2,
    debateTitle: "Cryptocurrency will replace traditional money",
    side: "pro",
    date: "1 day ago",
    status: "concluded",
  },
]

// --- ProfilePage (수정된 버전) ---
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"debates" | "arguments" | "votes">("debates")
  const [currentView, setCurrentView] = useState<"profile" | "user-analytics" | "analytics">("profile")

  // 프로그레스 바 값 (0~1)
  const progressToNextRank = userProfile.points / userProfile.nextRankPoints

  // 탭별 리스트 데이터 분기
  const listData =
    activeTab === "debates"
      ? userDebates
      : activeTab === "arguments"
      ? userArguments
      : userVotes

  // ListHeaderComponent로 렌더링할 부분 (헤더~탭 영역)
  const ListHeaderComponent = () => (
    <View>
      {/* Header 섹션 */}
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
          <View style={styles.headerTextWrapper}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{userProfile.name}</Text>
              <TouchableOpacity style={styles.editButton}>
                <Edit size={16} color="#3B82F6" />
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.username}>{userProfile.username}</Text>
            <View style={styles.rankRow}>
              <View style={[styles.rankBadge, { backgroundColor: rankColors[userProfile.rank] || "#E5E7EB" }]}>
                <Text style={styles.rankText}>{userProfile.rank}</Text>
              </View>
              <Text style={styles.pointsText}>{userProfile.points} points</Text>
            </View>
            <Text style={styles.bio}>{userProfile.bio}</Text>
            <View style={styles.joinedRow}>
              <Calendar size={14} color="#DBEAFE" />
              <Text style={styles.joinedText}>Joined {userProfile.joinDate}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.contentPadding}>
        {/* Progress Card */}
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.progressHeader}>
              <Target size={18} color="#3B82F6" />
              <Text style={styles.progressTitle}>Progress to Master</Text>
            </View>
            <View style={styles.progressWrapper}>
              <View style={styles.progressLabelRow}>
                <Text style={styles.progressLabel}>Current Progress</Text>
                <Text style={styles.progressLabel}>{userProfile.points}/{userProfile.nextRankPoints}</Text>
              </View>
              <ProgressBar progress={progressToNextRank} color="#3B82F6" style={styles.progressBar} />
              <Text style={styles.progressSubtext}>
                {userProfile.nextRankPoints - userProfile.points} points to next rank
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: "#3B82F6" }]}>{userProfile.stats.debatesCreated}</Text>
            <Text style={styles.statLabel}>Debates Created</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: "#10B981" }]}>{userProfile.stats.argumentsPosted}</Text>
            <Text style={styles.statLabel}>Arguments Posted</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: "#8B5CF6" }]}>{userProfile.stats.votesReceived}</Text>
            <Text style={styles.statLabel}>Votes Received</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: "#F97316" }]}>{userProfile.stats.winRate}%</Text>
            <Text style={styles.statLabel}>Win Rate</Text>
          </View>
        </View>

        {/* Analytics Access */}
        <View style={styles.analyticsGrid}>
          <TouchableOpacity
            style={styles.analyticsCard}
            onPress={() => setCurrentView("user-analytics")}
          >
            <Activity size={24} color="#3B82F6" style={styles.analyticsIcon} />
            <Text style={styles.analyticsTitle}>My Analytics</Text>
            <Text style={styles.analyticsSubtitle}>View detailed performance metrics and insights</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.analyticsCard}
            onPress={() => setCurrentView("analytics")}
          >
            <BarChart3 size={24} color="#8B5CF6" style={styles.analyticsIcon} />
            <Text style={styles.analyticsTitle}>Debate Analytics</Text>
            <Text style={styles.analyticsSubtitle}>Analyze your debate performance and engagement</Text>
          </TouchableOpacity>
        </View>

        {/* Badges */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Award size={20} color="#FBBF24" />
            <Text style={styles.cardHeaderTitle}>Badges</Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.badgeRow}>
              {userProfile.badges.map((badge) => (
                <View
                  key={badge}
                  style={[styles.badgePill, { backgroundColor: badgeColors[badge] || "#E5E7EB" }]}
                >
                  <Award size={12} color="#FFF" style={{ marginRight: 4 }} />
                  <Text style={styles.badgeText}>{badge}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Favorite Topics */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <TrendingUp size={20} color="#10B981" />
            <Text style={styles.cardHeaderTitle}>Favorite Topics</Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.badgeRow}>
              {userProfile.favoriteTopics.map((topic) => (
                <View
                  key={topic}
                  style={[styles.topicPill, { backgroundColor: categoryColors[topic] || "#E5E7EB" }]}
                >
                  <Text style={styles.topicText}>{topic}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Tabs (My Debates / My Arguments / My Votes) */}
        <View style={styles.tabList}>
          {["debates", "arguments", "votes"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabTrigger,
                activeTab === tab && styles.tabTriggerActive,
              ]}
              onPress={() => setActiveTab(tab as any)}
            >
              <Text
                style={[
                  styles.tabTriggerText,
                  activeTab === tab && styles.tabTriggerTextActive,
                ]}
              >
                {tab === "debates"
                  ? "My Debates"
                  : tab === "arguments"
                  ? "My Arguments"
                  : "My Votes"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  )

  // FlatList로 데이터를 보여주는 renderItem 함수
  const renderItem = ({ item }: any) => {
    if (activeTab === "debates") return <DebateCard item={item} />
    if (activeTab === "arguments") return <ArgumentCard item={item} />
    return <VoteCard item={item} />
  }

  // 최종 반환: ListHeaderComponent + FlatList
  return (
    <FlatList<DebateItem | ArgumentItem | VoteItem>
      data={listData}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={<ListHeaderComponent />}
      style={styles.debateCard}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom: 100 }}
    />
  )
}

// --- 카드 컴포넌트들 (간단히 분리) ---
function DebateCard({ item }: any) {
  return (
    <View style={styles.debateCard}>
      <View style={styles.debateRow}>
        <View
          style={[
            styles.debateSideIndicator,
            { backgroundColor: item.side === "pro" ? "#10B981" : "#EF4444" },
          ]}
        />
        <View style={styles.debateMain}>
          <View style={styles.debateHeaderRow}>
            <Text
              style={[
                styles.debateCategory,
                { color: categoryColors[item.category] || "#000" },
              ]}
            >
              {item.category}
            </Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: item.status === "active" ? "#3B82F6" : "transparent" },
                item.status !== "active" && { borderWidth: 1, borderColor: "#3B82F6" },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  item.status === "active" && { color: "#FFF" },
                  item.status !== "active" && { color: "#3B82F6" },
                ]}
              >
                {item.status}
              </Text>
            </View>
            {item.result && (
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: item.result === "won" ? "#10B981" : "#EF4444",
                  },
                ]}
              >
                <Text style={styles.statusText}>{item.result}</Text>
              </View>
            )}
          </View>
          <Text style={styles.debateTitle}>{item.title}</Text>
          <View style={styles.debateFooterRow}>
            <View style={styles.debateFooterLeft}>
              <ThumbsUp size={14} color="#6B7280" />
              <Text style={styles.debateFooterText}>{item.votes}</Text>
              <MessageSquare size={14} color="#6B7280" style={{ marginLeft: 8 }} />
              <Text style={styles.debateFooterText}>{item.comments}</Text>
              <Text
                style={[
                  styles.debateSideText,
                  { color: item.side === "pro" ? "#10B981" : "#EF4444" },
                ]}
              >
                {item.side.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.debateFooterText}>{item.date}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

function ArgumentCard({ item }: any) {
  return (
    <View style={styles.argumentCard}>
      <Text style={styles.argumentLabel}>
        Argument in: <Text style={styles.argumentLabelBold}>{item.debateTitle}</Text>
      </Text>
      <Text style={styles.argumentContent}>{item.content}</Text>
      <View style={styles.argumentFooterRow}>
        <View style={styles.argumentFooterLeft}>
          <ThumbsUp size={12} color="#6B7280" />
          <Text style={styles.debateFooterText}>{item.votes} votes</Text>
          <Text
            style={[
              styles.debateSideText,
              { color: item.side === "pro" ? "#10B981" : "#EF4444", marginLeft: 8 },
            ]}
          >
            {item.side.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.debateFooterText}>{item.date}</Text>
      </View>
    </View>
  )
}

function VoteCard({ item }: any) {
  return (
    <View style={styles.voteCard}>
      <View style={styles.voteRow}>
        <View style={styles.voteMain}>
          <Text style={styles.voteTitle}>{item.debateTitle}</Text>
          <View style={styles.voteFooterLeft}>
            <Text
              style={[
                styles.debateSideText,
                { color: item.side === "pro" ? "#10B981" : "#EF4444" },
              ]}
            >
              Voted {item.side.toUpperCase()}
            </Text>
            <Text style={styles.debateFooterText}> • {item.date}</Text>
          </View>
        </View>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: item.status === "active" ? "#3B82F6" : "transparent",
            },
            item.status !== "active" && { borderWidth: 1, borderColor: "#3B82F6" },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              item.status === "active" && { color: "#FFF" },
              item.status !== "active" && { color: "#3B82F6" },
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>
    </View>
  )
}

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  header: { backgroundColor: "#3B82F6" },
  headerInner: { flexDirection: "row", padding: 16, alignItems: "flex-start" },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: "#FFF", marginRight: 12 },
  headerTextWrapper: { flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  name: { fontSize: 20, fontWeight: "bold", color: "#FFF", marginRight: 8 },
  editButton: { flexDirection: "row", alignItems: "center", padding: 4, borderWidth: 1, borderColor: "#FFF", borderRadius: 4 },
  editButtonText: { color: "#3B82F6", marginLeft: 4, fontSize: 12 },
  username: { color: "#DBEAFE", marginBottom: 6 },
  rankRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  rankBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  rankText: { fontSize: 12, fontWeight: "bold", color: "#1F2937" },
  pointsText: { color: "#DBEAFE", fontSize: 12, marginLeft: 8 },
  bio: { color: "#DBEAFE", marginBottom: 6, fontSize: 12 },
  joinedRow: { flexDirection: "row", alignItems: "center" },
  joinedText: { color: "#DBEAFE", fontSize: 12, marginLeft: 4 },
  contentPadding: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24, backgroundColor: "#FFF" },

  // 카드 공통
  card: { backgroundColor: "#FFF", borderRadius: 8, marginBottom: 12, overflow: "hidden", elevation: 2 },
  cardHeader: { flexDirection: "row", alignItems: "center", padding: 12 },
  cardHeaderTitle: { fontSize: 16, fontWeight: "bold", marginLeft: 8, color: "#1F2937" },
  cardContent: { padding: 12 },

  // Progress
  progressHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  progressTitle: { fontSize: 16, fontWeight: "bold", marginLeft: 6, color: "#1F2937" },
  progressWrapper: {},
  progressLabelRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  progressLabel: { fontSize: 12, color: "#374151" },
  progressBar: { height: 8, borderRadius: 4 },
  progressSubtext: { fontSize: 10, color: "#6B7280", marginTop: 4 },

  // Stats Grid
  statsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 12 },
  statCard: { width: "48%", backgroundColor: "#FFF", borderRadius: 8, alignItems: "center", paddingVertical: 12, marginBottom: 12, elevation: 2 },
  statNumber: { fontSize: 20, fontWeight: "bold" },
  statLabel: { fontSize: 12, color: "#4B5563", marginTop: 4 },

  // Analytics Access
  analyticsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 12 },
  analyticsCard: { width: "48%", backgroundColor: "#FFF", borderRadius: 8, padding: 12, alignItems: "center", marginBottom: 12, elevation: 2 },
  analyticsIcon: { marginBottom: 6 },
  analyticsTitle: { fontSize: 16, fontWeight: "bold", color: "#1F2937", marginBottom: 4, textAlign: "center" },
  analyticsSubtitle: { fontSize: 12, color: "#4B5563", textAlign: "center" },

  // Badges / Favorite Topics
  badgeRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, padding: 12 },
  badgePill: { flexDirection: "row", alignItems: "center", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 16, marginRight: 8, marginBottom: 4 },
  badgeText: { fontSize: 10, color: "#FFF" },
  topicPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 16, marginRight: 8, marginBottom: 4 },
  topicText: { fontSize: 10, color: "#FFF" },

  // Tabs
  tabList: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12},
  tabTrigger: { flex: 1, paddingVertical: 8, alignItems: "center", borderBottomWidth: 2, borderColor: "transparent" },
  tabTriggerActive: { borderColor: "#3B82F6" },
  tabTriggerText: { fontSize: 12, color: "#6B7280" },
  tabTriggerTextActive: { color: "#1F2937", fontWeight: "bold" },
  tabsContent: { minHeight: 200 },

  // Debate Card
  debateCard: { backgroundColor: "#FFF", borderRadius: 8, padding: 12, marginBottom: 12, elevation: 2},
  debateRow: { flexDirection: "row" },
  debateSideIndicator: { width: 8, height: "100%", borderRadius: 4, marginRight: 8 },
  debateMain: { flex: 1 },
  debateHeaderRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  debateCategory: { fontSize: 10, fontWeight: "bold", marginRight: 8 },
  statusBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 4 },
  statusText: { fontSize: 10, color: "#FFF" },
  debateTitle: { fontSize: 14, fontWeight: "bold", color: "#1F2937", marginBottom: 4 },
  debateFooterRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  debateFooterLeft: { flexDirection: "row", alignItems: "center" },
  debateFooterText: { fontSize: 10, color: "#6B7280", marginLeft: 4 },
  debateSideText: { fontSize: 10, fontWeight: "bold", marginLeft: 8 },

  // Argument Card
  argumentCard: { backgroundColor: "#FFF", borderRadius: 8, padding: 12, marginBottom: 12, elevation: 2 },
  argumentLabel: { fontSize: 12, color: "#374151", marginBottom: 4 },
  argumentLabelBold: { fontWeight: "bold", color: "#1F2937" },
  argumentContent: { fontSize: 12, color: "#4B5563", marginBottom: 6 },
  argumentFooterRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  argumentFooterLeft: { flexDirection: "row", alignItems: "center" },

  // Vote Card
  voteCard: { backgroundColor: "#FFF", borderRadius: 8, padding: 12, marginBottom: 12, elevation: 2 },
  voteRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  voteMain: {},
  voteTitle: { fontSize: 14, fontWeight: "bold", color: "#1F2937", marginBottom: 4 },
  voteFooterLeft: { flexDirection: "row", alignItems: "center" },
})