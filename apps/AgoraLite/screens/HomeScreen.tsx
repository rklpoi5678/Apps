"use client"

import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { useTheme } from "../lib/theme-provider"
import { Card, CardContent } from "../components/ui/Card"
import { Badge } from "../components/ui/Badge"
import { Avatar } from "../components/ui/Avatar"
import { Input } from "../components/ui/Input"
import { Ionicons } from "@expo/vector-icons"

// Mock data
const mockFeaturedDebates = [
  {
    id: 1,
    title: "Should AI replace human teachers in schools?",
    description: "Exploring the future of education with artificial intelligence",
    category: "Education",
    author: {
      name: "Dr. Sarah Chen",
      username: "sarahchen",
      avatar: null,
    },
    stats: {
      participants: 156,
      arguments: 48,
      votes: 1247,
      views: 15420,
    },
    timeAgo: "2h",
    status: "active",
    trending: true,
    featured: true,
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1000",
  },
  {
    id: 2,
    title: "Remote work vs office culture: The future of work",
    description: "Examining the long-term effects of remote work on productivity",
    category: "Technology",
    author: {
      name: "Marcus Johnson",
      username: "marcusj",
      avatar: null,
    },
    stats: {
      participants: 89,
      arguments: 32,
      votes: 567,
      views: 8930,
    },
    timeAgo: "5h",
    status: "active",
    trending: false,
    featured: true,
    image: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=1000",
  },
]

const mockTrendingDebates = [
  {
    id: 3,
    title: "Climate change is the most urgent global issue",
    description: "Discussing the priority of climate action in global politics",
    category: "Environment",
    author: {
      name: "EcoWarrior",
      username: "ecowarrior",
      avatar: null,
    },
    stats: {
      participants: 234,
      arguments: 89,
      votes: 2156,
      views: 25670,
    },
    timeAgo: "1d",
    status: "active",
    trending: true,
  },
  {
    id: 4,
    title: "Cryptocurrency will replace traditional banking",
    description: "Examining the future of financial systems and digital currencies",
    category: "Economics",
    author: {
      name: "CryptoExpert",
      username: "cryptoexpert",
      avatar: null,
    },
    stats: {
      participants: 178,
      arguments: 56,
      votes: 1432,
      views: 18750,
    },
    timeAgo: "6h",
    status: "active",
    trending: true,
  },
  {
    id: 5,
    title: "Social media has a net negative impact on society",
    description: "Analyzing the psychological and social effects of social media platforms",
    category: "Society",
    author: {
      name: "MindfulTech",
      username: "mindfultech",
      avatar: null,
    },
    stats: {
      participants: 312,
      arguments: 124,
      votes: 3245,
      views: 42680,
    },
    timeAgo: "2d",
    status: "active",
    trending: true,
  },
]

const mockRecentDebates = [
  {
    id: 6,
    title: "Universal basic income should be implemented globally",
    description: "Discussing the economic and social implications of UBI",
    category: "Economics",
    author: {
      name: "EconTheorist",
      username: "econtheorist",
      avatar: null,
    },
    stats: {
      participants: 87,
      arguments: 42,
      votes: 756,
      views: 9870,
    },
    timeAgo: "3h",
    status: "active",
    trending: false,
  },
  {
    id: 7,
    title: "Space exploration should be prioritized over ocean exploration",
    description: "Comparing the scientific and economic benefits of different exploration frontiers",
    category: "Science",
    author: {
      name: "CosmicExplorer",
      username: "cosmicexplorer",
      avatar: null,
    },
    stats: {
      participants: 65,
      arguments: 28,
      votes: 432,
      views: 6540,
    },
    timeAgo: "8h",
    status: "active",
    trending: false,
  },
]

const HomeScreen = () => {
  const navigation = useNavigation()
  const { colors } = useTheme()
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [featuredDebates, setFeaturedDebates] = useState(mockFeaturedDebates)
  const [trendingDebates, setTrendingDebates] = useState(mockTrendingDebates)
  const [recentDebates, setRecentDebates] = useState(mockRecentDebates)
  const [loadingMore, setLoadingMore] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setRefreshing(false)
  }

  const loadMoreDebates = async () => {
    if (loadingMore) return
    setLoadingMore(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLoadingMore(false)
  }

  const handleDebatePress = (debate) => {
    navigation.navigate("DebateDetail", { debateId: debate.id })
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to search results
      console.log("Searching for:", searchQuery)
    }
  }

  const renderFeaturedItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.featuredCard, { backgroundColor: colors.card }]}
      onPress={() => handleDebatePress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.featuredImageContainer}>
        {item.image ? (
          <View style={styles.featuredImage}>
            <View style={styles.featuredImageOverlay} />
            <View style={styles.featuredContent}>
              <View style={styles.featuredBadges}>
                <Badge variant="secondary" style={{ marginRight: 8 }}>
                  {item.category}
                </Badge>
                <Badge variant="warning">
                  <Ionicons name="star" size={12} color="#1F2937" style={{ marginRight: 4 }} />
                  <Text style={{ color: "#1F2937", fontSize: 12 }}>Featured</Text>
                </Badge>
              </View>
              <Text style={styles.featuredTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.featuredDescription} numberOfLines={2}>
                {item.description}
              </Text>
              <View style={styles.featuredFooter}>
                <View style={styles.featuredAuthor}>
                  <Avatar name={item.author.name} size="sm" source={item.author.avatar} />
                  <Text style={styles.featuredAuthorName}>{item.author.name}</Text>
                </View>
                <View style={styles.featuredStats}>
                  <View style={styles.featuredStat}>
                    <Ionicons name="chatbubble-outline" size={14} color="#FFFFFF" />
                    <Text style={styles.featuredStatText}>{item.stats.arguments}</Text>
                  </View>
                  <View style={styles.featuredStat}>
                    <Ionicons name="thumbs-up-outline" size={14} color="#FFFFFF" />
                    <Text style={styles.featuredStatText}>{item.stats.votes}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View style={[styles.featuredPlaceholder, { backgroundColor: colors.muted + "30" }]}>
            <Ionicons name="image-outline" size={48} color={colors.muted} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  )

  const renderDebateItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleDebatePress(item)} activeOpacity={0.7}>
      <Card style={styles.debateCard}>
        <CardContent>
          <View style={styles.debateHeader}>
            <View style={styles.badgeContainer}>
              <Badge variant="secondary" style={{ marginRight: 8 }}>
                {item.category}
              </Badge>
              {item.trending && (
                <Badge
                  variant="outline"
                  style={{ borderColor: colors.warning, backgroundColor: colors.warning + "20" }}
                >
                  <Ionicons name="trending-up" size={12} color={colors.warning} style={{ marginRight: 4 }} />
                  <Text style={{ color: colors.warning, fontSize: 12 }}>Trending</Text>
                </Badge>
              )}
            </View>
            <Text style={[styles.debateTitle, { color: colors.text }]} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={[styles.debateDescription, { color: colors.muted }]} numberOfLines={2}>
              {item.description}
            </Text>
          </View>

          <View style={styles.debateFooter}>
            <View style={styles.authorContainer}>
              <Avatar name={item.author.name} size="sm" source={item.author.avatar} />
              <View style={styles.authorInfo}>
                <Text style={[styles.authorName, { color: colors.text }]}>{item.author.name}</Text>
                <Text style={[styles.timeAgo, { color: colors.muted }]}>{item.timeAgo}</Text>
              </View>
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.stat}>
                <Ionicons name="chatbubble-outline" size={14} color={colors.muted} />
                <Text style={[styles.statText, { color: colors.muted }]}>{item.stats.arguments}</Text>
              </View>
              <View style={styles.stat}>
                <Ionicons name="thumbs-up-outline" size={14} color={colors.muted} />
                <Text style={[styles.statText, { color: colors.muted }]}>{item.stats.votes}</Text>
              </View>
            </View>
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  )

  const renderSectionHeader = (title, actionText, onAction) => (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      {actionText && (
        <TouchableOpacity onPress={onAction} activeOpacity={0.7}>
          <Text style={[styles.sectionAction, { color: colors.primary }]}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <FlatList
        data={recentDebates}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderDebateItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
        onEndReached={loadMoreDebates}
        onEndReachedThreshold={0.1}
        ListHeaderComponent={() => (
          <View>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Input
                placeholder="Search debates, topics, or users..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                leftIcon={<Ionicons name="search" size={20} color={colors.muted} />}
                containerStyle={{ marginHorizontal: 16, marginVertical: 12 }}
              />
            </View>

            {/* Featured Debates */}
            {renderSectionHeader("Featured Debates", "See All", () => console.log("See all featured"))}
            <FlatList
              data={featuredDebates}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => `featured-${item.id}`}
              renderItem={renderFeaturedItem}
              contentContainerStyle={styles.featuredList}
              snapToAlignment="start"
              decelerationRate="fast"
              snapToInterval={280}
            />

            {/* Trending Debates */}
            {renderSectionHeader("Trending Now", "See All", () => console.log("See all trending"))}
            {trendingDebates.map((debate) => (
              <TouchableOpacity key={debate.id} onPress={() => handleDebatePress(debate)} activeOpacity={0.7}>
                <Card style={styles.trendingCard}>
                  <CardContent>
                    <View style={styles.trendingHeader}>
                      <Badge variant="secondary" style={{ marginRight: 8 }}>
                        {debate.category}
                      </Badge>
                      <Badge variant="warning">
                        <Ionicons name="trending-up" size={12} color="#1F2937" style={{ marginRight: 4 }} />
                        <Text style={{ color: "#1F2937", fontSize: 12 }}>Trending</Text>
                      </Badge>
                    </View>
                    <Text style={[styles.trendingTitle, { color: colors.text }]} numberOfLines={2}>
                      {debate.title}
                    </Text>
                    <View style={styles.trendingFooter}>
                      <View style={styles.trendingAuthor}>
                        <Avatar name={debate.author.name} size="xs" source={debate.author.avatar} />
                        <Text style={[styles.trendingAuthorName, { color: colors.text }]}>{debate.author.name}</Text>
                      </View>
                      <View style={styles.trendingStats}>
                        <Text style={[styles.trendingStatText, { color: colors.muted }]}>
                          <Ionicons name="people-outline" size={12} color={colors.muted} /> {debate.stats.participants}
                        </Text>
                      </View>
                    </View>
                  </CardContent>
                </Card>
              </TouchableOpacity>
            ))}

            {/* Recent Debates */}
            {renderSectionHeader("Recent Debates", "See All", () => console.log("See all recent"))}
          </View>
        )}
        ListFooterComponent={() =>
          loadingMore ? (
            <View style={styles.loadingFooter}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.muted }]}>Loading more debates...</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionAction: {
    fontSize: 14,
    fontWeight: "500",
  },
  featuredList: {
    paddingLeft: 16,
    paddingRight: 8,
    paddingBottom: 16,
  },
  featuredCard: {
    width: 280,
    height: 220,
    marginRight: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  featuredImageContainer: {
    flex: 1,
  },
  featuredImage: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#000",
  },
  featuredImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  featuredPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  featuredContent: {
    padding: 16,
  },
  featuredBadges: {
    flexDirection: "row",
    marginBottom: 8,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  featuredDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 12,
  },
  featuredFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  featuredAuthor: {
    flexDirection: "row",
    alignItems: "center",
  },
  featuredAuthorName: {
    marginLeft: 8,
    fontSize: 12,
    color: "#FFFFFF",
  },
  featuredStats: {
    flexDirection: "row",
    gap: 8,
  },
  featuredStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  featuredStatText: {
    fontSize: 12,
    color: "#FFFFFF",
  },
  trendingCard: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  trendingHeader: {
    flexDirection: "row",
    marginBottom: 8,
  },
  trendingTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  trendingFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  trendingAuthor: {
    flexDirection: "row",
    alignItems: "center",
  },
  trendingAuthorName: {
    marginLeft: 8,
    fontSize: 12,
  },
  trendingStats: {
    flexDirection: "row",
  },
  trendingStatText: {
    fontSize: 12,
  },
  debateCard: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  debateHeader: {
    marginBottom: 12,
  },
  badgeContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  debateTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  debateDescription: {
    fontSize: 14,
  },
  debateFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  authorInfo: {
    marginLeft: 8,
  },
  authorName: {
    fontSize: 14,
    fontWeight: "500",
  },
  timeAgo: {
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 12,
  },
  loadingFooter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
  },
})

export default HomeScreen
