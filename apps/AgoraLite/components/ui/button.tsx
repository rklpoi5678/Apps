"use client"

import React from "react"
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  type ViewStyle,
  type TextStyle,
  type TouchableOpacityProps,
} from "react-native"
import { useTheme } from "@/lib/theme-provider"

type ButtonVariant = "default" | "primary" | "outline" | "ghost" | "link" | "destructive"
type ButtonSize = "sm" | "md" | "lg"

interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "default",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  style,
  textStyle,
  disabled,
  ...props
}) => {
  const { colors, isDark } = useTheme()

  // Generate styles based on variant, size, and theme
  const getButtonStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 8,
    }

    // Size styles
    switch (size) {
      case "sm":
        baseStyle.paddingVertical = 8
        baseStyle.paddingHorizontal = 12
        break
      case "lg":
        baseStyle.paddingVertical = 16
        baseStyle.paddingHorizontal = 24
        break
      default: // md
        baseStyle.paddingVertical = 12
        baseStyle.paddingHorizontal = 16
    }

    // Variant styles
    switch (variant) {
      case "primary":
        baseStyle.backgroundColor = colors.primary
        break
      case "outline":
        baseStyle.backgroundColor = "transparent"
        baseStyle.borderWidth = 1
        baseStyle.borderColor = colors.border
        break
      case "ghost":
        baseStyle.backgroundColor = "transparent"
        break
      case "link":
        baseStyle.backgroundColor = "transparent"
        baseStyle.paddingVertical = 0
        baseStyle.paddingHorizontal = 0
        break
      case "destructive":
        baseStyle.backgroundColor = colors.danger
        break
      default: // default
        baseStyle.backgroundColor = isDark ? colors.card : colors.accent
    }

    // Width
    if (fullWidth) {
      baseStyle.width = "100%"
    }

    // Disabled state
    if (disabled || isLoading) {
      baseStyle.opacity = 0.6
    }

    return baseStyle
  }

  // Generate text styles based on variant and size
  const getTextStyles = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: "600",
    }

    // Size styles
    switch (size) {
      case "sm":
        baseStyle.fontSize = 14
        break
      case "lg":
        baseStyle.fontSize = 18
        break
      default: // md
        baseStyle.fontSize = 16
    }

    // Variant styles
    switch (variant) {
      case "primary":
      case "destructive":
        baseStyle.color = "#FFFFFF"
        break
      case "link":
        baseStyle.color = colors.primary
        break
      case "outline":
      case "ghost":
        baseStyle.color = colors.primary
        break
      default: // default
        baseStyle.color = colors.text
    }

    return baseStyle
  }

  return (
    <TouchableOpacity
      style={[getButtonStyles(), style]}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === "primary" || variant === "destructive" ? "#FFFFFF" : colors.primary}
        />
      ) : (
        <>
          {leftIcon && <React.Fragment>{leftIcon}</React.Fragment>}
          {typeof children === "string" ? (
            <Text style={[getTextStyles(), textStyle, leftIcon || rightIcon ? { marginHorizontal: 8 } : null]}>
              {children}
            </Text>
          ) : (
            children
          )}
          {rightIcon && <React.Fragment>{rightIcon}</React.Fragment>}
        </>
      )}
    </TouchableOpacity>
  )
}
