"use client"

import { useEffect, useRef } from "react"
import { View, Animated, StyleSheet } from "react-native"

interface SoundVisualizerProps {
  isPlaying: boolean
  intensity: number
}

export function SoundVisualizer({ isPlaying, intensity }: SoundVisualizerProps) {
  const pulseAnimation = useRef(new Animated.Value(0)).current
  const waveAnimation = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (isPlaying) {
      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ).start()

      // Wave animation
      Animated.loop(
        Animated.timing(waveAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ).start()
    } else {
      pulseAnimation.setValue(0)
      waveAnimation.setValue(0)
    }
  }, [isPlaying])

  if (!isPlaying) return null

  return (
    <View style={styles.container}>
      {[...Array(3)].map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.wave,
            {
              opacity: pulseAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 0.8],
              }),
              transform: [
                {
                  scale: waveAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5 + index * 0.2, 1.5 + index * 0.3],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  wave: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FFD700",
    borderWidth: 2,
    borderColor: "#FFA500",
  },
})
