"use client"

import { useState, useEffect, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"

const { width: SCREEN_WIDTH } = Dimensions.get("window")

export default function BannerAd() {
  const [currentAd, setCurrentAd] = useState(0)
  const slideAnim = useRef(new Animated.Value(0)).current

  const ads = [
    {
      title: "🎯 Super Game",
      subtitle: "Play now!",
      colors: ["#FF6B6B", "#FF8E53"] as const,
    },
    {
      title: "🚀 Space Adventure",
      subtitle: "Explore the galaxy!",
      colors: ["#4ECDC4", "#44A08D"] as const,
    },
    {
      title: "🏆 Win Big",
      subtitle: "Join millions!",
      colors: ["#A8E6CF", "#7FCDCD"] as const,
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % ads.length)

      // Slide animation
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: -SCREEN_WIDTH,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const handleAdClick = () => {
    console.log("Banner ad clicked")
    // Simulate opening external link
  }

  return (
    <TouchableOpacity style={styles.container} onPress={handleAdClick}>
      <Animated.View style={[styles.adContainer, { transform: [{ translateX: slideAnim }] }]}>
        <LinearGradient colors={ads[currentAd].colors} style={styles.adGradient}>
          <View style={styles.adContent}>
            <Text style={styles.adTitle}>{ads[currentAd].title}</Text>
            <Text style={styles.adSubtitle}>{ads[currentAd].subtitle}</Text>
          </View>
          <View style={styles.adIndicator}>
            <Text style={styles.adText}>AD</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  adContainer: {
    flex: 1,
  },
  adGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  adContent: {
    flex: 1,
  },
  adTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  adSubtitle: {
    fontSize: 12,
    color: "#F0F8FF",
  },
  adIndicator: {
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  adText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
})
