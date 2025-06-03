"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { useTheme } from "../lib/theme-provider"
import { useAuth } from "../lib/auth-context"
import { Card, CardContent, CardHeader } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Badge } from "../components/ui/Badge"
import { Input } from "../components/ui/Input"
import { Ionicons } from "@expo/vector-icons"

const categories = [
  "Technology",
  "Science",
  "Politics",
  "Society",
  "Education",
  "Health",
  "Environment",
  "Economics",
  "Philosophy",
  "Pop Culture",
]

const CreateDebateScreen = () => {
  const navigation = useNavigation()
  const { colors } = useTheme()
  const { user, isAuthenticated } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    position: "",
    tags: [],
    duration: "3", // days
    allowAnonymous: true,
    requireVerification: false,
  })
  const [currentTag, setCurrentTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalSteps = 3

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1)
  }

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.title.trim()) {
          Alert.alert("Title Required", "Please enter a debate title.")
          return false
        }
        if (!formData.category) {
          Alert.alert("Category Required", "Please select a category.")
          return false
        }
        return true
      case 2:
        if (!formData.description.trim()) {
          Alert.alert("Description Required", "Please provide a description.")
          return false
        }
        if (!formData.position.trim()) {
          Alert.alert("Position Required", "Please state your position clearly.")
          return false
        }
        return true
      case 3:
        return true
      default:
        return true
    }
  }

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim()) && formData.tags.length < 5) {
      setFormData({
        ...formData,
        tags: [...formData.tags, currentTag.trim()],
      })
      setCurrentTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      Alert.alert("Sign In Required", "Please sign in to create a debate.")
      return
    }

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      Alert.alert("Debate Created!", "Your debate has been successfully created and is now live.", [
        {
          text: "OK",
          onPress: () => {
            navigation.goBack()
            // Navigate to the created debate
            navigation.navigate("DebateDetail", { debateId: Date.now() })
          },
        },
      ])
    } catch (error) {
      Alert.alert("Error", "Failed to create debate. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {Array.from({ length: totalSteps }, (_, index) => (
        <View key={index} style={styles.stepContainer}>
          <View
            style={[
              styles.stepCircle,
              {
                backgroundColor: index + 1 <= currentStep ? colors.primary : colors.border,
              },
            ]}
          >
            <Text style={[styles.stepNumber, { color: index + 1 <= currentStep ? "#FFFFFF" : colors.muted }]}>
              {index + 1}
            </Text>
          </View>
          {index < totalSteps - 1 && (
            <View
              style={[
                styles.stepLine,
                {
                  backgroundColor: index + 1 < currentStep ? colors.primary : colors.border,
                },
              ]}
            />
          )}
        </View>
      ))}
    </View>
  )

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>Basic Information</Text>
      <Text style={[styles.stepDescription, { color: colors.muted }]}>
        Let's start with the basics of your debate topic.
      </Text>

      <Input
        label="Debate Title"
        placeholder="State your position clearly and concisely..."
        value={formData.title}
        onChangeText={(text) => setFormData({ ...formData, title: text })}
        containerStyle={{ marginTop: 24 }}
      />

      <View style={styles.categorySection}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>Category</Text>
        <View style={styles.categoryGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                {
                  backgroundColor: formData.category === category ? colors.primary + "20" : colors.card,
                  borderColor: formData.category === category ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setFormData({ ...formData, category })}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.categoryText, { color: formData.category === category ? colors.primary : colors.text }]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  )

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>Your Position</Text>
      <Text style={[styles.stepDescription, { color: colors.muted }]}>
        Provide detailed information about your debate topic and your stance.
      </Text>

      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>Description</Text>
        <TextInput
          style={[
            styles.textArea,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder="Provide context and background for your debate topic..."
          placeholderTextColor={colors.muted}
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>Your Position</Text>
        <TextInput
          style={[
            styles.textArea,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder="Present your argument with evidence, examples, and reasoning..."
          placeholderTextColor={colors.muted}
          value={formData.position}
          onChangeText={(text) => setFormData({ ...formData, position: text })}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>Tags (Optional)</Text>
        <View style={styles.tagInputContainer}>
          <TextInput
            style={[
              styles.tagInput,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            placeholder="Add relevant tags..."
            placeholderTextColor={colors.muted}
            value={currentTag}
            onChangeText={setCurrentTag}
            onSubmitEditing={addTag}
          />
          <Button variant="outline" size="sm" onPress={addTag} disabled={!currentTag.trim()}>
            Add
          </Button>
        </View>
        {formData.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {formData.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" style={styles.tag}>
                <View style={styles.tagContent}>
                  <Text style={{ fontSize: 12 }}>{tag}</Text>
                  <TouchableOpacity onPress={() => removeTag(tag)} style={styles.tagRemove}>
                    <Ionicons name="close" size={12} color={colors.muted} />
                  </TouchableOpacity>
                </View>
              </Badge>
            ))}
          </View>
        )}
      </View>
    </View>
  )

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>Debate Settings</Text>
      <Text style={[styles.stepDescription, { color: colors.muted }]}>
        Configure how your debate will run and who can participate.
      </Text>

      <View style={styles.settingsContainer}>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: colors.text }]}>Duration</Text>
            <Text style={[styles.settingDescription, { color: colors.muted }]}>How long should the debate run?</Text>
          </View>
          <View style={styles.durationOptions}>
            {["1", "3", "7", "14"].map((days) => (
              <TouchableOpacity
                key={days}
                style={[
                  styles.durationButton,
                  {
                    backgroundColor: formData.duration === days ? colors.primary + "20" : colors.card,
                    borderColor: formData.duration === days ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setFormData({ ...formData, duration: days })}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.durationText, { color: formData.duration === days ? colors.primary : colors.text }]}
                >
                  {days}d
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => setFormData({ ...formData, allowAnonymous: !formData.allowAnonymous })}
          activeOpacity={0.7}
        >
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: colors.text }]}>Allow Anonymous Participation</Text>
            <Text style={[styles.settingDescription, { color: colors.muted }]}>
              Let users participate without revealing their identity
            </Text>
          </View>
          <View
            style={[
              styles.toggle,
              {
                backgroundColor: formData.allowAnonymous ? colors.primary : colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.toggleThumb,
                {
                  backgroundColor: "#FFFFFF",
                  transform: [{ translateX: formData.allowAnonymous ? 20 : 2 }],
                },
              ]}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => setFormData({ ...formData, requireVerification: !formData.requireVerification })}
          activeOpacity={0.7}
        >
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: colors.text }]}>Require Verification</Text>
            <Text style={[styles.settingDescription, { color: colors.muted }]}>
              Only allow verified users to participate
            </Text>
          </View>
          <View
            style={[
              styles.toggle,
              {
                backgroundColor: formData.requireVerification ? colors.primary : colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.toggleThumb,
                {
                  backgroundColor: "#FFFFFF",
                  transform: [{ translateX: formData.requireVerification ? 20 : 2 }],
                },
              ]}
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Preview */}
      <Card style={[styles.previewCard, { borderColor: colors.primary }]}>
        <CardHeader>
          <Text style={[styles.previewTitle, { color: colors.text }]}>Preview</Text>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary" style={{ alignSelf: "flex-start", marginBottom: 8 }}>
            {formData.category}
          </Badge>
          <Text style={[styles.previewDebateTitle, { color: colors.text }]}>{formData.title}</Text>
          <Text style={[styles.previewDescription, { color: colors.muted }]} numberOfLines={3}>
            {formData.description}
          </Text>
          <View style={styles.previewFooter}>
            <Text style={[styles.previewAuthor, { color: colors.muted }]}>by {user?.displayName}</Text>
            <Text style={[styles.previewDuration, { color: colors.muted }]}>{formData.duration} days</Text>
          </View>
        </CardContent>
      </Card>
    </View>
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Create Debate</Text>
          <View style={{ width: 24 }} />
        </View>

        {renderStepIndicator()}

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </ScrollView>

        {/* Navigation */}
        <View style={[styles.navigation, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <Button
            variant="outline"
            onPress={handlePrevious}
            disabled={currentStep === 1}
            style={{ flex: 1, marginRight: 8 }}
          >
            Previous
          </Button>
          {currentStep < totalSteps ? (
            <Button variant="primary" onPress={handleNext} style={{ flex: 1, marginLeft: 8 }}>
              Next
            </Button>
          ) : (
            <Button
              variant="primary"
              onPress={handleSubmit}
              isLoading={isSubmitting}
              style={{ flex: 1, marginLeft: 8 }}
            >
              Create Debate
            </Button>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  stepIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "600",
  },
  stepLine: {
    width: 40,
    height: 2,
    marginHorizontal: 8,
  },
  content: {
    flex: 1,
  },
  stepContent: {
    padding: 16,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  categorySection: {
    marginTop: 24,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
  },
  inputContainer: {
    marginBottom: 24,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 100,
  },
  tagInputContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-end",
  },
  tagInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  tag: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  tagContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagRemove: {
    marginLeft: 4,
    padding: 2,
  },
  settingsContainer: {
    gap: 24,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  durationOptions: {
    flexDirection: "row",
    gap: 8,
  },
  durationButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 40,
    alignItems: "center",
  },
  durationText: {
    fontSize: 14,
    fontWeight: "500",
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    position: "relative",
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: "absolute",
  },
  previewCard: {
    marginTop: 24,
    borderWidth: 1,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  previewDebateTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  previewDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  previewFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  previewAuthor: {
    fontSize: 12,
  },
  previewDuration: {
    fontSize: 12,
  },
  navigation: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
})

export default CreateDebateScreen
