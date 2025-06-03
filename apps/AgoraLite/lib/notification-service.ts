import * as Notifications from "expo-notifications"
import * as Device from "expo-device"

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

export interface NotificationData {
  type: "debate_invite" | "argument_reply" | "vote_update" | "system_announcement"
  debateId?: string
  argumentId?: string
  title: string
  body: string
  data?: Record<string, any>
}

class NotificationService {
  private expoPushToken: string | null = null

  async initialize(): Promise<string | null> {
    if (!Device.isDevice) {
      console.log("Must use physical device for Push Notifications")
      return null
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }

    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!")
      return null
    }

    try {
      const token = (await Notifications.getExpoPushTokenAsync()).data
      this.expoPushToken = token
      console.log("Expo push token:", token)
      return token
    } catch (error) {
      console.log("Error getting push token:", error)
      return null
    }
  }

  async scheduleLocalNotification(notification: NotificationData): Promise<string> {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
        sound: true,
      },
      trigger: null, // Show immediately
    })

    return notificationId
  }

  async scheduleDelayedNotification(notification: NotificationData, delayInSeconds: number): Promise<string> {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
        sound: true,
      },
      trigger: {
        seconds: delayInSeconds,
      },
    })

    return notificationId
  }

  async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId)
  }

  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync()
  }

  async setBadgeCount(count: number): Promise<void> {
    await Notifications.setBadgeCountAsync(count)
  }

  async clearBadge(): Promise<void> {
    await Notifications.setBadgeCountAsync(0)
  }

  getExpoPushToken(): string | null {
    return this.expoPushToken
  }

  // Handle notification received while app is in foreground
  addNotificationReceivedListener(
    listener: (notification: Notifications.Notification) => void,
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(listener)
  }

  // Handle notification tapped/opened
  addNotificationResponseReceivedListener(
    listener: (response: Notifications.NotificationResponse) => void,
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(listener)
  }

  // Send notification to server for push delivery
  async sendPushNotification(targetExpoPushToken: string, notification: NotificationData): Promise<boolean> {
    const message = {
      to: targetExpoPushToken,
      sound: "default",
      title: notification.title,
      body: notification.body,
      data: notification.data || {},
    }

    try {
      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      })

      const result = await response.json()
      return result.data?.status === "ok"
    } catch (error) {
      console.log("Error sending push notification:", error)
      return false
    }
  }
}

export const notificationService = new NotificationService()
