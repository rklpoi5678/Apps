import * as Analytics from "expo-analytics-amplitude"
import * as Device from "expo-device"
import { Platform } from "react-native"

export interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
}

export interface UserProperties {
  userId?: string
  username?: string
  role?: string
  verified?: boolean
  joinDate?: string
  debateCount?: number
  winRate?: number
}

class AnalyticsService {
  private initialized = false

  async initialize(apiKey: string): Promise<void> {
    try {
      await Analytics.initialize(apiKey)
      this.initialized = true

      // Set device properties
      await this.setDeviceProperties()

      console.log("Analytics initialized successfully")
    } catch (error) {
      console.error("Failed to initialize analytics:", error)
    }
  }

  private async setDeviceProperties(): Promise<void> {
    const deviceProperties = {
      platform: Platform.OS,
      platformVersion: Platform.Version,
      deviceModel: Device.modelName,
      deviceBrand: Device.brand,
      deviceYear: Device.deviceYearClass,
      appVersion: "1.0.0", // Should come from app.json
    }

    await Analytics.setUserProperties(deviceProperties)
  }

  async setUserId(userId: string): Promise<void> {
    if (!this.initialized) return

    try {
      await Analytics.setUserId(userId)
    } catch (error) {
      console.error("Failed to set user ID:", error)
    }
  }

  async setUserProperties(properties: UserProperties): Promise<void> {
    if (!this.initialized) return

    try {
      await Analytics.setUserProperties(properties)
    } catch (error) {
      console.error("Failed to set user properties:", error)
    }
  }

  async trackEvent(event: AnalyticsEvent): Promise<void> {
    if (!this.initialized) return

    try {
      await Analytics.logEvent(event.name, event.properties)
    } catch (error) {
      console.error("Failed to track event:", error)
    }
  }

  // Predefined events for common actions
  async trackDebateViewed(debateId: string, title: string, category: string): Promise<void> {
    await this.trackEvent({
      name: "debate_viewed",
      properties: {
        debateId,
        title,
        category,
        timestamp: new Date().toISOString(),
      },
    })
  }

  async trackDebateCreated(debateId: string, category: string, duration: string): Promise<void> {
    await this.trackEvent({
      name: "debate_created",
      properties: {
        debateId,
        category,
        duration,
        timestamp: new Date().toISOString(),
      },
    })
  }

  async trackArgumentSubmitted(debateId: string, side: "pro" | "con", argumentLength: number): Promise<void> {
    await this.trackEvent({
      name: "argument_submitted",
      properties: {
        debateId,
        side,
        argumentLength,
        timestamp: new Date().toISOString(),
      },
    })
  }

  async trackVoteCast(debateId: string, argumentId: string, voteType: "up" | "down"): Promise<void> {
    await this.trackEvent({
      name: "vote_cast",
      properties: {
        debateId,
        argumentId,
        voteType,
        timestamp: new Date().toISOString(),
      },
    })
  }

  async trackUserRegistration(method: "email" | "google" | "apple"): Promise<void> {
    await this.trackEvent({
      name: "user_registered",
      properties: {
        method,
        timestamp: new Date().toISOString(),
      },
    })
  }

  async trackUserLogin(method: "email" | "google" | "apple"): Promise<void> {
    await this.trackEvent({
      name: "user_login",
      properties: {
        method,
        timestamp: new Date().toISOString(),
      },
    })
  }

  async trackScreenView(screenName: string, previousScreen?: string): Promise<void> {
    await this.trackEvent({
      name: "screen_view",
      properties: {
        screenName,
        previousScreen,
        timestamp: new Date().toISOString(),
      },
    })
  }

  async trackSearch(query: string, category?: string, resultsCount?: number): Promise<void> {
    await this.trackEvent({
      name: "search_performed",
      properties: {
        query,
        category,
        resultsCount,
        timestamp: new Date().toISOString(),
      },
    })
  }

  async trackShare(contentType: "debate" | "argument", contentId: string, method: string): Promise<void> {
    await this.trackEvent({
      name: "content_shared",
      properties: {
        contentType,
        contentId,
        method,
        timestamp: new Date().toISOString(),
      },
    })
  }

  async trackError(error: string, context?: string): Promise<void> {
    await this.trackEvent({
      name: "error_occurred",
      properties: {
        error,
        context,
        timestamp: new Date().toISOString(),
      },
    })
  }

  // Performance tracking
  async trackPerformance(action: string, duration: number, success: boolean): Promise<void> {
    await this.trackEvent({
      name: "performance_metric",
      properties: {
        action,
        duration,
        success,
        timestamp: new Date().toISOString(),
      },
    })
  }
}

export const analyticsService = new AnalyticsService()
