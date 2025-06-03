"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal,
  ScrollView,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "../../lib/theme-provider"
import { Card, CardContent, CardHeader } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Badge } from "../../components/ui/Badge"
import { Avatar } from "../../components/ui/Avatar"
import { Input } from "../../components/ui/Input"
import { Ionicons } from "@expo/vector-icons"

// Mock content data
const mockContent = [
  {
    id: 1,
    type: "debate",
    title: "Should AI replace human teachers in schools?",
    description: "Exploring the future of education with artificial intelligence",
    author: {
      name: "Dr. Sarah Chen",
      username: "sarahchen",
      avatar: null,
    },
    category: "Education",
    status: "active",
    reports: 0,
    createdAt: "2023-12-01T10:00:00Z",
    stats: {
      participants: 156,
      arguments: 48,
      votes: 1247,
      views: 15420,
    },
  },
  {
    id: 2,
    type: "argument",
    title: "AI can provide personalized learning experiences...",
    description: "AI can provide personalized learning experiences at scale, adapting to each student's pace...",
    author: {
      name: "TechEducator",
      username: "techeducator",
      avatar: null,
    },
    category: "Education",
    status: "reported",
    reports: 3,
    createdAt: "2023-12-02T14:30:00Z",
    stats: {
      votes: 89,
      replies: 12,
    },
    reportReasons: ["Spam", "Inappropriate content", "Misinformation"],
  },
  {
    id: 3,
    type: "debate",
    title: "Climate change is the most urgent global issue",
    description: "Discussing the priority of climate action in global politics",
    author: {
      name: "EcoWarrior",
      username: "ecowarrior",
      avatar: null,
    },
    category: "Environment",
    status: "pending",
    reports: 0,
    createdAt: "2023-12-03T09:15:00Z",
    stats: {
      participants: 0,
      arguments: 0,
      votes: 0,
      views: 45,
    },
  },
]

const ContentManagementScreen = () => {
  const { colors } = useTheme()
  const [content, setContent] = useState(mockContent)
  const [filteredContent, setFilteredContent] = useState(mockContent)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [selectedContent, setSelectedContent] = useState(null)
  const [showContentModal, setShowContentModal] = useState(false)

  const filters = [
    { key: "all", label: "All Content", count: content.length },
    { key: "active", label: "Active", count: content.filter((c) => c.status === "active").length },
    { key: "pending", label: "Pending", count: content.filter((c) => c.status === "pending").length },
    { key: "reported", label: "Reported", count: content.filter((c) => c.status === "reported").length },
    { key: "debates", label: "Debates", count: content.filter((c) => c.type === "debate").length },
    { key: "arguments", label: "Arguments", count: content.filter((c) => c.type === "argument").length },
  ]

  const onRefresh = async () => {
    setRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setRefreshing(false)
  }

  const filterContent = (query: string, filter: string) => {
    let filtered = content

    // Apply text search
    if (query) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.author.name.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase()),
      )
    }

    // Apply status/type filter
    switch (filter) {
      case "active":
        filtered = filtered.filter((item) => item.status === "active")
        break
      case "pending":
        filtered = filtered.filter((item) => item.status === "pending")
        break
      case "reported":
        filtered = filtered.filter((item) => item.status === "reported")
        break
      case "debates":
        filtered = filtered.filter((item) => item.type === "debate")
        break
      case "arguments":
        filtered = filtered.filter((item) => item.type === "argument")
        break
    }

    setFilteredContent(filtered)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    filterContent(query, selectedFilter)
  }

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter)
    filterContent(searchQuery, filter)
  }

  const handleContentAction = (item, action) => {
    setSelectedContent(item)
    switch (action) {
      case "view":
        setShowContentModal(true)
        break
      case "approve":
        handleApproveContent(item)
        break
      case "reject":
        handleRejectContent(item)
        break
      case "delete":
        handleDeleteContent(item)
        break
    }
  }

  const handleApproveContent = (item) => {
    Alert.alert("Approve Content", `Are you sure you want to approve this ${item.type}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Approve",
        onPress: () => {
          setContent(content.map((c) => (c.id === item.id ? { ...c, status: "active" } : c)))
          filterContent(searchQuery, selectedFilter)
        },
      },
    ])
  }

  const handleRejectContent = (item) => {
    Alert.alert("Reject Content", `Are you sure you want to reject this ${item.type}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reject",
        style: "destructive",
        onPress: () => {
          setContent(content.map((c) => (c.id === item.id ? { ...c, status: "rejected" } : c)))
          filterContent(searchQuery, selectedFilter)
        },
      },
    ])
  }

  const handleDeleteContent = (item) => {
    Alert.alert("Delete Content", `Are you sure you want to permanently delete this ${item.type}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setContent(content.filter((c) => c.id !== item.id))
          filterContent(searchQuery, selectedFilter)
        },
      },
    ])
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return colors.success
      case "pending":
        return colors.warning
      case "reported":
        return colors.danger
      case "rejected":
        return colors.muted
      default:
        return colors.muted
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "debate":
        return "chatbubbles"
      case "argument":
        return "chatbubble"
      default:
        return "document"
    }
  }

  const renderContentItem = ({ item }) => (
    <Card style={styles.contentCard}>
      <CardContent>
        <View style={styles.contentHeader}>
          <View style={styles.contentInfo}>
            <View style={styles.contentTypeContainer}>
              <View style={[styles.typeIcon, { backgroundColor: colors.primary + "20" }]}>
                <Ionicons name={getTypeIcon(item.type) as any} size={16} color={colors.primary} />
              </View>
              <Badge variant="secondary" style={{ marginLeft: 8 }}>
                {item.category}
              </Badge>
              <Badge
                variant="outline"
                style={{
                  borderColor: getStatusColor(item.status),
                  backgroundColor: getStatusColor(item.status) + "20",
                  marginLeft: 8,
                }}
              >
                <Text style={{ color: getStatusColor(item.status), fontSize: 12 }}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Text>
              </Badge>
              {item.reports > 0 && (
                <Badge variant="danger" style={{ marginLeft: 8 }}>
                  <Ionicons name="flag" size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
                  <Text style={{ color: "#FFFFFF", fontSize: 12 }}>{item.reports}</Text>
                </Badge>
              )}
            </View>
            <Text style={[styles.contentTitle, { color: colors.text }]} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={[styles.contentDescription, { color: colors.muted }]} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.moreButton}
            onPress={() => handleContentAction(item, "view")}
            activeOpacity={0.7}
          >
            <Ionicons name="ellipsis-vertical" size={20} color={colors.muted} />
          </TouchableOpacity>
        </View>

        <View style={styles.contentAuthor}>
          <Avatar name={item.author.name} size="sm" source={item.author.avatar} />
          <View style={styles.authorInfo}>
            <Text style={[styles.authorName, { color: colors.text }]}>{item.author.name}</Text>
            <Text style={[styles.contentDate, { color: colors.muted }]}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {item.type === "debate" && (
          <View style={styles.contentStats}>
            <View style={styles.statItem}>
              <Ionicons name="people-outline" size={14} color={colors.muted} />
              <Text style={[styles.statText, { color: colors.muted }]}>{item.stats.participants}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="chatbubble-outline" size={14} color={colors.muted} />
              <Text style={[styles.statText, { color: colors.muted }]}>{item.stats.arguments}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="thumbs-up-outline" size={14} color={colors.muted} />
              <Text style={[styles.statText, { color: colors.muted }]}>{item.stats.votes}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="eye-outline" size={14} color={colors.muted} />
              <Text style={[styles.statText, { color: colors.muted }]}>{item.stats.views}</Text>
            </View>
          </View>
        )}

        {item.type === "argument" && (
          <View style={styles.contentStats}>
            <View style={styles.statItem}>
              <Ionicons name="thumbs-up-outline" size={14} color={colors.muted} />
              <Text style={[styles.statText, { color: colors.muted }]}>{item.stats.votes}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="chatbubble-outline" size={14} color={colors.muted} />
              <Text style={[styles.statText, { color: colors.muted }]}>{item.stats.replies}</Text>
            </View>
          </View>
        )}

        {item.status === "pending" && (
          <View style={styles.contentActions}>
            <Button
              variant="primary"
              size="sm"
              style={{ flex: 1, marginRight: 8 }}
              onPress={() => handleContentAction(item, "approve")}
            >
              Approve
            </Button>
            <Button
              variant="destructive"
              size="sm"
              style={{ flex: 1 }}
              onPress={() => handleContentAction(item, "reject")}
            >
              Reject
            </Button>
          </View>
        )}

        {item.status === "reported" && (
          <View style={styles.contentActions}>
            <Button
              variant="primary"
              size="sm"
              style={{ flex: 1, marginRight: 8 }}
              onPress={() => handleContentAction(item, "approve")}
            >
              Dismiss Reports
            </Button>
            <Button
              variant="destructive"
              size="sm"
              style={{ flex: 1 }}
              onPress={() => handleContentAction(item, "delete")}
            >
              Delete
            </Button>
          </View>
        )}
      </CardContent>
    </Card>
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      {/* Search and Filters */}
      <View style={styles.header}>
        <Input
          placeholder="Search content..."
          value={searchQuery}
          onChangeText={handleSearch}
          leftIcon={<Ionicons name="search" size={20} color={colors.muted} />}
          containerStyle={{ marginBottom: 16 }}
        />

        <FlatList
          data={filters}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <Button
              variant={selectedFilter === item.key ? "primary" : "outline"}
              size="sm"
              style={{ marginRight: 8 }}
              onPress={() => handleFilterChange(item.key)}
            >
              {item.label} ({item.count})
            </Button>
          )}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      </View>

      {/* Content List */}
      <FlatList
        data={filteredContent}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderContentItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Content Detail Modal */}
      <Modal visible={showContentModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Content Details</Text>
            <TouchableOpacity onPress={() => setShowContentModal(false)} activeOpacity={0.7}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          {selectedContent && (
            <ScrollView style={styles.modalContent}>
              <Card>
                <CardHeader>
                  <View style={styles.modalContentHeader}>
                    <Badge variant="secondary" style={{ marginRight: 8 }}>
                      {selectedContent.category}
                    </Badge>
                    <Badge
                      variant="outline"
                      style={{
                        borderColor: getStatusColor(selectedContent.status),
                        backgroundColor: getStatusColor(selectedContent.status) + "20",
                      }}
                    >
                      <Text style={{ color: getStatusColor(selectedContent.status), fontSize: 12 }}>
                        {selectedContent.status.charAt(0).toUpperCase() + selectedContent.status.slice(1)}
                      </Text>
                    </Badge>
                  </View>
                  <Text style={[styles.modalContentTitle, { color: colors.text }]}>{selectedContent.title}</Text>
                </CardHeader>
                <CardContent>
                  <Text style={[styles.modalContentDescription, { color: colors.text }]}>
                    {selectedContent.description}
                  </Text>

                  <View style={styles.modalAuthor}>
                    <Avatar name={selectedContent.author.name} size="sm" source={selectedContent.author.avatar} />
                    <View style={styles.modalAuthorInfo}>
                      <Text style={[styles.modalAuthorName, { color: colors.text }]}>
                        {selectedContent.author.name}
                      </Text>
                      <Text style={[styles.modalContentDate, { color: colors.muted }]}>
                        {new Date(selectedContent.createdAt).toLocaleString()}
                      </Text>
                    </View>
                  </View>

                  {selectedContent.reportReasons && (
                    <View style={styles.reportReasons}>
                      <Text style={[styles.reportReasonsTitle, { color: colors.text }]}>Report Reasons:</Text>
                      {selectedContent.reportReasons.map((reason, index) => (
                        <Badge key={index} variant="danger" style={{ marginRight: 8, marginBottom: 8 }}>
                          <Text style={{ color: "#FFFFFF", fontSize: 12 }}>{reason}</Text>
                        </Badge>
                      ))}
                    </View>
                  )}

                  <View style={styles.modalActions}>
                    {selectedContent.status === "pending" && (
                      <>
                        <Button
                          variant="primary"
                          style={{ flex: 1, marginRight: 8 }}
                          onPress={() => {
                            handleContentAction(selectedContent, "approve")
                            setShowContentModal(false)
                          }}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          style={{ flex: 1 }}
                          onPress={() => {
                            handleContentAction(selectedContent, "reject")
                            setShowContentModal(false)
                          }}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {selectedContent.status === "reported" && (
                      <>
                        <Button
                          variant="primary"
                          style={{ flex: 1, marginRight: 8 }}
                          onPress={() => {
                            handleContentAction(selectedContent, "approve")
                            setShowContentModal(false)
                          }}
                        >
                          Dismiss Reports
                        </Button>
                        <Button
                          variant="destructive"
                          style={{ flex: 1 }}
                          onPress={() => {
                            handleContentAction(selectedContent, "delete")
                            setShowContentModal(false)
                          }}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                    {selectedContent.status === "active" && (
                      <Button
                        variant="destructive"
                        fullWidth
                        onPress={() => {
                          handleContentAction(selectedContent, "delete")
                          setShowContentModal(false)
                        }}
                      >
                        Delete Content
                      </Button>
                    )}
                  </View>
                </CardContent>
              </Card>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
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
  contentCard: {
    marginBottom: 16,
  },
  contentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  contentInfo: {
    flex: 1,
  },
  contentTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  typeIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  contentDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  moreButton: {
    padding: 4,
  },
  contentAuthor: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  authorInfo: {
    marginLeft: 8,
  },
  authorName: {
    fontSize: 14,
    fontWeight: "500",
  },
  contentDate: {
    fontSize: 12,
    marginTop: 2,
  },
  contentStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  statText: {
    fontSize: 12,
    marginLeft: 4,
  },
  contentActions: {
    flexDirection: "row",
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalContentHeader: {
    flexDirection: "row",
    marginBottom: 8,
  },
  modalContentTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalContentDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  modalAuthor: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  modalAuthorInfo: {
    marginLeft: 8,
  },
  modalAuthorName: {
    fontSize: 14,
    fontWeight: "500",
  },
  modalContentDate: {
    fontSize: 12,
    marginTop: 2,
  },
  reportReasons: {
    marginBottom: 16,
  },
  reportReasonsTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  modalActions: {
    flexDirection: "row",
    marginTop: 16,
  },
})

export default ContentManagementScreen
