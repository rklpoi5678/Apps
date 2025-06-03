"use client"

import type React from "react"
import { View, Text, StyleSheet, type ViewStyle, type TextStyle } from "react-native"
import { useTheme } from "../../lib/theme-provider"

type BadgeVariant = "default" | "primary" | "secondary" | "outline" | "success" | "warning" | "danger"

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  style?: ViewStyle
  textStyle?: TextStyle
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = "default", style, textStyle }) => {
  const { colors, isDark } = useTheme()

  // Get badge background color based on variant
  const getBackgroundColor = (): string => {
    switch (variant) {
      case "primary":
        return colors.primary
      case "secondary":
        return isDark ? "#4B5563" : "#E5E7EB"
      case "outline":
        return "transparent"
      case "success":
        return colors.success
      case "warning":
        return colors.warning
      case "danger":
        return colors.danger
      default:
        return isDark ? colors.accent : "#F3F4F6"
    }
  }

  // Get badge text color based on variant
  const getTextColor = (): string => {
    switch (variant) {
      case "primary":
      case "success":
      case "danger":
        return "#FFFFFF"
      case "warning":
        return "#1F2937"
      case "outline":
        return colors.text
      case "secondary":
        return isDark ? "#E5E7EB" : "#4B5563"
      default:
        return colors.text
    }
  }

  // Get border color for outline variant
  const getBorderColor = (): string | undefined => {
    return variant === "outline" ? colors.border : undefined
  }

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === "outline" ? 1 : 0,
        },
        style,
      ]}
    >
      {typeof children === "string" ? (
        <Text style={[styles.text, { color: getTextColor() }, textStyle]}>{children}</Text>
      ) : (
        children
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 16,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 12,
    fontWeight: "500",
  },
})
