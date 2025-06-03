"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { useTheme } from "../../lib/theme-provider"
import { Card, CardContent, CardHeader } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Badge } from "../../components/ui/Badge"
import { Ionicons } from "@expo/vector-icons"
import { LineChart, BarChart } from "react-native-chart-kit"

const AdminDashboardScreen = () => {
  const navigation = useNavigation()
  const { colors } = useTheme()
  const [refreshing, setRefreshing] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState("7d")

  // Mock analytics data
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 12547,
    activeDebates: 342,
    totalDebates: 1856,
    moderationQueue: 23,
    reportedContent: 8,
    userGrowth: 15.3,
    engagementRate: 68.7,
    averageDebateLength: "4.2d",
  })

  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [120, 145, 180, 165, 190, 210, 185],
        color: (opacity = 1) => colors.primary,
        strokeWidth: 2,
      },
    ],
  }

  const barChartData = {
    labels: ["Debates", "Users", "Reports", "Votes"],
    datasets: [
      {
        data: [342, 1247, 23, 8945],
      },
    ],
  }

  const onRefresh = async () => {
    setRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setRefreshing(false)
  }

  const quickActions = [
    {
      title: "User Management",
      description: "Manage users, roles, and permissions",
      icon: "people",
      color: colors.primary,
      onPress: () => navigation.navigate("UserManagement"),
    },
    {
      title: "Content Management",
      description: "Review and moderate debates",
      icon: "document-text",
      color: colors.secondary,
      onPress: () => navigation.navigate("ContentManagement"),
    },
    {
      title: "Moderation Queue",
      description: `${dashboardData.moderationQueue} items pending`,
      icon: "flag",
      color: colors.warning,
      badge: dashboardData.moderationQueue,
      onPress: () => console.log("Moderation queue"),
    },
    {
      title: "Reports",
      description: `${dashboardData.reportedContent} reports to review`,
      icon: "alert-circle",
      color: colors.danger,
      badge: dashboardData.reportedContent,
      onPress: () => console.log("Reports"),
    },
  ]

  const statsCards = [
    {
      title: "Total Users",
      value: dashboardData.totalUsers.toLocaleString(),
      change: `+${dashboardData.userGrowth}%`,
      changeType: "positive",
      icon: "people",
    },
    {
      title: "Active Debates",
      value: dashboardData.activeDebates.toString(),
      change: "+12",
      changeType: "positive",
      icon: "chatbubbles",
    },
    {
      title: "Engagement Rate",
      value: `${dashboardData.engagementRate}%`,
      change: "+2.3%",
      changeType: "positive",
      icon: "trending-up",
    },
    {
      title: "Avg. Debate Length",
      value: dashboardData.averageDebateLength,
      change: "-0.5d",
      changeType: "negative",
      icon: "time",
    },
  ]

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Admin Dashboard</Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>Monitor and manage your platform</Text>
          </View>
          <TouchableOpacity style={[styles.notificationButton, { backgroundColor: colors.card }]} activeOpacity={0.7}>
            <Ionicons name="notifications" size={20} color={colors.text} />
            <View style={[styles.notificationBadge, { backgroundColor: colors.danger }]}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {["24h", "7d", "30d", "90d"].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "primary" : "outline"}
              size="sm"
              style={{ marginRight: 8 }}
              onPress={() => setSelectedPeriod(period)}
            >
              {period}
            </Button>
          ))}
        </View>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          {statsCards.map((stat, index) => (
            <Card key={index} style={styles.statsCard}>
              <CardContent>
                <View style={styles.statsCardHeader}>
                  <View style={[styles.statsIcon, { backgroundColor: colors.primary + "20" }]}>
                    <Ionicons name={stat.icon as any} size={20} color={colors.primary} />
                  </View>
                  <View style={styles.statsChange}>
                    <Text
                      style={[
                        styles.statsChangeText,
                        { color: stat.changeType === "positive" ? colors.success : colors.danger },
                      ]}
                    >
                      {stat.change}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.statsValue, { color: colors.text }]}>{stat.value}</Text>
                <Text style={[styles.statsTitle, { color: colors.muted }]}>{stat.title}</Text>
              </CardContent>
            </Card>
          ))}
        </View>

        {/* Charts */}
        <Card style={styles.chartCard}>
          <CardHeader>
            <Text style={[styles.chartTitle, { color: colors.text }]}>User Activity</Text>
          </CardHeader>
          <CardContent>
            <LineChart
              data={chartData}
              width={Dimensions.get("window").width - 64}
              height={200}
              chartConfig={{
                backgroundColor: colors.background,
                backgroundGradientFrom: colors.background,
                backgroundGradientTo: colors.background,
                decimalPlaces: 0,
                color: (opacity = 1) => colors.primary,
                labelColor: (opacity = 1) => colors.text,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "4",
                  strokeWidth: "2",
                  stroke: colors.primary,
                },
              }}
              bezier
              style={styles.chart}
            />
          </CardContent>
        </Card>

        <Card style={styles.chartCard}>
          <CardHeader>
            <Text style={[styles.chartTitle, { color: colors.text }]}>Platform Overview</Text>
          </CardHeader>
          <CardContent>
            <BarChart
              data={barChartData}
              width={Dimensions.get("window").width - 64}
              height={200}
              chartConfig={{
                backgroundColor: colors.background,
                backgroundGradientFrom: colors.background,
                backgroundGradientTo: colors.background,
                decimalPlaces: 0,
                color: (opacity = 1) => colors.primary,
                labelColor: (opacity = 1) => colors.text,
                barPercentage: 0.7,
              }}
              style={styles.chart}
            />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity key={index} onPress={action.onPress} activeOpacity={0.7}>
                <Card style={styles.quickActionCard}>
                  <CardContent>
                    <View style={styles.quickActionHeader}>
                      <View style={[styles.quickActionIcon, { backgroundColor: action.color + "20" }]}>
                        <Ionicons name={action.icon as any} size={24} color={action.color} />
                      </View>
                      {action.badge && (
                        <Badge variant="danger" style={styles.quickActionBadge}>
                          <Text style={{ color: "#FFFFFF", fontSize: 12 }}>{action.badge}</Text>
                        </Badge>
                      )}
                    </View>
                    <Text style={[styles.quickActionTitle, { color: colors.text }]}>{action.title}</Text>
                    <Text style={[styles.quickActionDescription, { color: colors.muted }]}>{action.description}</Text>
                  </CardContent>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <Card style={styles.activityCard}>
          <CardHeader>
            <View style={styles.activityHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
              </TouchableOpacity>
            </View>
          </CardHeader>
          <CardContent>
            {[
              {
                type: "user_registered",
                message: "New user registered: @johndoe",
                time: "2 minutes ago",
                icon: "person-add",
                color: colors.success,
              },
              {
                type: "debate_created",
                message: "New debate: 'AI in Healthcare'",
                time: "15 minutes ago",
                icon: "chatbubble",
                color: colors.primary,
              },
              {
                type: "content_reported",
                message: "Content reported for review",
                time: "1 hour ago",
                icon: "flag",
                color: colors.warning,
              },
              {
                type: "user_banned",
                message: "User banned for violations",
                time: "2 hours ago",
                icon: "ban",
                color: colors.danger,
              },
            ].map((activity, index) => (
              <View key={index} style={styles.activityItem}>
                <View style={[styles.activityIcon, { backgroundColor: activity.color + "20" }]}>
                  <Ionicons name={activity.icon as any} size={16} color={activity.color} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={[styles.activityMessage, { color: colors.text }]}>{activity.message}</Text>
                  <Text style={[styles.activityTime, { color: colors.muted }]}>{activity.time}</Text>
                </View>
              </View>
            ))}
          </CardContent>
        </Card>

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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  periodSelector: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  statsCard: {
    width: "48%",
    margin: 8,
  },
  statsCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  statsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  statsChange: {
    alignItems: "flex-end",
  },
  statsChangeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statsValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statsTitle: {
    fontSize: 12,
  },
  chartCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  chart: {
    borderRadius: 16,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -8,
  },
  quickActionCard: {
    width: "48%",
    margin: 8,
  },
  quickActionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  quickActionBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  quickActionDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  activityCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "500",
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityMessage: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
  },
})

export default AdminDashboardScreen
