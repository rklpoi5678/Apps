"use client"

import { useEffect, useRef } from "react"
import { View, Animated, Dimensions } from "react-native"

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

export default function ParticleSystem() {
  const particles = useRef(
    Array.from({ length: 10 }, () => ({
      x: new Animated.Value(SCREEN_WIDTH / 2),
      y: new Animated.Value(SCREEN_HEIGHT / 2),
      opacity: new Animated.Value(1),
      scale: new Animated.Value(1),
    })),
  ).current

  useEffect(() => {
    const animations = particles.map((particle, index) => {
      const angle = (index / particles.length) * Math.PI * 2
      const distance = 100 + Math.random() * 50

      return Animated.parallel([
        Animated.timing(particle.x, {
          toValue: SCREEN_WIDTH / 2 + Math.cos(angle) * distance,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(particle.y, {
          toValue: SCREEN_HEIGHT / 2 + Math.sin(angle) * distance,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(particle.opacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(particle.scale, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    })

    Animated.parallel(animations).start()
  }, [])

  return (
    <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none" }}>
      {particles.map((particle, index) => (
        <Animated.View
          key={index}
          style={{
            position: "absolute",
            width: 10,
            height: 10,
            backgroundColor: ["#FFD700", "#FF6B6B", "#4ECDC4", "#98FB98"][index % 4],
            borderRadius: 5,
            opacity: particle.opacity,
            transform: [
              { translateX: particle.x },
              { translateY: particle.y },
              { scale: particle.scale }
            ],
          }}
        />
      ))}
    </View>
  )
}
