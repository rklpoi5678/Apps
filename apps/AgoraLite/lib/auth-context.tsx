"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import type { User, AuthState, LoginCredentials, RegisterData, ResetPasswordData } from "@/lib/auth-types"

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  resetPassword: (data: ResetPasswordData) => Promise<void>
  socialLogin: (provider: string) => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  verifyEmail: (token: string) => Promise<void>
  setupMfa: (method: string) => Promise<void>
  refreshToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: User }
  | { type: "AUTH_ERROR"; payload: string }
  | { type: "AUTH_LOGOUT" }
  | { type: "UPDATE_USER"; payload: Partial<User> }

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, isLoading: true, error: null }
    case "AUTH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      }
    case "AUTH_ERROR":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      }
    case "AUTH_LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: null,
      }
    case "UPDATE_USER":
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      }
    default:
      return state
  }
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Simulate API calls - replace with actual API integration
  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: "AUTH_START" })
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockUser: User = {
        id: "1",
        email: credentials.email,
        username: "user123",
        displayName: "John Doe",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "user",
        isVerified: true,
        isMfaEnabled: false,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        profile: {
          bio: "Passionate debater",
          preferences: {
            notifications: {
              email: true,
              push: true,
              debates: true,
              mentions: true,
            },
            privacy: {
              profileVisibility: "public",
              showEmail: false,
              showStats: true,
            },
          },
        },
      }

      localStorage.setItem("auth_token", "mock_token")
      dispatch({ type: "AUTH_SUCCESS", payload: mockUser })
    } catch (error) {
      dispatch({ type: "AUTH_ERROR", payload: "Invalid credentials" })
    }
  }

  const register = async (data: RegisterData) => {
    dispatch({ type: "AUTH_START" })
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockUser: User = {
        id: "1",
        email: data.email,
        username: data.username,
        displayName: data.displayName,
        role: "user",
        isVerified: false,
        isMfaEnabled: false,
        createdAt: new Date(),
        profile: {
          preferences: {
            notifications: {
              email: true,
              push: true,
              debates: true,
              mentions: true,
            },
            privacy: {
              profileVisibility: "public",
              showEmail: false,
              showStats: true,
            },
          },
        },
      }

      localStorage.setItem("auth_token", "mock_token")
      dispatch({ type: "AUTH_SUCCESS", payload: mockUser })
    } catch (error) {
      dispatch({ type: "AUTH_ERROR", payload: "Registration failed" })
    }
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    dispatch({ type: "AUTH_LOGOUT" })
  }

  const resetPassword = async (data: ResetPasswordData) => {
    dispatch({ type: "AUTH_START" })
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // Reset password logic here
    } catch (error) {
      dispatch({ type: "AUTH_ERROR", payload: "Reset password failed" })
    }
  }

  const socialLogin = async (provider: string) => {
    dispatch({ type: "AUTH_START" })
    try {
      // Simulate social login
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockUser: User = {
        id: "1",
        email: `user@${provider}.com`,
        username: `${provider}_user`,
        displayName: `${provider} User`,
        role: "user",
        isVerified: true,
        isMfaEnabled: false,
        createdAt: new Date(),
        profile: {
          preferences: {
            notifications: {
              email: true,
              push: true,
              debates: true,
              mentions: true,
            },
            privacy: {
              profileVisibility: "public",
              showEmail: false,
              showStats: true,
            },
          },
        },
      }

      localStorage.setItem("auth_token", "mock_token")
      dispatch({ type: "AUTH_SUCCESS", payload: mockUser })
    } catch (error) {
      dispatch({ type: "AUTH_ERROR", payload: "Social login failed" })
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      dispatch({ type: "UPDATE_USER", payload: data })
    } catch (error) {
      dispatch({ type: "AUTH_ERROR", payload: "Profile update failed" })
    }
  }

  const verifyEmail = async (token: string) => {
    try {
      // Simulate email verification
      await new Promise((resolve) => setTimeout(resolve, 1000))
      dispatch({ type: "UPDATE_USER", payload: { isVerified: true } })
    } catch (error) {
      dispatch({ type: "AUTH_ERROR", payload: "Email verification failed" })
    }
  }

  const setupMfa = async (method: string) => {
    try {
      // Simulate MFA setup
      await new Promise((resolve) => setTimeout(resolve, 1000))
      dispatch({ type: "UPDATE_USER", payload: { isMfaEnabled: true } })
    } catch (error) {
      dispatch({ type: "AUTH_ERROR", payload: "MFA setup failed" })
    }
  }

  const refreshToken = async () => {
    try {
      // Simulate token refresh
      const token = localStorage.getItem("auth_token")
      if (token) {
        // Validate and refresh token
      }
    } catch (error) {
      logout()
    }
  }

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    if (token) {
      // Validate token and restore session
      refreshToken()
    }
  }, [])

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    resetPassword,
    socialLogin,
    updateProfile,
    verifyEmail,
    setupMfa,
    refreshToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
