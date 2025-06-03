"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { useTheme } from "@/lib/theme-provider"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Avatar } from "@/components/ui/Avatar"
import { Ionicons } from "@expo/vector-icons"

const ProfileScreen = () => {
  const navigation = useNavigation()
  const { colors, isDark, toggleTheme } = useTheme()
  const { user, logout, isAuthenticated } = useAuth()
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setRefreshing(false)
  }

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => {
          logout()
          navigation.replace("Auth")
        },
      },
    ])
  }

  const handleEditProfile = () => {
    // Navigate to edit profile screen
    console.log("Edit profile")
  }

  const handleSettings = () => {
    // Navigate to settings screen
    console.log("Settings")
  }

  if (!isAuthenticated || !user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
        <View style={styles.unauthenticatedContainer}>
          <Ionicons name="person-circle-outline" size={80} color={colors.muted} />
          <Text style={[styles.unauthenticatedTitle, { color: colors.text }]}>Sign in to view your profile</Text>
          <Text style={[styles.unauthenticatedDescription, { color: colors.muted }]}>
            Join the community to track your debates, earn badges, and connect with other debaters.
          </Text>
          <Button variant="primary" style={{ marginTop: 24 }} onPress={() => navigation.navigate("Auth")}>
            Sign In
          </Button>
        </View>
      </SafeAreaView>
    )
  }

  const mockStats = {
    debates: 42,
    wins: 28,
    winRate: 66.7,
    points: 8420,
    rank: 15,
    followers: 234,
    following: 89,
  }

  const mockBadges = [
    { id: 1, name: "First Debate", icon: "trophy", color: "#FFD700" },
    { id: 2, name: "Persuasive", icon: "chatbubble", color: "#3B82F6" },
    { id: 3, name: "Top Voter", icon: "thumbs-up", color: "#10B981" },
    { id: 4, name: "Rising Star", icon: "star", color: "#F59E0B" },
  ]

  const mockRecentDebates = [
    {
      id: 1,
      title: "Remote work is more productive than office work",
      result: "won",
      votes: 156,
      timeAgo: "2 days ago",
    },
    {
      id: 2,
      title: "AI will replace most creative jobs within 10 years",
      result: "lost",
      votes: 89,
      timeAgo: "1 week ago",
    },
    {
      id: 3,
      title: "Social media has a net negative impact on society",
      result: "won",
      votes: 234,
      timeAgo: "2 weeks ago",
    },
  ]

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <View style={styles.headerContent}>
            <Avatar name={user.displayName} size="xl" source={user.avatar} />
            <View style={styles.userInfo}>
              <View style={styles.nameContainer}>
                <Text style={styles.displayName}>{user.displayName}</Text>
                {user.isVerified && (
                  <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
                )}
              </View>
              <Text style={styles.username}>@{user.username}</Text>
              <Text style={styles.bio}>{user.profile?.bio || "Passionate debater and critical thinker"}</Text>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile} activeOpacity={0.7}>
              <Ionicons name="create-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{mockStats.debates}</Text>
              <Text style={styles.statLabel}>Debates</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{mockStats.winRate}%</Text>
              <Text style={styles.statLabel}>Win Rate</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>#{mockStats.rank}</Text>
              <Text style={styles.statLabel}>Rank</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{mockStats.points}</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
          </View>
        </View>

        {/* Badges */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Achievements</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgesContainer}>
            {mockBadges.map((badge) => (
              <Card key={badge.id} style={styles.badgeCard}>
                <CardContent style={styles.badgeContent}>
                  <View style={[styles.badgeIcon, { backgroundColor: badge.color + "20" }]}>
                    <Ionicons name={badge.icon as any} size={24} color={badge.color} />
                  </View>
                  <Text style={[styles.badgeName, { color: colors.text }]}>{badge.name}</Text>
                </CardContent>
              </Card>
            ))}
          </ScrollView>
        </View>

        {/* Recent Debates */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Debates</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          {mockRecentDebates.map((debate) => (
            <Card key={debate.id} style={styles.debateCard}>
              <CardContent>
                <View style={styles.debateContent}>
                  <View style={styles.debateInfo}>
                    <Text style={[styles.debateTitle, { color: colors.text }]} numberOfLines={2}>
                      {debate.title}
                    </Text>
                    <View style={styles.debateFooter}>
                      <Badge variant={debate.result === "won" ? "success" : "danger"} style={{ marginRight: 8 }}>
                        {debate.result === "won" ? "Won" : "Lost"}
                      </Badge>
                      <Text style={[styles.debateVotes, { color: colors.muted }]}>
                        {debate.votes} votes • {debate.timeAgo}
                      </Text>
                    </View>
                  </View>
                  <Ionicons
                    name={debate.result === "won" ? "trophy" : "close-circle"}
                    size={24}
                    color={debate.result === "won" ? colors.success : colors.danger}
                  />
                </View>
              </CardContent>
            </Card>
          ))}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>

          <Card style={styles.settingsCard}>
            <CardContent>
              <TouchableOpacity style={styles.settingItem} onPress={toggleTheme} activeOpacity={0.7}>
                <View style={styles.settingLeft}>
                  <Ionicons name={isDark ? "moon" : "sunny"} size={20} color={colors.text} />
                  <Text style={[styles.settingText, { color: colors.text }]}>
                    {isDark ? "Dark Mode" : "Light Mode"}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.muted} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem} onPress={handleSettings} activeOpacity={0.7}>
                <View style={styles.settingLeft}>
                  <Ionicons name="settings-outline" size={20} color={colors.text} />
                  <Text style={[styles.settingText, { color: colors.text }]}>Preferences</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.muted} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
                <View style={styles.settingLeft}>
                  <Ionicons name="notifications-outline" size={20} color={colors.text} />
                  <Text style={[styles.settingText, { color: colors.text }]}>Notifications</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.muted} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
                <View style={styles.settingLeft}>
                  <Ionicons name="help-circle-outline" size={20} color={colors.text} />
                  <Text style={[styles.settingText, { color: colors.text }]}>Help & Support</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.muted} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.settingItem, styles.logoutItem]}
                onPress={handleLogout}
                activeOpacity={0.7}
              >
                <View style={styles.settingLeft}>
                  <Ionicons name="log-out-outline" size={20} color={colors.danger} />
                  <Text style={[styles.settingText, { color: colors.danger }]}>Sign Out</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.muted} />
              </TouchableOpacity>
            </CardContent>
          </Card>
        </View>

        {/* Bottom padding */}
        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  unauthenticatedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  unauthenticatedTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  unauthenticatedDescription: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  header: {
    padding: 24,
    paddingBottom: 32,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  displayName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  username: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 20,
  },
  editButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "500",
  },
  badgesContainer: {
    paddingVertical: 8,
  },
  badgeCard: {
    width: 100,
    marginRight: 12,
  },
  badgeContent: {
    alignItems: "center",
    padding: 12,
  },
  badgeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  debateCard: {
    marginBottom: 12,
  },
  debateContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  debateInfo: {
    flex: 1,
  },
  debateTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    lineHeight: 20,
  },
  debateFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  debateVotes: {
    fontSize: 12,
  },
  settingsCard: {
    marginTop: 8,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
})

export default ProfileScreen
