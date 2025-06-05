import React, { useState } from "react"
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native"
import { MessageSquare, Plus, TrendingUp } from "lucide-react-native"

const debateTopics = [
  {
    id: 1,
    title: "Remote work is more productive than office work",
    category: "Work & Career",
    arguments: 24,
    summary: "Debate centers on productivity metrics, collaboration benefits, and work-life balance considerations...",
    author: "Sarah Chen",
    date: "2 hours ago",
    trending: true,
  },
  {
    id: 2,
    title: "Universal Basic Income should be implemented globally",
    category: "Economics",
    arguments: 18,
    summary:
      "Discussion covers economic feasibility, social impact, and implementation challenges across different economies...",
    author: "Marcus Johnson",
    date: "5 hours ago",
    trending: false,
  },
  {
    id: 3,
    title: "AI will replace most creative jobs within 10 years",
    category: "Technology",
    arguments: 31,
    summary: "Arguments explore AI capabilities, human creativity value, and the future of creative industries...",
    author: "Elena Rodriguez",
    date: "1 day ago",
    trending: true,
  },
  {
    id: 4,
    title: "Social media has a net negative impact on society",
    category: "Society",
    arguments: 42,
    summary:
      "Debate examines mental health effects, information spread, and social connectivity benefits vs. drawbacks...",
    author: "David Kim",
    date: "2 days ago",
    trending: false,
  },
]

const categories = ["All", "Technology", "Economics", "Society", "Work & Career", "Politics", "Environment"]

export default function FeedPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredTopics =
    selectedCategory === "All"
      ? debateTopics
      : debateTopics.filter((topic) => topic.category === selectedCategory)

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>AgoraLite</Text>
        <Text style={styles.subtitle}>Structured debates and thoughtful discourse</Text>
      </View>

      {/* Category Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category)}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive,
            ]}
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

      {/* Debate Topics */}
      <FlatList
        data={filteredTopics}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.cardList}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.categoryRow}>
                <Text style={styles.badge}>{item.category}</Text>
                {item.trending && (
                  <View style={styles.trendingBadge}>
                    <TrendingUp size={12} color="#FB923C" />
                    <Text style={styles.trendingText}>Trending</Text>
                  </View>
                )}
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.summary}>{item.summary}</Text>
              <View style={styles.footerRow}>
                <View style={styles.metaRow}>
                  <MessageSquare size={14} color="#6B7280" />
                  <Text style={styles.metaText}>{item.arguments} arguments</Text>
                  <Text style={styles.metaText}>by {item.author}</Text>
                </View>
                <Text style={styles.metaText}>{item.date}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
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
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: "#111827",
  },
  categoryText: {
    fontSize: 12,
    color: "#374151",
  },
  categoryTextActive: {
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
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#111827",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
})
