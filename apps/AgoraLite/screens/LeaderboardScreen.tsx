"use client"

import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "../lib/theme-provider"
import { Card, CardContent } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Badge } from "../components/ui/Badge"
import { Avatar } from "../components/ui/Avatar"
import { Ionicons } from "@expo/vector-icons"

// Mock data
const mockLeaderboard = [
  {
    id: 1,
    rank: 1,
    user: {
      name: "Dr. Sarah Chen",
      username: "sarahchen",
      avatar: null,
      verified: true,
    },
    stats: {
      points: 15420,
      debates: 89,
      wins: 67,
      winRate: 75.3,
      followers: 2340,
    },
    badges: ["Debate Master", "Top Contributor", "Expert Verified"],
    category: "Education",
    trend: "up",
  },
  {
    id: 2,
    rank: 2,
    user: {
      name: "Marcus Johnson",
      username: "marcusj",
      avatar: null,
      verified: false,
    },
    stats: {
      points: 12890,
      debates: 76,
      wins: 54,
      winRate: 71.1,
      followers: 1890,
    },
    badges: ["Rising Star", "Persuasive"],
    category: "Technology",
    trend: "up",
  },
  {
    id: 3,
    rank: 3,
    user: {
      name: "Elena Rodriguez",
      username: "elenarodriguez",
      avatar: null,
      verified: true,
    },
    stats: {
      points: 11560,
      debates: 92,
      wins: 61,
      winRate: 66.3,
      followers: 2100,
    },
    badges: ["Consistent Debater", "Logic Master"],
    category: "Science",
    trend: "down",
  },
]

const timeframes = ["This Week", "This Month", "All Time"]
const categories = ["All", "Technology", "Science", "Politics", "Society", "Education"]

const LeaderboardScreen = () => {
  const { colors } = useTheme()
  const [leaderboard, setLeaderboard] = useState(mockLeaderboard)
  const [selectedTimeframe, setSelectedTimeframe] = useState("This Week")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setRefreshing(false)
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <Ionicons name="trending-up" size={16} color={colors.success} />
      case "down":
        return <Ionicons name="trending-down" size={16} color={colors.danger} />
      default:
        return <Ionicons name="remove" size={16} color={colors.muted} />
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "#FFD700" // Gold
      case 2:
        return "#C0C0C0" // Silver
      case 3:
        return "#CD7F32" // Bronze
      default:
        return colors.muted
    }
  }

  const renderLeaderboardItem = ({ item, index }) => (
    <TouchableOpacity activeOpacity={0.7}>
      <Card style={[styles.leaderboardCard, index < 3 && styles.topThreeCard]}>
        <CardContent>
          <View style={styles.cardContent}>
            {/* Rank and Avatar */}
            <View style={styles.leftSection}>
              <View style={[styles.rankContainer, { backgroundColor: getRankColor(item.rank) + "20" }]}>
                <Text style={[styles.rankText, { color: getRankColor(item.rank) }]}>#{item.rank}</Text>
              </View>
              <Avatar name={item.user.name} size="lg" source={item.user.avatar} />
            </View>

            {/* User Info */}
            <View style={styles.userInfo}>
              <View style={styles.userHeader}>
                <Text style={[styles.userName, { color: colors.text }]} numberOfLines={1}>
                  {item.user.name}
                </Text>
                {item.user.verified && (
                  <Ionicons name="checkmark-circle" size={16} color={colors.primary} style={{ marginLeft: 4 }} />
                )}
                {getTrendIcon(item.trend)}
              </View>

              <Text style={[styles.username, { color: colors.muted }]}>@{item.user.username}</Text>

              <Badge variant="secondary" style={{ alignSelf: "flex-start", marginTop: 4 }}>
                {item.category}
              </Badge>

              {/* Stats */}
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.text }]}>{item.stats.points.toLocaleString()}</Text>
                  <Text style={[styles.statLabel, { color: colors.muted }]}>Points</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.text }]}>{item.stats.debates}</Text>
                  <Text style={[styles.statLabel, { color: colors.muted }]}>Debates</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.text }]}>{item.stats.winRate}%</Text>
                  <Text style={[styles.statLabel, { color: colors.muted }]}>Win Rate</Text>
                </View>
              </View>

              {/* Badges */}
              <View style={styles.badgesContainer}>
                {item.badges.slice(0, 2).map((badge, badgeIndex) => (
                  <Badge key={badgeIndex} variant="outline" style={{ marginRight: 4, marginBottom: 4 }}>
                    <Text style={{ fontSize: 10 }}>{badge}</Text>
                  </Badge>
                ))}
                {item.badges.length > 2 && (
                  <Badge variant="outline" style={{ marginBottom: 4 }}>
                    <Text style={{ fontSize: 10 }}>+{item.badges.length - 2}</Text>
                  </Badge>
                )}
              </View>
            </View>
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  )

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Title */}
      <View style={styles.titleContainer}>
        <Ionicons name="trophy" size={24} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text }]}>Leaderboard</Text>
      </View>

      {/* Filters */}
      <View style={styles.filterSection}>
        <Text style={[styles.filterTitle, { color: colors.text }]}>Timeframe</Text>
        <FlatList
          data={timeframes}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Button
              variant={selectedTimeframe === item ? "primary" : "outline"}
              size="sm"
              style={{ marginRight: 8 }}
              onPress={() => setSelectedTimeframe(item)}
            >
              {item}
            </Button>
          )}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      </View>

      <View style={styles.filterSection}>
        <Text style={[styles.filterTitle, { color: colors.text }]}>Category</Text>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Button
              variant={selectedCategory === item ? "primary" : "outline"}
              size="sm"
              style={{ marginRight: 8 }}
              onPress={() => setSelectedCategory(item)}
            >
              {item}
            </Button>
          )}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      </View>

      {/* Top 3 Podium */}
      <View style={styles.podiumContainer}>
        <Text style={[styles.podiumTitle, { color: colors.text }]}>Top Debaters</Text>
        <View style={styles.podium}>
          {leaderboard.slice(0, 3).map((user, index) => (
            <View key={user.id} style={[styles.podiumItem, { order: index === 0 ? 2 : index === 1 ? 1 : 3 }]}>
              <View style={[styles.podiumRank, { height: index === 0 ? 80 : index === 1 ? 60 : 40 }]}>
                <Avatar name={user.user.name} size={index === 0 ? "lg" : "md"} source={user.user.avatar} />
                <Text style={[styles.podiumName, { color: colors.text }]} numberOfLines={1}>
                  {user.user.name.split(" ")[0]}
                </Text>
                <View style={[styles.podiumBadge, { backgroundColor: getRankColor(user.rank) }]}>
                  <Text style={styles.podiumBadgeText}>{user.rank}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <FlatList
        data={leaderboard}
        renderItem={renderLeaderboardItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 8,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  podiumContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  podiumTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  podium: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    height: 120,
  },
  podiumItem: {
    alignItems: "center",
    marginHorizontal: 8,
  },
  podiumRank: {
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 8,
    position: "relative",
  },
  podiumName: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
  },
  podiumBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  podiumBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  leaderboardCard: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  topThreeCard: {
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  leftSection: {
    alignItems: "center",
    marginRight: 16,
  },
  rankContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  rankText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  userInfo: {
    flex: 1,
  },
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  username: {
    fontSize: 14,
    marginBottom: 8,
  },
  statsGrid: {
    flexDirection: "row",
    marginTop: 12,
    marginBottom: 8,
  },
  statItem: {
    alignItems: "center",
    marginRight: 24,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
})

export default LeaderboardScreen
