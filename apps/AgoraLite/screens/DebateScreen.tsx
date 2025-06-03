"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { useTheme } from "../lib/theme-provider"
import { Card, CardContent, CardHeader } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Badge } from "../components/ui/Badge"
import { Avatar } from "../components/ui/Avatar"
import { Input } from "../components/ui/Input"
import { Ionicons } from "@expo/vector-icons"

// Mock data
const mockDebates = [
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
  },
  {
    id: 3,
    title: "Climate change is the most urgent global issue",
    description: "Discussing the priority of climate action in global politics",
    category: "Science",
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
    status: "concluded",
    trending: true,
  },
]

const categories = ["All", "Technology", "Science", "Politics", "Society", "Education", "Health", "Environment"]
const sortOptions = ["Latest", "Most Popular", "Most Debated", "Trending"]

const DebateScreen = () => {
  const navigation = useNavigation()
  const { colors } = useTheme()
  const [debates, setDebates] = useState(mockDebates)
  const [filteredDebates, setFilteredDebates] = useState(mockDebates)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedSort, setSelectedSort] = useState("Latest")
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(false)

  // Filter and sort debates
  useEffect(() => {
    let filtered = debates

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((debate) => debate.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (debate) =>
          debate.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          debate.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          debate.author.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Sort debates
    switch (selectedSort) {
      case "Most Popular":
        filtered = filtered.sort((a, b) => b.stats.votes - a.stats.votes)
        break
      case "Most Debated":
        filtered = filtered.sort((a, b) => b.stats.arguments - a.stats.arguments)
        break
      case "Trending":
        filtered = filtered.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0))
        break
      default: // Latest
        filtered = filtered.sort((a, b) => new Date(b.timeAgo).getTime() - new Date(a.timeAgo).getTime())
    }

    setFilteredDebates(filtered)
  }, [debates, selectedCategory, selectedSort, searchQuery])

  const onRefresh = async () => {
    setRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setRefreshing(false)
  }

  const loadMore = async () => {
    if (loading) return
    setLoading(true)
    // Simulate loading more debates
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLoading(false)
  }

  const handleDebatePress = (debate) => {
    navigation.navigate("DebateDetail", { debateId: debate.id })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return colors.success
      case "concluded":
        return colors.muted
      case "scheduled":
        return colors.warning
      default:
        return colors.muted
    }
  }

  const renderDebateItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleDebatePress(item)} activeOpacity={0.7}>
      <Card style={styles.debateCard}>
        <CardHeader>
          <View style={styles.cardHeader}>
            <View style={styles.badgeContainer}>
              <Badge variant="secondary" style={{ marginRight: 8 }}>
                {item.category}
              </Badge>
              <Badge
                style={{
                  backgroundColor: getStatusColor(item.status) + "20",
                  borderColor: getStatusColor(item.status),
                  borderWidth: 1,
                }}
              >
                <Text style={{ color: getStatusColor(item.status), fontSize: 12 }}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Text>
              </Badge>
              {item.trending && (
                <Badge variant="warning" style={{ marginLeft: 8 }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons name="trending-up" size={12} color="#1F2937" style={{ marginRight: 4 }} />
                    <Text style={{ color: "#1F2937", fontSize: 12 }}>Trending</Text>
                  </View>
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
        </CardHeader>
        <CardContent>
          <View style={styles.authorContainer}>
            <Avatar name={item.author.name} size="sm" source={item.author.avatar} />
            <View style={styles.authorInfo}>
              <Text style={[styles.authorName, { color: colors.text }]}>{item.author.name}</Text>
              <Text style={[styles.timeAgo, { color: colors.muted }]}>{item.timeAgo}</Text>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Ionicons name="people-outline" size={16} color={colors.muted} />
              <Text style={[styles.statText, { color: colors.muted }]}>{item.stats.participants}</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="chatbubble-outline" size={16} color={colors.muted} />
              <Text style={[styles.statText, { color: colors.muted }]}>{item.stats.arguments}</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="thumbs-up-outline" size={16} color={colors.muted} />
              <Text style={[styles.statText, { color: colors.muted }]}>{item.stats.votes}</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="eye-outline" size={16} color={colors.muted} />
              <Text style={[styles.statText, { color: colors.muted }]}>{item.stats.views}</Text>
            </View>
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  )

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Search */}
      <Input
        placeholder="Search debates, topics, or users..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        leftIcon={<Ionicons name="search" size={20} color={colors.muted} />}
        containerStyle={{ marginBottom: 16 }}
      />

      {/* Category Filter */}
      <View style={styles.filterSection}>
        <Text style={[styles.filterTitle, { color: colors.text }]}>Categories</Text>
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

      {/* Sort Options */}
      <View style={styles.filterSection}>
        <Text style={[styles.filterTitle, { color: colors.text }]}>Sort by</Text>
        <FlatList
          data={sortOptions}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Button
              variant={selectedSort === item ? "primary" : "outline"}
              size="sm"
              style={{ marginRight: 8 }}
              onPress={() => setSelectedSort(item)}
            >
              {item}
            </Button>
          )}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      </View>

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={[styles.resultsCount, { color: colors.text }]}>
          {filteredDebates.length} debate{filteredDebates.length !== 1 ? "s" : ""} found
        </Text>
        <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
          <Ionicons name="options-outline" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  )

  const renderFooter = () => {
    if (!loading) return null
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.muted }]}>Loading more debates...</Text>
      </View>
    )
  }

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Ionicons name="chatbubbles-outline" size={64} color={colors.muted} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>No debates found</Text>
      <Text style={[styles.emptyDescription, { color: colors.muted }]}>
        Try adjusting your search or filter criteria
      </Text>
      <Button
        variant="primary"
        style={{ marginTop: 16 }}
        onPress={() => {
          setSearchQuery("")
          setSelectedCategory("All")
          setSelectedSort("Latest")
        }}
      >
        Clear Filters
      </Button>
    </View>
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <FlatList
        data={filteredDebates}
        renderItem={renderDebateItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        contentContainerStyle={filteredDebates.length === 0 ? { flexGrow: 1 } : undefined}
        showsVerticalScrollIndicator={false}
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
    paddingBottom: 8,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: "500",
  },
  filterButton: {
    padding: 4,
  },
  debateCard: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  cardHeader: {
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  debateTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    lineHeight: 22,
  },
  debateDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  authorInfo: {
    marginLeft: 8,
    flex: 1,
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
    justifyContent: "space-between",
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  statText: {
    fontSize: 12,
    marginLeft: 4,
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
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
})

export default DebateScreen
