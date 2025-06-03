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
  TextInput,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "../../lib/theme-provider"
import { Card, CardContent } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Badge } from "../../components/ui/Badge"
import { Avatar } from "../../components/ui/Avatar"
import { Input } from "../../components/ui/Input"
import { Ionicons } from "@expo/vector-icons"

// Mock user data
const mockUsers = [
  {
    id: 1,
    username: "sarahchen",
    displayName: "Dr. Sarah Chen",
    email: "sarah.chen@email.com",
    role: "expert",
    status: "active",
    verified: true,
    joinDate: "2023-01-15",
    lastActive: "2 hours ago",
    stats: {
      debates: 89,
      wins: 67,
      reputation: 15420,
    },
    avatar: null,
  },
  {
    id: 2,
    username: "marcusj",
    displayName: "Marcus Johnson",
    email: "marcus.j@email.com",
    role: "user",
    status: "active",
    verified: false,
    joinDate: "2023-02-20",
    lastActive: "1 day ago",
    stats: {
      debates: 76,
      wins: 54,
      reputation: 12890,
    },
    avatar: null,
  },
  {
    id: 3,
    username: "spammer123",
    displayName: "Spam Account",
    email: "spam@fake.com",
    role: "user",
    status: "suspended",
    verified: false,
    joinDate: "2023-03-10",
    lastActive: "1 week ago",
    stats: {
      debates: 2,
      wins: 0,
      reputation: -50,
    },
    avatar: null,
  },
]

const UserManagementScreen = () => {
  const { colors } = useTheme()
  const [users, setUsers] = useState(mockUsers)
  const [filteredUsers, setFilteredUsers] = useState(mockUsers)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showBanModal, setShowBanModal] = useState(false)
  const [banReason, setBanReason] = useState("")

  const filters = [
    { key: "all", label: "All Users", count: users.length },
    { key: "active", label: "Active", count: users.filter((u) => u.status === "active").length },
    { key: "suspended", label: "Suspended", count: users.filter((u) => u.status === "suspended").length },
    { key: "verified", label: "Verified", count: users.filter((u) => u.verified).length },
    { key: "experts", label: "Experts", count: users.filter((u) => u.role === "expert").length },
  ]

  const onRefresh = async () => {
    setRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setRefreshing(false)
  }

  const filterUsers = (query: string, filter: string) => {
    let filtered = users

    // Apply text search
    if (query) {
      filtered = filtered.filter(
        (user) =>
          user.username.toLowerCase().includes(query.toLowerCase()) ||
          user.displayName.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase()),
      )
    }

    // Apply status filter
    switch (filter) {
      case "active":
        filtered = filtered.filter((user) => user.status === "active")
        break
      case "suspended":
        filtered = filtered.filter((user) => user.status === "suspended")
        break
      case "verified":
        filtered = filtered.filter((user) => user.verified)
        break
      case "experts":
        filtered = filtered.filter((user) => user.role === "expert")
        break
    }

    setFilteredUsers(filtered)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    filterUsers(query, selectedFilter)
  }

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter)
    filterUsers(searchQuery, filter)
  }

  const handleUserAction = (user, action) => {
    setSelectedUser(user)
    switch (action) {
      case "view":
        setShowUserModal(true)
        break
      case "ban":
        setShowBanModal(true)
        break
      case "verify":
        handleVerifyUser(user)
        break
      case "promote":
        handlePromoteUser(user)
        break
    }
  }

  const handleVerifyUser = (user) => {
    Alert.alert(
      "Verify User",
      `Are you sure you want to ${user.verified ? "unverify" : "verify"} ${user.displayName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: user.verified ? "Unverify" : "Verify",
          onPress: () => {
            setUsers(users.map((u) => (u.id === user.id ? { ...u, verified: !u.verified } : u)))
            filterUsers(searchQuery, selectedFilter)
          },
        },
      ],
    )
  }

  const handlePromoteUser = (user) => {
    const newRole = user.role === "expert" ? "user" : "expert"
    Alert.alert(
      "Change Role",
      `Are you sure you want to ${newRole === "expert" ? "promote" : "demote"} ${user.displayName} to ${newRole}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            setUsers(users.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)))
            filterUsers(searchQuery, selectedFilter)
          },
        },
      ],
    )
  }

  const handleBanUser = () => {
    if (!banReason.trim()) {
      Alert.alert("Error", "Please provide a reason for the ban.")
      return
    }

    const newStatus = selectedUser.status === "suspended" ? "active" : "suspended"
    setUsers(users.map((u) => (u.id === selectedUser.id ? { ...u, status: newStatus } : u)))
    filterUsers(searchQuery, selectedFilter)
    setShowBanModal(false)
    setBanReason("")
    setSelectedUser(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return colors.success
      case "suspended":
        return colors.danger
      default:
        return colors.muted
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "expert":
        return colors.primary
      case "admin":
        return colors.danger
      default:
        return colors.muted
    }
  }

  const renderUserItem = ({ item: user }) => (
    <Card style={styles.userCard}>
      <CardContent>
        <View style={styles.userHeader}>
          <View style={styles.userInfo}>
            <Avatar name={user.displayName} size="lg" source={user.avatar} />
            <View style={styles.userDetails}>
              <View style={styles.userNameContainer}>
                <Text style={[styles.userName, { color: colors.text }]}>{user.displayName}</Text>
                {user.verified && (
                  <Ionicons name="checkmark-circle" size={16} color={colors.primary} style={{ marginLeft: 4 }} />
                )}
              </View>
              <Text style={[styles.userUsername, { color: colors.muted }]}>@{user.username}</Text>
              <Text style={[styles.userEmail, { color: colors.muted }]}>{user.email}</Text>
              <View style={styles.userBadges}>
                <Badge
                  variant="outline"
                  style={{
                    borderColor: getStatusColor(user.status),
                    backgroundColor: getStatusColor(user.status) + "20",
                  }}
                >
                  <Text style={{ color: getStatusColor(user.status), fontSize: 12 }}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </Text>
                </Badge>
                <Badge
                  variant="outline"
                  style={{
                    borderColor: getRoleColor(user.role),
                    backgroundColor: getRoleColor(user.role) + "20",
                    marginLeft: 8,
                  }}
                >
                  <Text style={{ color: getRoleColor(user.role), fontSize: 12 }}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Text>
                </Badge>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.moreButton}
            onPress={() => handleUserAction(user, "view")}
            activeOpacity={0.7}
          >
            <Ionicons name="ellipsis-vertical" size={20} color={colors.muted} />
          </TouchableOpacity>
        </View>

        <View style={styles.userStats}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>{user.stats.debates}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>Debates</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>{user.stats.wins}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>Wins</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>{user.stats.reputation}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>Reputation</Text>
          </View>
        </View>

        <View style={styles.userFooter}>
          <Text style={[styles.userJoinDate, { color: colors.muted }]}>
            Joined {new Date(user.joinDate).toLocaleDateString()}
          </Text>
          <Text style={[styles.userLastActive, { color: colors.muted }]}>Active {user.lastActive}</Text>
        </View>

        <View style={styles.userActions}>
          <Button
            variant="outline"
            size="sm"
            style={{ flex: 1, marginRight: 8 }}
            onPress={() => handleUserAction(user, "verify")}
          >
            {user.verified ? "Unverify" : "Verify"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            style={{ flex: 1, marginRight: 8 }}
            onPress={() => handleUserAction(user, "promote")}
          >
            {user.role === "expert" ? "Demote" : "Promote"}
          </Button>
          <Button
            variant={user.status === "suspended" ? "primary" : "destructive"}
            size="sm"
            style={{ flex: 1 }}
            onPress={() => handleUserAction(user, "ban")}
          >
            {user.status === "suspended" ? "Unban" : "Ban"}
          </Button>
        </View>
      </CardContent>
    </Card>
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      {/* Search and Filters */}
      <View style={styles.header}>
        <Input
          placeholder="Search users..."
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

      {/* Users List */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderUserItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />

      {/* User Detail Modal */}
      <Modal visible={showUserModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>User Details</Text>
            <TouchableOpacity onPress={() => setShowUserModal(false)} activeOpacity={0.7}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          {selectedUser && (
            <View style={styles.modalContent}>
              <Text style={[styles.modalUserName, { color: colors.text }]}>{selectedUser.displayName}</Text>
              <Text style={[styles.modalUserEmail, { color: colors.muted }]}>{selectedUser.email}</Text>
              {/* Add more user details here */}
            </View>
          )}
        </SafeAreaView>
      </Modal>

      {/* Ban Modal */}
      <Modal visible={showBanModal} animationType="fade" transparent>
        <View style={styles.banModalOverlay}>
          <View style={[styles.banModalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.banModalTitle, { color: colors.text }]}>
              {selectedUser?.status === "suspended" ? "Unban User" : "Ban User"}
            </Text>
            <Text style={[styles.banModalDescription, { color: colors.muted }]}>
              {selectedUser?.status === "suspended"
                ? `Are you sure you want to unban ${selectedUser?.displayName}?`
                : `Please provide a reason for banning ${selectedUser?.displayName}:`}
            </Text>
            {selectedUser?.status !== "suspended" && (
              <TextInput
                style={[
                  styles.banReasonInput,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                placeholder="Enter ban reason..."
                placeholderTextColor={colors.muted}
                value={banReason}
                onChangeText={setBanReason}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            )}
            <View style={styles.banModalActions}>
              <Button
                variant="outline"
                style={{ flex: 1, marginRight: 8 }}
                onPress={() => {
                  setShowBanModal(false)
                  setBanReason("")
                  setSelectedUser(null)
                }}
              >
                Cancel
              </Button>
              <Button
                variant={selectedUser?.status === "suspended" ? "primary" : "destructive"}
                style={{ flex: 1 }}
                onPress={handleBanUser}
              >
                {selectedUser?.status === "suspended" ? "Unban" : "Ban"}
              </Button>
            </View>
          </View>
        </View>
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
  userCard: {
    marginBottom: 16,
  },
  userHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: "row",
    flex: 1,
  },
  userDetails: {
    marginLeft: 12,
    flex: 1,
  },
  userNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
  },
  userUsername: {
    fontSize: 14,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    marginBottom: 8,
  },
  userBadges: {
    flexDirection: "row",
  },
  moreButton: {
    padding: 4,
  },
  userStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  userFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  userJoinDate: {
    fontSize: 12,
  },
  userLastActive: {
    fontSize: 12,
  },
  userActions: {
    flexDirection: "row",
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
    padding: 16,
  },
  modalUserName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  modalUserEmail: {
    fontSize: 14,
  },
  banModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  banModalContent: {
    borderRadius: 12,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  banModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  banModalDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  banReasonInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    marginBottom: 16,
  },
  banModalActions: {
    flexDirection: "row",
  },
})

export default UserManagementScreen
