"use client"

import { useState, useEffect, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Video, ResizeMode } from "expo-av"

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

interface AdManagerProps {
  type: "opening" | "fullscreen" | "banner"
  onClose?: () => void
  onAdClick?: () => void
}

export default function AdManager({ type, onClose, onAdClick }: AdManagerProps) {
  const [countdown, setCountdown] = useState(5)
  const [canClose, setCanClose] = useState(false)
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start()

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanClose(true)
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleClose = () => {
    if (canClose && onClose) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        onClose()
      })
    }
  }

  const handleAdClick = () => {
    if (onAdClick) {
      onAdClick()
    }
    // Simulate opening external link
    console.log("Ad clicked - opening external link")
  }

  if (type === "opening" || type === "fullscreen") {
    return (
      <Animated.View style={[styles.fullscreenContainer, { opacity: fadeAnim }]}>
        <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.adBackground}>
          {/* Video Ad */}
          <Video
            source={{ uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" }}
            style={styles.adVideo}
            shouldPlay
            isMuted={false}
            resizeMode={ResizeMode.CONTAIN}
          />

          {/* Ad Content Overlay */}
          <View style={styles.adOverlay}>
            <View style={styles.adContent}>
              <Text style={styles.adTitle}>🎮 Amazing Game!</Text>
              <Text style={styles.adSubtitle}>Download now and get 50% off!</Text>

              <TouchableOpacity style={styles.adButton} onPress={handleAdClick}>
                <LinearGradient colors={["#FF6B6B", "#FF8E53"]} style={styles.adButtonGradient}>
                  <Text style={styles.adButtonText}>Download Now</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Close Button */}
            <TouchableOpacity
              style={[styles.closeButton, { opacity: canClose ? 1 : 0.5 }]}
              onPress={handleClose}
              disabled={!canClose}
            >
              <Text style={styles.closeButtonText}>{canClose ? "✕ Skip" : `Skip in ${countdown}s`}</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>
    )
  }

  return null
}

const styles = StyleSheet.create({
  fullscreenContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 1000,
  },
  adBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  adVideo: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  adOverlay: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  adContent: {
    alignItems: "center",
    marginTop: 100,
  },
  adTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 10,
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  adSubtitle: {
    fontSize: 18,
    color: "#F0F8FF",
    textAlign: "center",
    marginBottom: 30,
  },
  adButton: {
    width: 200,
    height: 50,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  adButtonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  adButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  closeButton: {
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: "flex-end",
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
})
