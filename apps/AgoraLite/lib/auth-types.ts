export interface User {
    id: string
    email: string
    username: string
    displayName: string
    avatar?: string
    role: UserRole
    isVerified: boolean
    isMfaEnabled: boolean
    createdAt: Date
    lastLoginAt?: Date
    profile: UserProfile
  }
  
  export interface UserProfile {
    bio?: string
    location?: string
    website?: string
    socialLinks?: {
      twitter?: string
      linkedin?: string
      github?: string
    }
    preferences: {
      notifications: {
        email: boolean
        push: boolean
        debates: boolean
        mentions: boolean
      }
      privacy: {
        profileVisibility: "public" | "private"
        showEmail: boolean
        showStats: boolean
      }
    }
  }
  
  export type UserRole = "user" | "expert" | "moderator" | "admin"
  
  export interface AuthState {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null
  }
  
  export interface LoginCredentials {
    email: string
    password: string
    rememberMe?: boolean
  }
  
  export interface RegisterData {
    email: string
    username: string
    displayName: string
    password: string
    confirmPassword: string
    agreeToTerms: boolean
  }
  
  export interface ResetPasswordData {
    email: string
  }
  
  export interface MfaSetupData {
    method: "sms" | "email" | "authenticator"
    phoneNumber?: string
  }
  
  export interface SocialProvider {
    id: string
    name: string
    icon: string
    color: string
  }
  