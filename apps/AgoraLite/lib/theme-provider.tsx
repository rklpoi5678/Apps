"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useColorScheme } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Define theme colors
const lightTheme = {
  background: "#FFFFFF",
  card: "#F9FAFB",
  primary: "#3B82F6",
  secondary: "#6366F1",
  text: "#1F2937",
  border: "#E5E7EB",
  notification: "#EF4444",
  muted: "#9CA3AF",
  accent: "#F3F4F6",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#3B82F6",
}

const darkTheme = {
  background: "#1F2937",
  card: "#374151",
  primary: "#60A5FA",
  secondary: "#818CF8",
  text: "#F9FAFB",
  border: "#4B5563",
  notification: "#F87171",
  muted: "#9CA3AF",
  accent: "#374151",
  success: "#34D399",
  warning: "#FBBF24",
  danger: "#F87171",
  info: "#60A5FA",
}

// Define theme context
type ThemeContextType = {
  isDark: boolean
  colors: typeof lightTheme
  toggleTheme: () => void
  setTheme: (theme: "light" | "dark" | "system") => void
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  colors: lightTheme,
  toggleTheme: () => {},
  setTheme: () => {},
})

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme()
  const [themePreference, setThemePreference] = useState<"light" | "dark" | "system">("system")
  const [isDark, setIsDark] = useState(systemColorScheme === "dark")

  // Load saved theme preference
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedPreference = await AsyncStorage.getItem("themePreference")
        if (savedPreference) {
          setThemePreference(savedPreference as "light" | "dark" | "system")
        }
      } catch (error) {
        console.error("Failed to load theme preference:", error)
      }
    }

    loadThemePreference()
  }, [])

  // Update theme based on preference and system
  useEffect(() => {
    if (themePreference === "system") {
      setIsDark(systemColorScheme === "dark")
    } else {
      setIsDark(themePreference === "dark")
    }
  }, [themePreference, systemColorScheme])

  // Save theme preference
  const saveThemePreference = async (preference: "light" | "dark" | "system") => {
    try {
      await AsyncStorage.setItem("themePreference", preference)
    } catch (error) {
      console.error("Failed to save theme preference:", error)
    }
  }

  const toggleTheme = () => {
    const newPreference = isDark ? "light" : "dark"
    setThemePreference(newPreference)
    saveThemePreference(newPreference)
  }

  const setTheme = (theme: "light" | "dark" | "system") => {
    setThemePreference(theme)
    saveThemePreference(theme)
  }

  const colors = isDark ? darkTheme : lightTheme

  return <ThemeContext.Provider value={{ isDark, colors, toggleTheme, setTheme }}>{children}</ThemeContext.Provider>
}
