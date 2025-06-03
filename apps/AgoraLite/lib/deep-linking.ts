import * as Linking from "expo-linking"
import type { NavigationContainerRef } from "@react-navigation/native"

export interface DeepLinkConfig {
  screens: {
    Main: {
      screens: {
        Home: "home"
        Debates: "debates"
        Leaderboard: "leaderboard"
        Profile: "profile"
      }
    }
    DebateDetail: "debate/:debateId"
    CreateDebate: "create-debate"
    Auth: "auth"
    AdminRoot: {
      screens: {
        AdminDashboard: "admin"
        UserManagement: "admin/users"
        ContentManagement: "admin/content"
      }
    }
  }
}

class DeepLinkingService {
  private navigationRef: NavigationContainerRef<any> | null = null

  setNavigationRef(ref: NavigationContainerRef<any>) {
    this.navigationRef = ref
  }

  getInitialURL(): Promise<string | null> {
    return Linking.getInitialURL()
  }

  addEventListener(listener: (url: string) => void): Linking.URLListener {
    return Linking.addEventListener("url", ({ url }) => listener(url))
  }

  createURL(path: string): string {
    return Linking.createURL(path)
  }

  // Parse incoming URLs and navigate accordingly
  handleDeepLink(url: string): boolean {
    if (!this.navigationRef) {
      console.warn("Navigation ref not set")
      return false
    }

    try {
      const { hostname, path, queryParams } = Linking.parse(url)

      // Handle different URL patterns
      if (path.startsWith("/debate/")) {
        const debateId = path.split("/")[2]
        this.navigationRef.navigate("DebateDetail", { debateId })
        return true
      }

      if (path === "/create-debate") {
        this.navigationRef.navigate("CreateDebate")
        return true
      }

      if (path === "/auth") {
        const mode = queryParams?.mode || "login"
        this.navigationRef.navigate("Auth", { screen: mode })
        return true
      }

      if (path.startsWith("/admin")) {
        if (path === "/admin/users") {
          this.navigationRef.navigate("AdminRoot", { screen: "UserManagement" })
        } else if (path === "/admin/content") {
          this.navigationRef.navigate("AdminRoot", { screen: "ContentManagement" })
        } else {
          this.navigationRef.navigate("AdminRoot", { screen: "AdminDashboard" })
        }
        return true
      }

      // Default navigation
      switch (path) {
        case "/home":
          this.navigationRef.navigate("Main", { screen: "Home" })
          return true
        case "/debates":
          this.navigationRef.navigate("Main", { screen: "Debates" })
          return true
        case "/leaderboard":
          this.navigationRef.navigate("Main", { screen: "Leaderboard" })
          return true
        case "/profile":
          this.navigationRef.navigate("Main", { screen: "Profile" })
          return true
        default:
          // Navigate to home for unrecognized paths
          this.navigationRef.navigate("Main", { screen: "Home" })
          return true
      }
    } catch (error) {
      console.error("Error handling deep link:", error)
      return false
    }
  }

  // Generate shareable URLs
  generateDebateURL(debateId: string): string {
    return this.createURL(`/debate/${debateId}`)
  }

  generateProfileURL(username: string): string {
    return this.createURL(`/profile/${username}`)
  }

  generateInviteURL(debateId: string): string {
    return this.createURL(`/debate/${debateId}?invite=true`)
  }

  // Share functionality
  async shareDebate(debateId: string, title: string): Promise<boolean> {
    try {
      const url = this.generateDebateURL(debateId)
      const { Share } = await import("react-native")

      const result = await Share.share({
        message: `Check out this debate: ${title}`,
        url,
        title: "AgoraLite Debate",
      })

      return result.action === Share.sharedAction
    } catch (error) {
      console.error("Error sharing debate:", error)
      return false
    }
  }
}

export const deepLinkingService = new DeepLinkingService()

// Linking configuration for React Navigation
export const linkingConfig = {
  prefixes: [Linking.createURL("/"), "agoralite://", "https://agoralite.app"],
  config: {
    screens: {
      Main: {
        screens: {
          Home: "home",
          Debates: "debates",
          Leaderboard: "leaderboard",
          Profile: "profile",
        },
      },
      DebateDetail: "debate/:debateId",
      CreateDebate: "create-debate",
      Auth: "auth",
      AdminRoot: {
        screens: {
          AdminDashboard: "admin",
          UserManagement: "admin/users",
          ContentManagement: "admin/content",
        },
      },
    },
  },
}
