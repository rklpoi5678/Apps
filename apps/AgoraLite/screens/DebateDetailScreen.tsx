"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useTheme } from "../lib/theme-provider"
import { useAuth } from "../lib/auth-context"
import { Card, CardContent } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Badge } from "../components/ui/Badge"
import { Avatar } from "../components/ui/Avatar"
import { Ionicons } from "@expo/vector-icons"

const DebateDetailScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { colors } = useTheme()
  const { user, isAuthenticated } = useAuth()
  const [refreshing, setRefreshing] = useState(false)
  const [selectedSide, setSelectedSide] = useState<"pro" | "con" | null>(null)
  const [newArgument, setNewArgument] = useState("")
  const [votes, setVotes] = useState<{ [key: number]: "up" | "down" | null }>({})

  // Mock debate data
  const mockDebate = {
    id: route.params?.debateId || 1,
    title: "Should AI replace human teachers in schools?",
    description:
      "Exploring the future of education with artificial intelligence and its impact on learning outcomes, student engagement, and the role of human connection in education.",
    category: "Education",
    author: {
      name: "Dr. Sarah Chen",
      username: "sarahchen",
      avatar: null,
      verified: true,
    },
    stats: {
      participants: 156,
      arguments: 48,
      votes: 1247,
      views: 15420,
      proVotes: 523,
      conVotes: 724,
    },
    timeAgo: "2h",
    status: "active",
    timeLeft: "2d 14h",
  }

  const mockArguments = [
    {
      id: 1,
      side: "pro",
      author: {
        name: "TechEducator",
        username: "techeducator",
        avatar: null,
      },
      content:
        "AI can provide personalized learning experiences at scale, adapting to each student's pace and learning style in ways that human teachers simply cannot match with 30+ students in a classroom.",
      votes: 89,
      replies: 12,
      timeAgo: "1h",
      userVote: null,
    },
    {
      id: 2,
      side: "con",
      author: {
        name: "HumanFirst",
        username: "humanfirst",
        avatar: null,
      },
      content:
        "Education is fundamentally about human connection, empathy, and emotional intelligence. AI lacks the ability to inspire, motivate, and provide the emotional support that students need for holistic development.",
      votes: 134,
      replies: 23,
      timeAgo: "2h",
      userVote: "up",
    },
    {
      id: 3,
      side: "pro",
      author: {
        name: "FutureLearn",
        username: "futurelearn",
        avatar: null,
      },
      content:
        "AI teachers are available 24/7, never get tired, and can instantly access the latest educational research and methodologies. They can also provide consistent quality education regardless of geographic location.",
      votes: 67,
      replies: 8,
      timeAgo: "3h",
      userVote: null,
    },
  ]

  useEffect(() => {
    // Set initial votes from mock data
    const initialVotes = {}
    mockArguments.forEach((arg) => {
      if (arg.userVote) {
        initialVotes[arg.id] = arg.userVote
      }
    })
    setVotes(initialVotes)
  }, [])

  const onRefresh = async () => {
    setRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setRefreshing(false)
  }

  const handleVote = (argumentId: number, voteType: "up" | "down") => {
    if (!isAuthenticated) {
      Alert.alert("Sign In Required", "Please sign in to vote on arguments.", [
        { text: "Cancel", style: "cancel" },
        { text: "Sign In", onPress: () => navigation.navigate("Auth") },
      ])
      return
    }

    setVotes((prev) => ({
      ...prev,
      [argumentId]: prev[argumentId] === voteType ? null : voteType,
    }))
  }

  const handleSubmitArgument = () => {
    if (!isAuthenticated) {
      Alert.alert("Sign In Required", "Please sign in to participate in debates.", [
        { text: "Cancel", style: "cancel" },
        { text: "Sign In", onPress: () => navigation.navigate("Auth") },
      ])
      return
    }

    if (!selectedSide) {
      Alert.alert("Select a Side", "Please choose whether you're arguing for or against this position.")
      return
    }

    if (!newArgument.trim()) {
      Alert.alert("Enter Argument", "Please enter your argument before submitting.")
      return
    }

    // Submit argument logic here
    Alert.alert("Argument Submitted", "Your argument has been added to the debate!")
    setNewArgument("")
    setSelectedSide(null)
  }

  const proPercentage = (mockDebate.stats.proVotes / mockDebate.stats.votes) * 100
  const conPercentage = (mockDebate.stats.conVotes / mockDebate.stats.votes) * 100

  const proArguments = mockArguments.filter((arg) => arg.side === "pro")
  const conArguments = mockArguments.filter((arg) => arg.side === "con")

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
            <View style={styles.headerTop}>
              <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
                <Ionicons name="arrow-back" size={24} color={colors.text} />
              </TouchableOpacity>
              <View style={styles.headerInfo}>
                <Badge variant="secondary" style={{ marginBottom: 4 }}>
                  {mockDebate.category}
                </Badge>
                <View style={styles.statusContainer}>
                  <Badge variant="success">
                    <Text style={{ color: "#FFFFFF", fontSize: 12 }}>Active</Text>
                  </Badge>
                  <Text style={[styles.timeLeft, { color: colors.muted }]}>
                    <Ionicons name="time-outline" size={12} color={colors.muted} /> {mockDebate.timeLeft} left
                  </Text>
                </View>
              </View>
              <TouchableOpacity activeOpacity={0.7}>
                <Ionicons name="share-outline" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.debateTitle, { color: colors.text }]}>{mockDebate.title}</Text>
            <Text style={[styles.debateDescription, { color: colors.muted }]}>{mockDebate.description}</Text>

            <View style={styles.authorContainer}>
              <Avatar name={mockDebate.author.name} size="sm" source={mockDebate.author.avatar} />
              <View style={styles.authorInfo}>
                <View style={styles.authorNameContainer}>
                  <Text style={[styles.authorName, { color: colors.text }]}>{mockDebate.author.name}</Text>
                  {mockDebate.author.verified && (
                    <Ionicons name="checkmark-circle" size={16} color={colors.primary} style={{ marginLeft: 4 }} />
                  )}
                </View>
                <Text style={[styles.timeAgo, { color: colors.muted }]}>{mockDebate.timeAgo}</Text>
              </View>
            </View>
          </View>

          {/* Voting Progress */}
          <Card style={styles.votingCard}>
            <CardContent>
              <View style={styles.votingHeader}>
                <Text style={[styles.votingTitle, { color: colors.text }]}>Community Vote</Text>
                <Text style={[styles.totalVotes, { color: colors.muted }]}>
                  {mockDebate.stats.votes.toLocaleString()} votes
                </Text>
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressLabels}>
                  <Text style={[styles.progressLabel, { color: colors.success }]}>
                    PRO ({mockDebate.stats.proVotes})
                  </Text>
                  <Text style={[styles.progressLabel, { color: colors.danger }]}>
                    CON ({mockDebate.stats.conVotes})
                  </Text>
                </View>
                <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                  <View
                    style={[styles.progressFill, { backgroundColor: colors.success, width: `${proPercentage}%` }]}
                  />
                  <View
                    style={[
                      styles.progressFill,
                      { backgroundColor: colors.danger, width: `${conPercentage}%`, position: "absolute", right: 0 },
                    ]}
                  />
                </View>
                <View style={styles.progressPercentages}>
                  <Text style={[styles.progressPercentage, { color: colors.success }]}>
                    {Math.round(proPercentage)}%
                  </Text>
                  <Text style={[styles.progressPercentage, { color: colors.danger }]}>
                    {Math.round(conPercentage)}%
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* Pro Arguments */}
          <View style={styles.argumentsSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <View style={[styles.sideIndicator, { backgroundColor: colors.success }]} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>PRO Arguments</Text>
                <Badge variant="outline" style={{ marginLeft: 8 }}>
                  <Text style={{ color: colors.success, fontSize: 12 }}>{proArguments.length}</Text>
                </Badge>
              </View>
            </View>

            {proArguments.map((argument) => (
              <Card key={argument.id} style={[styles.argumentCard, { borderLeftColor: colors.success }]}>
                <CardContent>
                  <View style={styles.argumentHeader}>
                    <Avatar name={argument.author.name} size="sm" source={argument.author.avatar} />
                    <View style={styles.argumentAuthorInfo}>
                      <Text style={[styles.argumentAuthor, { color: colors.text }]}>{argument.author.name}</Text>
                      <Text style={[styles.argumentTime, { color: colors.muted }]}>{argument.timeAgo}</Text>
                    </View>
                  </View>

                  <Text style={[styles.argumentContent, { color: colors.text }]}>{argument.content}</Text>

                  <View style={styles.argumentActions}>
                    <View style={styles.voteButtons}>
                      <TouchableOpacity
                        style={[
                          styles.voteButton,
                          votes[argument.id] === "up" && { backgroundColor: colors.success + "20" },
                        ]}
                        onPress={() => handleVote(argument.id, "up")}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name="thumbs-up"
                          size={16}
                          color={votes[argument.id] === "up" ? colors.success : colors.muted}
                        />
                        <Text
                          style={[
                            styles.voteCount,
                            { color: votes[argument.id] === "up" ? colors.success : colors.muted },
                          ]}
                        >
                          {argument.votes}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.voteButton,
                          votes[argument.id] === "down" && { backgroundColor: colors.danger + "20" },
                        ]}
                        onPress={() => handleVote(argument.id, "down")}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name="thumbs-down"
                          size={16}
                          color={votes[argument.id] === "down" ? colors.danger : colors.muted}
                        />
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.replyButton} activeOpacity={0.7}>
                      <Ionicons name="chatbubble-outline" size={16} color={colors.muted} />
                      <Text style={[styles.replyText, { color: colors.muted }]}>{argument.replies} replies</Text>
                    </TouchableOpacity>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>

          {/* Con Arguments */}
          <View style={styles.argumentsSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <View style={[styles.sideIndicator, { backgroundColor: colors.danger }]} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>CON Arguments</Text>
                <Badge variant="outline" style={{ marginLeft: 8 }}>
                  <Text style={{ color: colors.danger, fontSize: 12 }}>{conArguments.length}</Text>
                </Badge>
              </View>
            </View>

            {conArguments.map((argument) => (
              <Card key={argument.id} style={[styles.argumentCard, { borderLeftColor: colors.danger }]}>
                <CardContent>
                  <View style={styles.argumentHeader}>
                    <Avatar name={argument.author.name} size="sm" source={argument.author.avatar} />
                    <View style={styles.argumentAuthorInfo}>
                      <Text style={[styles.argumentAuthor, { color: colors.text }]}>{argument.author.name}</Text>
                      <Text style={[styles.argumentTime, { color: colors.muted }]}>{argument.timeAgo}</Text>
                    </View>
                  </View>

                  <Text style={[styles.argumentContent, { color: colors.text }]}>{argument.content}</Text>

                  <View style={styles.argumentActions}>
                    <View style={styles.voteButtons}>
                      <TouchableOpacity
                        style={[
                          styles.voteButton,
                          votes[argument.id] === "up" && { backgroundColor: colors.success + "20" },
                        ]}
                        onPress={() => handleVote(argument.id, "up")}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name="thumbs-up"
                          size={16}
                          color={votes[argument.id] === "up" ? colors.success : colors.muted}
                        />
                        <Text
                          style={[
                            styles.voteCount,
                            { color: votes[argument.id] === "up" ? colors.success : colors.muted },
                          ]}
                        >
                          {argument.votes}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.voteButton,
                          votes[argument.id] === "down" && { backgroundColor: colors.danger + "20" },
                        ]}
                        onPress={() => handleVote(argument.id, "down")}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name="thumbs-down"
                          size={16}
                          color={votes[argument.id] === "down" ? colors.danger : colors.muted}
                        />
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.replyButton} activeOpacity={0.7}>
                      <Ionicons name="chatbubble-outline" size={16} color={colors.muted} />
                      <Text style={[styles.replyText, { color: colors.muted }]}>{argument.replies} replies</Text>
                    </TouchableOpacity>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>

          {/* Add Argument */}
          {isAuthenticated && (
            <Card
              style={[styles.addArgumentCard, { borderColor: colors.primary, borderWidth: 2, borderStyle: "dashed" }]}
            >
              <CardContent>
                <Text style={[styles.addArgumentTitle, { color: colors.text }]}>Add Your Voice</Text>

                <View style={styles.sideSelection}>
                  <TouchableOpacity
                    style={[
                      styles.sideButton,
                      selectedSide === "pro" && { backgroundColor: colors.success + "20", borderColor: colors.success },
                    ]}
                    onPress={() => setSelectedSide("pro")}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[styles.sideButtonText, { color: selectedSide === "pro" ? colors.success : colors.text }]}
                    >
                      PRO Side
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.sideButton,
                      selectedSide === "con" && { backgroundColor: colors.danger + "20", borderColor: colors.danger },
                    ]}
                    onPress={() => setSelectedSide("con")}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[styles.sideButtonText, { color: selectedSide === "con" ? colors.danger : colors.text }]}
                    >
                      CON Side
                    </Text>
                  </TouchableOpacity>
                </View>

                <TextInput
                  style={[
                    styles.argumentInput,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  placeholder="Share your argument... Be respectful and provide evidence to support your position."
                  placeholderTextColor={colors.muted}
                  value={newArgument}
                  onChangeText={setNewArgument}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />

                <Button
                  variant="primary"
                  fullWidth
                  onPress={handleSubmitArgument}
                  disabled={!selectedSide || !newArgument.trim()}
                  style={{ marginTop: 16 }}
                  leftIcon={<Ionicons name="send" size={16} color="#FFFFFF" />}
                >
                  Submit Argument
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Bottom padding */}
          <View style={{ height: 80 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerInfo: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 16,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timeLeft: {
    fontSize: 12,
  },
  debateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    lineHeight: 28,
  },
  debateDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  authorInfo: {
    marginLeft: 12,
  },
  authorNameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  authorName: {
    fontSize: 14,
    fontWeight: "500",
  },
  timeAgo: {
    fontSize: 12,
    marginTop: 2,
  },
  votingCard: {
    margin: 16,
    marginBottom: 8,
  },
  votingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  votingTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  totalVotes: {
    fontSize: 14,
  },
  progressContainer: {
    gap: 8,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    position: "relative",
  },
  progressFill: {
    height: "100%",
  },
  progressPercentages: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: "500",
  },
  argumentsSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sideIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  argumentCard: {
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  argumentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  argumentAuthorInfo: {
    marginLeft: 8,
  },
  argumentAuthor: {
    fontSize: 14,
    fontWeight: "500",
  },
  argumentTime: {
    fontSize: 12,
    marginTop: 2,
  },
  argumentContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  argumentActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  voteButtons: {
    flexDirection: "row",
    gap: 8,
  },
  voteButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  voteCount: {
    fontSize: 12,
    fontWeight: "500",
  },
  replyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  replyText: {
    fontSize: 12,
  },
  addArgumentCard: {
    margin: 16,
    marginTop: 8,
  },
  addArgumentTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  sideSelection: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  sideButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "transparent",
    alignItems: "center",
  },
  sideButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  argumentInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 100,
  },
})

export default DebateDetailScreen
