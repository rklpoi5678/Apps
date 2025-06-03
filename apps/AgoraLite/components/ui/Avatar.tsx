"use client"

import type React from "react"
import { View, Image, Text, StyleSheet, type ViewStyle } from "react-native"
import { useTheme } from "../../lib/theme-provider"

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl"

interface AvatarProps {
  source?: string | null
  name?: string
  size?: AvatarSize
  style?: ViewStyle
}

export const Avatar: React.FC<AvatarProps> = ({ source, name, size = "md", style }) => {
  const { colors } = useTheme()

  // Calculate size in pixels
  const getSizeValue = (): number => {
    switch (size) {
      case "xs":
        return 24
      case "sm":
        return 32
      case "lg":
        return 48
      case "xl":
        return 64
      default:
        return 40 // md
    }
  }

  // Get initials from name
  const getInitials = (): string => {
    if (!name) return ""

    const names = name.split(" ")
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase()
    }

    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
  }

  // Calculate font size based on avatar size
  const getFontSize = (): number => {
    const sizeValue = getSizeValue()
    return sizeValue * 0.4
  }

  const sizeValue = getSizeValue()
  const initials = getInitials()

  return (
    <View
      style={[
        styles.container,
        {
          width: sizeValue,
          height: sizeValue,
          borderRadius: sizeValue / 2,
          backgroundColor: source ? "transparent" : colors.primary,
        },
        style,
      ]}
    >
      {source ? (
        <Image
          source={{ uri: source }}
          style={styles.image}
          defaultSource={require("@/assets/default-avatar.png")}
        />
      ) : (
        <Text
          style={[
            styles.initials,
            {
              color: "#FFFFFF",
              fontSize: getFontSize(),
            },
          ]}
        >
          {initials}
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  initials: {
    fontWeight: "600",
  },
})
