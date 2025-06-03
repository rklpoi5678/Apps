"use client"

import { useEffect } from "react"
import { useNavigation, useRoute } from "@react-navigation/native"
import { analyticsService } from "../lib/analytics-service"
import { useAuth } from "../lib/auth-context"

export function useAnalytics() {
  const navigation = useNavigation()
  const route = useRoute()
  const { user } = useAuth()

  useEffect(() => {
    // Initialize analytics with API key
    analyticsService.initialize("your-amplitude-api-key")
  }, [])

  useEffect(() => {
    // Set user properties when user changes
    if (user) {
      analyticsService.setUserId(user.id)
      analyticsService.setUserProperties({
        userId: user.id,
        username: user.username,
        role: user.role,
        verified: user.isVerified,
        joinDate: user.createdAt,
      })
    }
  }, [user])

  useEffect(() => {
    // Track screen views
    const unsubscribe = navigation.addListener("state", (e) => {
      const currentRoute = navigation.getCurrentRoute()
      if (currentRoute) {
        analyticsService.trackScreenView(currentRoute.name)
      }
    })

    return unsubscribe
  }, [navigation])

  const trackEvent = (name: string, properties?: Record<string, any>) => {
    analyticsService.trackEvent({ name, properties })
  }

  const trackDebateViewed = (debateId: string, title: string, category: string) => {
    analyticsService.trackDebateViewed(debateId, title, category)
  }

  const trackDebateCreated = (debateId: string, category: string, duration: string) => {
    analyticsService.trackDebateCreated(debateId, category, duration)
  }

  const trackArgumentSubmitted = (debateId: string, side: "pro" | "con", argumentLength: number) => {
    analyticsService.trackArgumentSubmitted(debateId, side, argumentLength)
  }

  const trackVoteCast = (debateId: string, argumentId: string, voteType: "up" | "down") => {
    analyticsService.trackVoteCast(debateId, argumentId, voteType)
  }

  const trackSearch = (query: string, category?: string, resultsCount?: number) => {
    analyticsService.trackSearch(query, category, resultsCount)
  }

  const trackShare = (contentType: "debate" | "argument", contentId: string, method: string) => {
    analyticsService.trackShare(contentType, contentId, method)
  }

  const trackError = (error: string, context?: string) => {
    analyticsService.trackError(error, context)
  }

  return {
    trackEvent,
    trackDebateViewed,
    trackDebateCreated,
    trackArgumentSubmitted,
    trackVoteCast,
    trackSearch,
    trackShare,
    trackError,
  }
}
