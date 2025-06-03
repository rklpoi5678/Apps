"use client"

import { useState, useEffect, useRef } from "react"
import { View, Text, StyleSheet, Dimensions, Animated, StatusBar } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import MenuScreen from "./components/MenuScreen"
import GameScreen from "./components/GameScreen"
import AdManager from "./components/AdManager"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { SoundManager } from "./utils/SoundManager"
import * as SplashScreen from 'expo-splash-screen';

// 화면 크기 가져오기
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

// 게임 상태 타입 정의
export type GameState = "loading" | "menu" | "playing" | "paused" | "gameOver"

export default function App() {
  // 게임 상태 및 데이터 관리
  const [gameState, setGameState] = useState<GameState>("loading") // 현재 게임 상태
  const [score, setScore] = useState(0) // 현재 점수
  const [highScore, setHighScore] = useState(0) // 최고 점수
  const [level, setLevel] = useState(1) // 현재 레벨
  const [distance, setDistance] = useState(0) // 이동 거리
  const [soundEnabled, setSoundEnabled] = useState(true) // 사운드 활성화 여부
  const [showOpeningAd, setShowOpeningAd] = useState(true) // 오프닝 광고 표시 여부
  const [showGameOverAd, setShowGameOverAd] = useState(false) // 게임오버 광고 표시 여부

  // 사운드 매니저 인스턴스 생성
  const soundManager = useRef(new SoundManager()).current

  // 앱 초기화 효과
  useEffect(() => {
    SplashScreen.hideAsync(); // 스플래시 화면 숨기기
    initializeApp(); // 앱 초기화
    loadSavedScore(); // 저장된 점수 불러오기
  }, [])

  // 저장된 점수 불러오기 함수
  const loadSavedScore = async () => {
    try {
      const savedHighScore = await AsyncStorage.getItem("highScore")
      if (savedHighScore !== null) {
        setHighScore(parseInt(savedHighScore))
      }
    } catch (error) {
      console.log("점수 불러오기 오류:", error)
    }
  }

  // 점수 저장 함수
  const saveHighScore = async (newHighScore: number) => {
    try {
      await AsyncStorage.setItem("highScore", newHighScore.toString())
    } catch (error) {
      console.log("점수 저장 오류:", error)
    }
  }

  // 앱 초기화 함수
  const initializeApp = async () => {
    try {
      // 오디오 시스템 초기화
      await soundManager.initialize()

      // 사운드 파일 로드
      await soundManager.loadSounds()

      // 로딩 시뮬레이션 (2초 후 메뉴로 전환)
      setTimeout(() => {
        setGameState("menu")
      }, 2000)
    } catch (error) {
      console.log("앱 초기화 오류:", error)
      setGameState("menu") // 오류 발생 시 메뉴로 이동
    }
  }

  // 게임 시작 함수
  const startGame = () => {
    setGameState("playing") // 게임 상태 변경
    setScore(0) // 점수 초기화
    setLevel(1) // 레벨 초기화
    setDistance(0) // 거리 초기화
    if (soundEnabled) {
      soundManager.playBackgroundMusic() // 배경 음악 재생
    }
  }

  // 게임 오버 처리 함수
  const gameOver = () => {
    setGameState("gameOver") // 게임 상태 변경
    setShowGameOverAd(true) // 게임오버 광고 표시
    soundManager.stopBackgroundMusic() // 배경 음악 정지
    
    // 최고 점수 갱신 확인
    if (score > highScore) {
      setHighScore(score) // 최고 점수 업데이트
      saveHighScore(score) // 최고 점수 저장
      soundManager.playSound("newHighScore") // 신기록 사운드 재생
    }

    // 3초 후 메인 메뉴로 자동 복귀
    setTimeout(() => {
      setGameState("menu")
      setShowGameOverAd(false)
    }, 3000)
  }

  // 메뉴로 돌아가는 함수
  const onReturnToMenu = () => {
    setGameState("menu") // 메뉴 상태로 변경
    setShowGameOverAd(false) // 광고 숨기기
    soundManager.stopBackgroundMusic() // 배경 음악 정지
    setScore(0) // 점수 초기화
    setLevel(1) // 레벨 초기화
    setDistance(0) // 거리 초기화
  }

  // 사운드 상태 변경 함수
  const toggleSound = () => {
    const newSoundState = !soundEnabled;
    setSoundEnabled(newSoundState);
    soundManager.setSoundEnabled(newSoundState);
    
    // 사운드가 켜질 때
    if (newSoundState) {
      soundManager.playSound("achievement");
      // 게임 중일 때는 배경 음악도 재생
      if (gameState === "playing") {
        soundManager.playBackgroundMusic();
      }
    } else {
      // 사운드가 꺼질 때는 배경 음악 정지
      soundManager.stopBackgroundMusic();
    }
  };

  // 로딩 화면 렌더링
  if (gameState === "loading") {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient colors={["#87CEEB", "#98FB98"]} style={styles.loadingGradient}>
          <Text style={styles.loadingTitle}>🐵 Monkey Propel</Text>
          <Text style={styles.loadingSubtitle}>Loading...</Text>
          <Animated.View style={styles.loadingSpinner}>
            <Text style={styles.loadingEmoji}>🍌</Text>
          </Animated.View>
        </LinearGradient>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* 상태바 설정 - 밝은 테마로 설정 */}
      <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />

      {/* 오프닝 광고 컴포넌트 - 앱 시작 시 표시
      {showOpeningAd && <AdManager type="opening" onClose={() => setShowOpeningAd(false)} />}

      {/* 게임오버 광고 컴포넌트 - 게임 종료 시 표시 
      {showGameOverAd && <AdManager type="fullscreen" onClose={() => setShowGameOverAd(false)} />}

      {/* 메뉴 화면 컴포넌트 - 게임 상태가 'menu'일 때 표시 */}
      {gameState === "menu" && (
        <MenuScreen
          highScore={highScore} // 최고 점수 전달
          onStartGame={startGame} // 게임 시작 핸들러
          soundEnabled={soundEnabled} // 사운드 설정 상태
          onToggleSound={toggleSound} // 사운드 토글 핸들러
        />
      )}

      {/* 게임 화면 컴포넌트 - 게임 상태가 'playing'일 때 표시 */}
      {gameState === "playing" && (
        <GameScreen
          score={score} // 현재 점수
          setScore={setScore} // 점수 설정 함수
          level={level} // 현재 레벨
          setLevel={setLevel} // 레벨 설정 함수
          distance={distance} // 이동 거리
          setDistance={setDistance} // 거리 설정 함수
          soundEnabled={soundEnabled} // 사운드 활성화 여부
          soundManager={soundManager} // 사운드 관리자
          onGameOver={gameOver} // 게임 오버 핸들러
          onReturnToMenu={onReturnToMenu} // 메뉴로 돌아가기 핸들러
          onToggleSound={toggleSound} // 사운드 토글 핸들러
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
  },
  loadingGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingTitle: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 20,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  loadingSubtitle: {
    fontSize: 18,
    color: "#34495E",
    marginBottom: 30,
  },
  loadingSpinner: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingEmoji: {
    fontSize: 40,
  },
})
