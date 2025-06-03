"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "../lib/theme-provider"
import { useAuth } from "../lib/auth-context"
import { Card, CardContent } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Ionicons } from "@expo/vector-icons"

type AuthTab = "login" | "register" | "reset"

const AuthScreen = ({ navigation, route }) => {
  const { colors } = useTheme()
  const { login, register, resetPassword, socialLogin, isLoading, error } = useAuth()
  const [activeTab, setActiveTab] = useState<AuthTab>(route?.params?.screen || "login")

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    email: "",
    username: "",
    displayName: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })

  // Reset password form state
  const [resetForm, setResetForm] = useState({
    email: "",
  })

  // Form validation
  const [errors, setErrors] = useState({})

  const validateLoginForm = () => {
    const newErrors = {}
    if (!loginForm.email) newErrors.email = "Email is required"
    if (!loginForm.password) newErrors.password = "Password is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateRegisterForm = () => {
    const newErrors = {}
    if (!registerForm.email) newErrors.email = "Email is required"
    if (!registerForm.username) newErrors.username = "Username is required"
    if (!registerForm.displayName) newErrors.displayName = "Display name is required"
    if (!registerForm.password) newErrors.password = "Password is required"
    if (registerForm.password !== registerForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }
    if (!registerForm.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async () => {
    if (!validateLoginForm()) return

    try {
      await login({
        email: loginForm.email,
        password: loginForm.password,
        rememberMe: loginForm.rememberMe,
      })
      navigation.replace("Main")
    } catch (err) {
      Alert.alert("Login Failed", error || "Please check your credentials and try again.")
    }
  }

  const handleRegister = async () => {
    if (!validateRegisterForm()) return

    try {
      await register({
        email: registerForm.email,
        username: registerForm.username,
        displayName: registerForm.displayName,
        password: registerForm.password,
        confirmPassword: registerForm.confirmPassword,
        agreeToTerms: registerForm.agreeToTerms,
      })
      navigation.replace("Main")
    } catch (err) {
      Alert.alert("Registration Failed", error || "Please try again.")
    }
  }

  const handleResetPassword = async () => {
    if (!resetForm.email) {
      setErrors({ email: "Email is required" })
      return
    }

    try {
      await resetPassword({ email: resetForm.email })
      Alert.alert("Reset Link Sent", "Check your email for password reset instructions.")
      setActiveTab("login")
    } catch (err) {
      Alert.alert("Reset Failed", error || "Please try again.")
    }
  }

  const handleSocialLogin = async (provider: string) => {
    try {
      await socialLogin(provider)
      navigation.replace("Main")
    } catch (err) {
      Alert.alert("Social Login Failed", error || "Please try again.")
    }
  }

  const renderLoginForm = () => (
    <View style={styles.formContainer}>
      <Input
        label="Email"
        placeholder="Enter your email"
        value={loginForm.email}
        onChangeText={(text) => setLoginForm({ ...loginForm, email: text })}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        leftIcon={<Ionicons name="mail-outline" size={20} color={colors.muted} />}
      />

      <Input
        label="Password"
        placeholder="Enter your password"
        value={loginForm.password}
        onChangeText={(text) => setLoginForm({ ...loginForm, password: text })}
        error={errors.password}
        isPassword
        leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.muted} />}
      />

      <TouchableOpacity style={styles.forgotPassword} onPress={() => setActiveTab("reset")} activeOpacity={0.7}>
        <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>Forgot Password?</Text>
      </TouchableOpacity>

      <Button variant="primary" fullWidth isLoading={isLoading} onPress={handleLogin} style={{ marginTop: 8 }}>
        Sign In
      </Button>

      <View style={styles.divider}>
        <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        <Text style={[styles.dividerText, { color: colors.muted }]}>or continue with</Text>
        <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
      </View>

      <View style={styles.socialButtons}>
        <Button
          variant="outline"
          style={styles.socialButton}
          onPress={() => handleSocialLogin("google")}
          leftIcon={<Ionicons name="logo-google" size={20} color="#DB4437" />}
        >
          Google
        </Button>
        <Button
          variant="outline"
          style={styles.socialButton}
          onPress={() => handleSocialLogin("apple")}
          leftIcon={<Ionicons name="logo-apple" size={20} color={colors.text} />}
        >
          Apple
        </Button>
      </View>

      <View style={styles.switchAuth}>
        <Text style={[styles.switchAuthText, { color: colors.muted }]}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => setActiveTab("register")} activeOpacity={0.7}>
          <Text style={[styles.switchAuthLink, { color: colors.primary }]}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  const renderRegisterForm = () => (
    <View style={styles.formContainer}>
      <Input
        label="Email"
        placeholder="Enter your email"
        value={registerForm.email}
        onChangeText={(text) => setRegisterForm({ ...registerForm, email: text })}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        leftIcon={<Ionicons name="mail-outline" size={20} color={colors.muted} />}
      />

      <Input
        label="Username"
        placeholder="Choose a username"
        value={registerForm.username}
        onChangeText={(text) => setRegisterForm({ ...registerForm, username: text })}
        error={errors.username}
        autoCapitalize="none"
        leftIcon={<Ionicons name="person-outline" size={20} color={colors.muted} />}
      />

      <Input
        label="Display Name"
        placeholder="Enter your display name"
        value={registerForm.displayName}
        onChangeText={(text) => setRegisterForm({ ...registerForm, displayName: text })}
        error={errors.displayName}
        leftIcon={<Ionicons name="person-circle-outline" size={20} color={colors.muted} />}
      />

      <Input
        label="Password"
        placeholder="Create a password"
        value={registerForm.password}
        onChangeText={(text) => setRegisterForm({ ...registerForm, password: text })}
        error={errors.password}
        isPassword
        leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.muted} />}
      />

      <Input
        label="Confirm Password"
        placeholder="Confirm your password"
        value={registerForm.confirmPassword}
        onChangeText={(text) => setRegisterForm({ ...registerForm, confirmPassword: text })}
        error={errors.confirmPassword}
        isPassword
        leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.muted} />}
      />

      <Button variant="primary" fullWidth isLoading={isLoading} onPress={handleRegister} style={{ marginTop: 16 }}>
        Create Account
      </Button>

      <View style={styles.switchAuth}>
        <Text style={[styles.switchAuthText, { color: colors.muted }]}>Already have an account? </Text>
        <TouchableOpacity onPress={() => setActiveTab("login")} activeOpacity={0.7}>
          <Text style={[styles.switchAuthLink, { color: colors.primary }]}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  const renderResetForm = () => (
    <View style={styles.formContainer}>
      <Text style={[styles.resetDescription, { color: colors.muted }]}>
        Enter your email address and we'll send you a link to reset your password.
      </Text>

      <Input
        label="Email"
        placeholder="Enter your email"
        value={resetForm.email}
        onChangeText={(text) => setResetForm({ ...resetForm, email: text })}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        leftIcon={<Ionicons name="mail-outline" size={20} color={colors.muted} />}
      />

      <Button variant="primary" fullWidth isLoading={isLoading} onPress={handleResetPassword} style={{ marginTop: 16 }}>
        Send Reset Link
      </Button>

      <View style={styles.switchAuth}>
        <Text style={[styles.switchAuthText, { color: colors.muted }]}>Remember your password? </Text>
        <TouchableOpacity onPress={() => setActiveTab("login")} activeOpacity={0.7}>
          <Text style={[styles.switchAuthLink, { color: colors.primary }]}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.logoContainer, { backgroundColor: colors.primary }]}>
              <Ionicons name="chatbubbles" size={32} color="#FFFFFF" />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>
              {activeTab === "login" ? "Welcome Back" : activeTab === "register" ? "Join AgoraLite" : "Reset Password"}
            </Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>
              {activeTab === "login"
                ? "Sign in to continue your debates"
                : activeTab === "register"
                  ? "Create your account to start debating"
                  : "We'll help you get back in"}
            </Text>
          </View>

          {/* Auth Form */}
          <Card style={styles.formCard}>
            <CardContent>
              {activeTab === "login" && renderLoginForm()}
              {activeTab === "register" && renderRegisterForm()}
              {activeTab === "reset" && renderResetForm()}
            </CardContent>
          </Card>

          {/* Terms and Privacy */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.muted }]}>
              By continuing, you agree to our <Text style={{ color: colors.primary }}>Terms of Service</Text> and{" "}
              <Text style={{ color: colors.primary }}>Privacy Policy</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  formCard: {
    marginBottom: 24,
  },
  formContainer: {
    paddingVertical: 8,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 16,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: "500",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  socialButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  switchAuth: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  switchAuthText: {
    fontSize: 14,
  },
  switchAuthLink: {
    fontSize: 14,
    fontWeight: "600",
  },
  resetDescription: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  footer: {
    marginTop: "auto",
    paddingTop: 24,
  },
  footerText: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
})

export default AuthScreen
