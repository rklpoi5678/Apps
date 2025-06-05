import React, { useState } from "react"
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Pressable,
} from "react-native"
import {
  MessageSquare,
  ThumbsUp,
  Clock,
  TrendingUp,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react-native"

const featuredDebates = [
  {
    id: 1,
    title: "Should AI replace human teachers in schools?",
    category: "Education",
    description: "Exploring the future of education with artificial intelligence",
    participants: 156,
    timeLeft: "2 days",
  },
  {
    id: 2,
    title: "Is remote work killing company culture?",
    category: "Technology",
    description: "The impact of distributed teams on workplace dynamics",
    participants: 89,
    timeLeft: "5 hours",
  },
  {
    id: 3,
    title: "Should professional athletes be paid more than doctors?",
    category: "Sports",
    description: "Examining salary priorities in modern society",
    participants: 234,
    timeLeft: "1 day",
  },
]

const trendingDebates = [
  {
    id: 1,
    title: "Pineapple belongs on pizza",
    category: "Pop Culture",
    votes: 1247,
    comments: 89,
    trending: true,
    author: "FoodieDebater",
    timeAgo: "2h",
  },
  {
    id: 2,
    title: "Climate change is the most urgent global issue",
    category: "Science",
    votes: 2156,
    comments: 156,
    trending: true,
    author: "EcoWarrior",
    timeAgo: "4h",
  },
  {
    id: 3,
    title: "Social media does more harm than good",
    category: "Technology",
    votes: 987,
    comments: 67,
    trending: false,
    author: "TechSkeptic",
    timeAgo: "6h",
  },
]

const categories = [
  "All",
  "Sports",
  "Science",
  "Philosophy",
  "Pop Culture",
  "Politics",
  "Technology",
  "Health",
  "Education",
]

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [currentSlide, setCurrentSlide] = useState(0)

  const filteredDebates =
    selectedCategory === "All"
      ? trendingDebates
      : trendingDebates.filter((debate) => debate.category === selectedCategory)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredDebates.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredDebates.length) % featuredDebates.length)
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Toronus</Text>
        <Text style={styles.headerSubtitle}>Join the conversation. Shape the debate.</Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Debates of the Day</Text>
        <View style={styles.sliderControls}>
          <Pressable onPress={prevSlide}><ChevronLeft size={16} /></Pressable>
          <Pressable onPress={nextSlide}><ChevronRight size={16} /></Pressable>
        </View>
      </View>

      <View style={styles.cardSlider}>
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
          {featuredDebates.map((debate) => (
            <View key={debate.id} style={styles.featureCard}>
              <Text style={styles.category}>{debate.category}</Text>
              <Text style={styles.cardTitle}>{debate.title}</Text>
              <Text style={styles.cardDescription}>{debate.description}</Text>
              <View style={styles.metaRow}>
                <MessageSquare size={12} />
                <Text style={styles.metaText}>{debate.participants} participants</Text>
                <Clock size={12} />
                <Text style={styles.metaText}>{debate.timeLeft} left</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <ScrollView horizontal style={styles.categoryScroll} showsHorizontalScrollIndicator={false}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryButton, selectedCategory === category && styles.categoryButtonActive]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={selectedCategory === category ? styles.categoryTextActive : styles.categoryText}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Trending Debates</Text>
      {filteredDebates.map((debate) => (
        <View key={debate.id} style={styles.debateCard}>
          <Text style={styles.cardTitle}>{debate.title}</Text>
          <Text style={styles.category}>{debate.category}</Text>
          <View style={styles.metaRow}>
            <ThumbsUp size={14} />
            <Text style={styles.metaText}>{debate.votes}</Text>
            <MessageSquare size={14} />
            <Text style={styles.metaText}>{debate.comments}</Text>
            <Text style={styles.metaText}>by {debate.author} • {debate.timeAgo}</Text>
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.fab}>
        <Plus size={24} color="white" />
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", paddingBottom: 100 },
  header: { backgroundColor: "#3B82F6", padding: 16 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "white" },
  headerSubtitle: { fontSize: 12, color: "#DBEAFE" },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  sliderControls: { flexDirection: "row", gap: 8 },
  cardSlider: { paddingHorizontal: 16 },
  featureCard: { width: 300, padding: 16, marginRight: 16, backgroundColor: "white", borderRadius: 8 },
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
  fab: { position: "absolute", bottom: 24, right: 16, width: 56, height: 56, borderRadius: 28, backgroundColor: "#6366F1", alignItems: "center", justifyContent: "center" },
})
