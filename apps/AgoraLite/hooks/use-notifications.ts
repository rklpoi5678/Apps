"use client"

import { useEffect, useRef } from "react"
import { useNavigation } from "@react-navigation/native"
import * as Notifications from "expo-notifications"
import { notificationService, type NotificationData } from "@/lib/notification-service"

export function useNotifications() {
  const navigation = useNavigation()
  const notificationListener = useRef<Notifications.Subscription>()
  const responseListener = useRef<Notifications.Subscription>()

  useEffect(() => {
    // Initialize notification service
    notificationService.initialize()

    // Listen for notifications received while app is in foreground
    notificationListener.current = notificationService.addNotificationReceivedListener((notification) => {
      console.log("Notification received:", notification)
      // Handle foreground notification display
    })

    // Listen for user tapping on notifications
    responseListener.current = notificationService.addNotificationResponseReceivedListener((response) => {
      console.log("Notification response:", response)
      handleNotificationResponse(response)
    })

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current)
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current)
      }
    }
  }, [])

  const handleNotificationResponse = (response: Notifications.NotificationResponse) => {
    const data = response.notification.request.content.data

    // Navigate based on notification type
    switch (data.type) {
      case "debate_invite":
        if (data.debateId) {
          navigation.navigate("DebateDetail", { debateId: data.debateId })
        }
        break
      case "argument_reply":
        if (data.debateId) {
          navigation.navigate("DebateDetail", { debateId: data.debateId })
        }
        break
      case "vote_update":
        if (data.debateId) {
          navigation.navigate("DebateDetail", { debateId: data.debateId })
        }
        break
      case "system_announcement":
        // Navigate to appropriate screen or show modal
        break
      default:
        // Default navigation
        navigation.navigate("Main", { screen: "Home" })
    }
  }

  const scheduleNotification = async (notification: NotificationData): Promise<string> => {
    return await notificationService.scheduleLocalNotification(notification)
  }

  const scheduleDelayedNotification = async (
    notification: NotificationData,
    delayInSeconds: number,
  ): Promise<string> => {
    return await notificationService.scheduleDelayedNotification(notification, delayInSeconds)
  }

  const cancelNotification = async (notificationId: string): Promise<void> => {
    await notificationService.cancelNotification(notificationId)
  }

  const setBadgeCount = async (count: number): Promise<void> => {
    await notificationService.setBadgeCount(count)
  }

  const clearBadge = async (): Promise<void> => {
    await notificationService.clearBadge()
  }

  return {
    scheduleNotification,
    scheduleDelayedNotification,
    cancelNotification,
    setBadgeCount,
    clearBadge,
    expoPushToken: notificationService.getExpoPushToken(),
  }
}
