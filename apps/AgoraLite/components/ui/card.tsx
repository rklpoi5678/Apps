"use client"

import type React from "react"
import { View, StyleSheet, type ViewStyle } from "react-native"
import { useTheme } from "@/lib/theme-provider"

interface CardProps {
  children: React.ReactNode
  style?: ViewStyle
}

export const Card: React.FC<CardProps> = ({ children, style }) => {
  const { colors } = useTheme()

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, style]}>{children}</View>
  )
}

interface CardContentProps {
  children: React.ReactNode
  style?: ViewStyle
}

export const CardContent: React.FC<CardContentProps> = ({ children, style }) => {
  return <View style={[styles.cardContent, style]}>{children}</View>
}

interface CardHeaderProps {
  children: React.ReactNode
  style?: ViewStyle
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, style }) => {
  return <View style={[styles.cardHeader, style]}>{children}</View>
}

interface CardFooterProps {
  children: React.ReactNode
  style?: ViewStyle
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, style }) => {
  return <View style={[styles.cardFooter, style]}>{children}</View>
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: "hidden",
    marginVertical: 8,
  },
  cardHeader: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  cardContent: {
    padding: 16,
  },
  cardFooter: {
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
})
