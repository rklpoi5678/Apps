// (tabs)/profile.tsx
import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import { auth, db } from "@/firebaseConfig"
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User,
} from "firebase/auth"
import ProfilePage from "@/app/profile/profile-page"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"


const defaultAvatars = [
  "https://example.com/avatars/default-avatar-1.png",
  "https://example.com/avatars/default-avatar-2.png",
  "https://example.com/avatars/default-avatar-3.png",
  "https://example.com/avatars/default-avatar-4.png",
  "https://example.com/avatars/default-avatar-5.png",
  // 필요한 만큼 더 많은 아바타 URL을 추가하세요.
  // 실제 서비스에서는 Cloud Storage (Firebase Storage, AWS S3 등)에 저장된
  // 이미지의 공개 URL을 사용하는 것이 일반적입니다.
  // 예시:
  // "https://firebasestorage.googleapis.com/v0/b/your-project.appspot.com/o/avatars%2Fuser_icon_1.png?alt=media",
  // "https://firebasestorage.googleapis.com/v0/b/your-project.appspot.com/o/avatars%2Fuser_icon_2.png?alt=media",
];

// 초기 UserProfile 기본값 생성 함수
function makeNewUserProfile(uid: string, email: string) {
    const now = serverTimestamp()

    const randomIndex = Math.floor(Math.random() * defaultAvatars.length)
    const randomAvatarUrl = defaultAvatars[randomIndex]
    
    return {
      uid,
      name: email.split("@")[0],      // 이메일 앞부분을 초기 이름으로
      rank: "새싹",
      points: 0,
      bio: "",
      joinDate: new Date().toISOString(), // 혹은 serverTimestamp()를 보관할 필드로 사용
      avatar: randomAvatarUrl, // 기본 아바타 URL
      stats: {
        debatesCreated: 0,
        argumentsPosted: 0,
        votesReceived: 0,
        winRate: 0,
      },
      badges: [],
      favoriteTopics: [],
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    }
  }

export default function ProfileTab() {

  // 1) 사용자 로그인 상태
  const [initializing, setInitializing] = useState(true)
  const [user, setUser] = useState<User | null>(auth.currentUser)

  // 2) 로그인/회원가입 폼 상태
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)
  const [loadingAuth, setLoadingAuth] = useState(false)

  // 3) Firebase Auth 상태 감시
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr)
      if (initializing) setInitializing(false)
    })
    return unsubscribe
  }, [initializing])

  if (initializing) {
    // Firebase Auth 초기화 중 로딩 스피너
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    )
  }

  // 4) 로그인 및 회원가입 함수
  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      Alert.alert("알림", "이메일과 비밀번호를 입력하세요.")
      return
    }
    setLoadingAuth(true)
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)
      setEmail("")
      setPassword("")
      // onAuthStateChanged가 user 값을 업데이트해 줌 → 자동으로 ProfilePage 렌더링
    } catch (err: any) {
      console.error("로그인 실패:", err)
      Alert.alert("로그인 실패", err.message || "다시 시도해주세요.")
    } finally {
      setLoadingAuth(false)
    }
  }

  // 회원가입 함수
  const handleRegister = async () => {
    if (!email.trim() || !password) {
      Alert.alert("알림", "이메일과 비밀번호를 입력하세요.")
      return
    }
    setLoadingAuth(true)
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password)
      const newUser = cred.user
      const profileData = makeNewUserProfile(newUser.uid, newUser.email!)
      
      await setDoc(doc(db, "users", newUser.uid), profileData)
      setEmail("")
      setPassword("")
      // 가입 후 onAuthStateChanged 콜백으로 user가 세팅됨
    } catch (err: any) {
      console.error("회원가입 실패:", err)
      Alert.alert("회원가입 실패", err.message || "다시 시도해주세요.")
    } finally {
      setLoadingAuth(false)
    }
  }

  // 5) 이미 로그인이 되어 있을 때 → ProfilePage 렌더링
  if (user) {
    return <ProfilePage />
  }

  // 6) 로그인이 안 되어 있을 때 → 로그인/회원가입 폼
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
        <Text style={styles.headerText}>{isRegistering ? "회원가입" : "로그인"}</Text>

        <TextInput
          style={styles.input}
          placeholder="이메일"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {loadingAuth ? (
          <ActivityIndicator size="small" color="#3B82F6" style={{ marginTop: 16 }} />
        ) : (
          <TouchableOpacity
            style={styles.authButton}
            onPress={isRegistering ? handleRegister : handleSignIn}
          >
            <Text style={styles.authButtonText}>
              {isRegistering ? "회원가입하기" : "로그인하기"}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.toggleMode}
          onPress={() => setIsRegistering((prev) => !prev)}
        >
          <Text style={styles.toggleText}>
            {isRegistering ? "이미 계정이 있나요? 로그인" : "계정이 없으신가요? 회원가입"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    alignSelf: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    fontSize: 16,
    marginBottom: 16,
    color: "#000",
  },
  authButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 8,
  },
  authButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  toggleMode: {
    marginTop: 16,
    alignSelf: "center",
  },
  toggleText: {
    color: "#3B82F6",
    fontSize: 14,
  },
})
