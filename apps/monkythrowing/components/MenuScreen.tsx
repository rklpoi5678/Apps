"use client"

// 리액트 및 애니메이션 관련 라이브러리 임포트
import { useState, useEffect, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Video, ResizeMode } from "expo-av"
import React from "react"

// 메뉴 스크린 프로퍼티 인터페이스 정의
interface MenuScreenProps {
  highScore: number // 최고 점수
  onStartGame: () => void // 게임 시작 핸들러
  soundEnabled: boolean // 사운드 활성화 상태
  onToggleSound: () => void // 사운드 토글 핸들러
}

// 메인 메뉴 스크린 컴포넌트
export default function MenuScreen({ highScore, onStartGame, soundEnabled, onToggleSound }: MenuScreenProps) {
  // 상태 관리
  const [showSettings, setShowSettings] = useState(false) // 설정 패널 표시 상태
  const fadeAnim = useRef(new Animated.Value(0)).current // 페이드 애니메이션 값
  const scaleAnim = useRef(new Animated.Value(0.8)).current // 스케일 애니메이션 값
  const bounceAnim = useRef(new Animated.Value(0)).current // 바운스 애니메이션 값

  // 애니메이션 효과 설정
  useEffect(() => {
    // 진입 애니메이션 (페이드 인 + 스케일)
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start()

    // 원숭이 지속적인 바운스 애니메이션
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start()
  }, [])

  // UI 렌더링
  return (
    <LinearGradient colors={["#4A90E2", "#87CEEB", "#98FB98"]} style={styles.container}>
      {/* 배경 비디오 */}
      <Video
        source={{ uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" }}
        style={styles.backgroundVideo}
        shouldPlay
        isLooping
        isMuted
        resizeMode={ResizeMode.COVER}
      />

      {/* 오버레이 (어두운 필터) */}
      <View style={styles.overlay} />

      {/* 메인 컨텐츠 (애니메이션 적용) */}
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        {/* 타이틀 섹션 */}
        <View style={styles.titleSection}>
          <Animated.View style={[styles.monkeyContainer, { transform: [{ translateY: bounceAnim }] }]}>
            <Text style={styles.monkeyEmoji}>🐵</Text>
          </Animated.View>
          <Text style={styles.title}>Monkey Propel</Text>
          <Text style={styles.subtitle}>Adventure Awaits!</Text>
        </View>

        {/* 스탯 섹션 (최고 점수 표시) */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>High Score</Text>
            <Text style={styles.statValue}>{highScore.toLocaleString()}</Text>
          </View>
        </View>

        {/* 메뉴 버튼 섹션 */}
        <View style={styles.menuButtons}>
          {/* 게임 시작 버튼 */}
          <TouchableOpacity style={[styles.button, styles.playButton]} onPress={onStartGame}>
            <LinearGradient colors={["#FF6B6B", "#FF8E53"]} style={styles.buttonGradient}>
              <Text style={styles.buttonText}>🚀 Start Adventure</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* 설정 버튼 */}
          <TouchableOpacity
            style={[styles.button, styles.settingsButton]}
            onPress={() => setShowSettings(!showSettings)}
          >
            <LinearGradient colors={["#4ECDC4", "#44A08D"]} style={styles.buttonGradient}>
              <Text style={styles.buttonText}>⚙️ Settings</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* 설정 패널 (토글 가능) */}
        {showSettings && (
          <>
            <TouchableOpacity 
              style={StyleSheet.absoluteFill} 
              activeOpacity={1}
              onPress={() => setShowSettings(false)}
            />
            <Animated.View style={styles.settingsPanel}>
              <Text style={styles.settingsTitle}>Settings</Text>
              <TouchableOpacity style={styles.settingItem} onPress={onToggleSound}>
                <Text style={styles.settingLabel}>Sound Effects</Text>
                <Text style={styles.settingValue}>{soundEnabled ? "🔊 ON" : "🔇 OFF"}</Text>
              </TouchableOpacity>
            </Animated.View>
          </>
        )}

        {/* 푸터 (게임 방법 안내) */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Shake or swipe to propel your monkey!</Text>
        </View>
      </Animated.View>
    </LinearGradient>
  )
}

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    opacity: 0.3,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  titleSection: {
    alignItems: "center",
    marginTop: 40,
  },
  monkeyContainer: {
    marginBottom: 20,
  },
  monkeyEmoji: {
    fontSize: 80,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: "#F0F8FF",
    textAlign: "center",
    fontStyle: "italic",
  },
  statsSection: {
    width: "100%",
    alignItems: "center",
  },
  statCard: {
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  statLabel: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF6B6B",
  },
  menuButtons: {
    width: "100%",
    alignItems: "center",
    gap: 20,
  },
  button: {
    width: "80%",
    height: 60,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  playButton: {},
  settingsButton: {},
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  settingsPanel: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    position: "absolute",
    top: "50%",
    left: "5%",
    transform: [{ translateY: -150 }],
    zIndex: 1000,
  },
  settingsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  settingsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  settingLabel: {
    fontSize: 18,
    color: "#333",
  },
  settingValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4ECDC4",
  },
  footer: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 16,
    color: "#F0F8FF",
    textAlign: "center",
    fontStyle: "italic",
  },
})
