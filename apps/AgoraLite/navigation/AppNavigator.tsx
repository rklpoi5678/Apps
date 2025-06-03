"use client"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { useAuth } from "@/lib/auth-context"
import { useTheme } from "@/lib/theme-provider"
import { Ionicons } from "@expo/vector-icons"

// Screens
import HomeScreen from "@/screens/HomeScreen"
import DebateScreen from "@/screens/DebateScreen"
import LeaderboardScreen from "@/screens/LeaderboardScreen"
import ProfileScreen from "@/screens/ProfileScreen"
import DebateDetailScreen from "@/screens/DebateDetailScreen"
import CreateDebateScreen from "@/screens/CreateDebateScreen"
import AuthScreen from "@/screens/AuthScreen"
import AdminDashboardScreen from "@/screens/admin/AdminDashboardScreen"
import UserManagementScreen from "@/screens/admin/UserManagementScreen"
import ContentManagementScreen from "@/screens/admin/ContentManagementScreen"

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()
const AdminStack = createStackNavigator()

// Admin navigation stack
function AdminNavigator() {
  return (
    <AdminStack.Navigator>
      <AdminStack.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{ title: "Admin Dashboard" }}
      />
      <AdminStack.Screen
        name="UserManagement"
        component={UserManagementScreen}
        options={{ title: "User Management" }}
      />
      <AdminStack.Screen
        name="ContentManagement"
        component={ContentManagementScreen}
        options={{ title: "Content Management" }}
      />
    </AdminStack.Navigator>
  )
}

// Main tab navigation
function MainTabNavigator() {
  const { colors } = useTheme()

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "Debates") {
            iconName = focused ? "chatbubbles" : "chatbubbles-outline"
          } else if (route.name === "Leaderboard") {
            iconName = focused ? "trophy" : "trophy-outline"
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline"
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Debates" component={DebateScreen} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}

// Root navigation with authentication handling
export default function AppNavigator() {
  const { isAuthenticated, user } = useAuth()
  const isAdmin = user?.role === "admin"

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          // Auth screens
          <Stack.Screen name="Auth" component={AuthScreen} options={{ animationTypeForReplace: "pop" }} />
        ) : isAdmin ? (
          // Admin screens
          <Stack.Screen name="AdminRoot" component={AdminNavigator} />
        ) : (
          // Regular user screens
          <Stack.Screen name="Main" component={MainTabNavigator} />
        )}

        {/* Common screens accessible to authenticated users */}
        <Stack.Screen
          name="DebateDetail"
          component={DebateDetailScreen}
          options={{ headerShown: true, title: "Debate" }}
        />
        <Stack.Screen
          name="CreateDebate"
          component={CreateDebateScreen}
          options={{ headerShown: true, title: "Create Debate" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
