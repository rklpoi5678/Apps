"use client"

import type React from "react"
import { useState } from "react"
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  type TextInputProps,
  type ViewStyle,
  type TextStyle,
  TouchableOpacity,
} from "react-native"
import { useTheme } from "@/lib/theme-provider"
import { Ionicons } from "@expo/vector-icons"

interface InputProps extends TextInputProps {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  isPassword?: boolean
  containerStyle?: ViewStyle
  labelStyle?: TextStyle
  inputStyle?: TextStyle
  errorStyle?: TextStyle
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  isPassword = false,
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  secureTextEntry,
  ...props
}) => {
  const { colors } = useTheme()
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(!isPassword)

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, { color: colors.text }, labelStyle]}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          {
            borderColor: error ? colors.danger : isFocused ? colors.primary : colors.border,
            backgroundColor: colors.background,
          },
        ]}
      >
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}

        <TextInput
          style={[
            styles.input,
            { color: colors.text },
            leftIcon && { paddingLeft: 0 },
            (rightIcon || isPassword) && { paddingRight: 0 },
            inputStyle,
          ]}
          placeholderTextColor={colors.muted}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={isPassword ? !showPassword : secureTextEntry}
          {...props}
        />

        {isPassword && (
          <TouchableOpacity style={styles.iconContainer} onPress={togglePasswordVisibility} activeOpacity={0.7}>
            <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color={colors.muted} />
          </TouchableOpacity>
        )}

        {rightIcon && !isPassword && <View style={styles.iconContainer}>{rightIcon}</View>}
      </View>

      {error && <Text style={[styles.error, { color: colors.danger }, errorStyle]}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  iconContainer: {
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    marginTop: 4,
    fontSize: 12,
  },
})
