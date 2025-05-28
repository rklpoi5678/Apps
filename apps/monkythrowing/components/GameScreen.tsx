"use client"

import { useState, useEffect, useRef } from "react"
import { View, Text, StyleSheet, Dimensions, Animated, PanResponder, Button, TouchableOpacity, Modal } from "react-native"
import { Accelerometer } from "expo-sensors"
import { LinearGradient } from "expo-linear-gradient"
import type { SoundManager } from "../utils/SoundManager"
import ParticleSystem from "./ParticleSystem"

// 화면 크기 및 게임 상수 정의
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")
const MONKEY_SIZE = 60 // 원숭이 크기
const BASE_TARGET_DISTANCE = SCREEN_WIDTH * 3 // 기본 목표 거리
const BASE_TIME_LIMIT = 120 // 기본 제한 시간
const BASE_FORCE_MULTIPLIER = 2 // 기본 힘 곱수

// 게임 스크린 프로퍼티 인터페이스
interface GameScreenProps {
  score: number // 현재 점수
  setScore: (score: number | ((prev: number) => number)) => void // 점수 설정 함수
  level: number // 현재 레벨
  setLevel: (level: number | ((prev: number) => number)) => void // 레벨 설정 함수
  distance: number // 이동 거리
  setDistance: (distance: number) => void // 거리 설정 함수
  soundEnabled: boolean // 사운드 활성화 여부
  soundManager: SoundManager // 사운드 관리자
  onGameOver: () => void // 게임 오버 핸들러
  onReturnToMenu: () => void // 메뉴로 돌아가기 핸들러
  onToggleSound: () => void // 음성 설정 토글 함수 추가
}

// 난이도 계산 함수
const calculateDifficulty = (level: number) => {
  return {
    targetDistance: BASE_TARGET_DISTANCE * (1 + (level - 1) * 0.5),
    timeLimit: Math.max(BASE_TIME_LIMIT - (level - 1) * 10, 60),
    forceMultiplier: Math.max(BASE_FORCE_MULTIPLIER - (level - 1) * 0.2, 1),
    obstacleCount: Math.min(level - 1, 5),
  }
}

export default function GameScreen({
  score,
  setScore,
  level,
  setLevel,
  distance,
  setDistance,
  soundEnabled,
  soundManager,
  onGameOver,
  onReturnToMenu,
  onToggleSound, // 새로운 prop 추가
}: GameScreenProps) {
  // 상태 관리
  const [forceIndicator, setForceIndicator] = useState(0) // 힘 지시기 상태
  const [showParticles, setShowParticles] = useState(false) // 파티클 표시 상태
  const [gameTime, setGameTime] = useState(0) // 게임 시간 상태
  const [showMenuModal, setShowMenuModal] = useState(false)

  // 애니메이션 값
  const monkeyPosition = useRef(new Animated.ValueXY({ x: 50, y: SCREEN_HEIGHT / 2 - 100 })).current // 원숭이 위치
  const forceAnimation = useRef(new Animated.Value(0)).current // 힘 애니메이션
  const shakeThreshold = 1.5 // 흔들기 감지 임계값

  // 난이도 계산
  const difficulty = calculateDifficulty(level)
  const TARGET_DISTANCE = difficulty.targetDistance

  // 게임 타이머 설정
  useEffect(() => {
    const timer = setInterval(() => {
      setGameTime((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // 가속도계 설정 (기기 흔들기 감지)
  useEffect(() => {
    Accelerometer.setUpdateInterval(100)
    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      const acceleration = Math.sqrt(x * x + y * y + z * z)
      if (acceleration > shakeThreshold) {
        const force = Math.min((acceleration - shakeThreshold) * 2, 5)
        propelMonkey(force, "shake")
      }
    })

    return () => subscription.remove()
  }, [])

  // 스와이프 제스처 처리 (터치 이벤트 핸들러)
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => {
      // 메뉴 버튼 영역을 제외한 영역에서만 PanResponder 활성화
      const menuButtonArea = {
        x: SCREEN_WIDTH - 100, // 메뉴 버튼의 대략적인 x 위치
        y: 50, // 메뉴 버튼의 대략적인 y 위치
        width: 80, // 메뉴 버튼의 대략적인 너비
        height: 40, // 메뉴 버튼의 대략적인 높이
      };

      const touchX = evt.nativeEvent.locationX;
      const touchY = evt.nativeEvent.locationY;

      // 메뉴 버튼 영역을 터치한 경우 PanResponder 비활성화
      if (
        touchX >= menuButtonArea.x &&
        touchX <= menuButtonArea.x + menuButtonArea.width &&
        touchY >= menuButtonArea.y &&
        touchY <= menuButtonArea.y + menuButtonArea.height
      ) {
        return false;
      }

      return true;
    },
    onMoveShouldSetPanResponder: () => true,
    onPanResponderRelease: (evt, gestureState) => {
      const { dx, dy } = gestureState;
      const swipeDistance = Math.sqrt(dx * dx + dy * dy);
      const swipeVelocity = Math.sqrt(gestureState.vx * gestureState.vx + gestureState.vy * gestureState.vy);

      if (swipeDistance > 50) {
        const force = Math.min(swipeVelocity * 2, 5);
        propelMonkey(force, "swipe");
      }
    },
  });

  // 원숭이를 발사하는 함수
  const propelMonkey = async (force: number, type: "shake" | "swipe") => {
    // 시각적 효과
    setForceIndicator(force)
    setShowParticles(true)

    // 사운드 효과
    if (soundEnabled) {
      await soundManager.playSound("propel", { volume: Math.min(force / 5, 1) })
      if (force > 3) {
        setTimeout(() => soundManager.playSound("achievement"), 200)
      }
    }

    // 힘 애니메이션 처리
    Animated.sequence([
      Animated.timing(forceAnimation, {
        toValue: force,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(forceAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()

    // 난이도가 적용된 이동 거리 계산
    const moveDistance = force * 100 * difficulty.forceMultiplier
    const newX = Math.min(distance + moveDistance, TARGET_DISTANCE)

    // 원숭이 이동 애니메이션
    Animated.timing(monkeyPosition, {
      toValue: {
        x: 50 + (newX / TARGET_DISTANCE) * (SCREEN_WIDTH - 100),
        y: SCREEN_HEIGHT / 2 - 100 + Math.sin(Date.now() / 200) * 20,
      },
      duration: 500,
      useNativeDriver: true,
    }).start()

    // 상태 업데이트
    setDistance(newX)
    setScore((prev) => prev + Math.floor(force * 10))

    // 파티클 숨기기
    setTimeout(() => setShowParticles(false), 1000)

    // 레벨 클리어 조건 확인
    if (newX >= TARGET_DISTANCE) {
      winLevel()
    }

    // 게임 오버 조건 확인 (시간 초과)
    if (gameTime > difficulty.timeLimit) {
      onGameOver()
    }
  }

  // 레벨 클리어 처리 함수
  const winLevel = async () => {
    if (soundEnabled) {
      await soundManager.playSound("levelComplete")
    }

    // 레벨 업 및 상태 초기화
    setLevel((prev) => prev + 1)
    setDistance(0)
    monkeyPosition.setValue({ x: 50, y: SCREEN_HEIGHT / 2 - 100 })

    // 성과 사운드 재생
    setTimeout(() => {
      if (soundEnabled) {
        soundManager.playSound("achievement")
      }
    }, 500)
  }

  // 진행률 계산
  const progressPercentage = (distance / TARGET_DISTANCE) * 100

  return (
    <View style={styles.container}>
      {/* 메뉴 버튼 - PanResponder 밖으로 분리 */}
      <TouchableOpacity 
        style={styles.menuButton}
        onPress={() => {
          if (soundEnabled) {
            soundManager.playSound("achievement");
          }
          setShowMenuModal(true);
        }}
        activeOpacity={0.7}
      >
        <Text style={styles.menuButtonText}>Menu</Text>
      </TouchableOpacity>

      {/* 게임 영역 - PanResponder 적용 */}
      <View style={styles.gameContainer} {...panResponder.panHandlers}>
        <LinearGradient colors={["#87CEEB", "#98FB98"]} style={styles.background}>
          {/* 게임 UI 영역 - 점수, 레벨, 시간 표시 */}
          <View style={styles.gameUI}>
            <View style={styles.leftUI}>
              <Text style={styles.scoreText}>Score: {score.toLocaleString()}</Text>
              <Text style={styles.levelText}>Level: {level}</Text>
              <Text style={styles.timeText}>
                Time: {Math.floor(gameTime / 60)}:{(gameTime % 60).toString().padStart(2, "0")}
              </Text>
            </View>
          </View>

          {/* 진행률 바 - 게임 진행 상태 표시 */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <LinearGradient
                colors={["#FF6B6B", "#FF8E53", "#4ECDC4"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressFill, { width: `${progressPercentage}%` }]}
              />
            </View>
            <Text style={styles.progressText}>{Math.floor(progressPercentage)}%</Text>
          </View>

          {/* 힘 지시기 애니메이션 - 사용자 입력 강도 표시 */}
          <Animated.View
            style={[
              styles.forceIndicator,
              {
                opacity: forceAnimation.interpolate({
                  inputRange: [0, 5],
                  outputRange: [0, 1],
                }),
                transform: [
                  {
                    scale: forceAnimation.interpolate({
                      inputRange: [0, 5],
                      outputRange: [0.5, 2],
                    }),
                  },
                  { translateX: SCREEN_WIDTH / 2 - 25 },
                  { translateY: SCREEN_HEIGHT / 2 - 150 }
                ],
              },
            ]}
          >
            <Text style={styles.forceText}>💥</Text>
          </Animated.View>

          {/* 파티클 시스템 - 효과 표시 */}
          {showParticles && <ParticleSystem />}

          {/* 게임 플레이 영역 */}
          <View style={styles.gameArea}>
            {/* 지면 그라데이션 */}
            <LinearGradient colors={["#228B22", "#32CD32"]} style={styles.ground} />

            {/* 환경 요소 - 나무들 */}
            {[...Array(8)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.tree,
                  {
                    transform: [
                      { translateX: (i + 1) * (SCREEN_WIDTH / 9) }
                    ],
                    height: 60 + Math.random() * 40,
                  },
                ]}
              >
                <Text style={styles.treeEmoji}>🌳</Text>
              </View>
            ))}

            {/* 구름 애니메이션 */}
            {[...Array(3)].map((_, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.cloud,
                  {
                    transform: [
                      { translateX: i * (SCREEN_WIDTH / 2) },
                      { translateY: 50 + i * 30 }
                    ]
                  },
                ]}
              >
                <Text style={styles.cloudEmoji}>☁️</Text>
              </Animated.View>
            ))}

            {/* 결승선 표시 */}
            <View style={[styles.finishLine, { transform: [{ translateX: SCREEN_WIDTH - 50 }] }]}>
              <Text style={styles.finishText}>🏁</Text>
            </View>

            {/* 원숭이 캐릭터 */}
            <Animated.View
              style={[
                styles.monkey,
                {
                  transform: [
                    { translateX: monkeyPosition.x },
                    { translateY: monkeyPosition.y }
                  ]
                },
              ]}
            >
              <Text style={styles.monkeyEmoji}>🐵</Text>
            </Animated.View>
          </View>

          {/* 게임 조작 방법 안내 */}
          <View style={styles.instructions}>
            <Text style={styles.instructionText}>📱 Shake your phone or swipe to propel the monkey!</Text>
          </View>


          <View style={styles.difficultyInfo}>
            <Text style={styles.difficultyText}>
              Goal: {Math.floor(TARGET_DISTANCE / 100)}m / Time limit: {difficulty.timeLimit}sec
            </Text>
          </View>
        </LinearGradient>
      </View>

      {/* 메뉴 모달 */}
      <Modal
        visible={showMenuModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMenuModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Game Menu</Text>
            
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => {
                setShowMenuModal(false);
                onReturnToMenu();
              }}
            >
              <Text style={styles.modalButtonText}>Main Menu</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.modalButton, styles.soundButton]}
              onPress={() => {
                onToggleSound(); // 음성 설정 토글 함수 호출
                if (!soundEnabled) {
                  soundManager.playSound("achievement"); // 음성을 켤 때 효과음 재생
                }
                setShowMenuModal(false);
              }}
            >
              <Text style={styles.modalButtonText}>
                {soundEnabled ? "Sound Off" : "Sound On"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.modalButton, styles.closeButton]}
              onPress={() => setShowMenuModal(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  gameContainer: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  gameUI: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    zIndex: 1000,
    position: "relative",
  },
  leftUI: {
    flex: 1,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3E50",
    textShadowColor: "rgba(255,255,255,0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  levelText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3E50",
    textShadowColor: "rgba(255,255,255,0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  timeText: {
    fontSize: 14,
    color: "#E74C3C",
    fontWeight: "bold",
  },
  menuButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: "#E74C3C",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1000,
    minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  menuButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  progressBar: {
    flex: 1,
    height: 25,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 10,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
  },
  progressFill: {
    height: "100%",
  },
  progressText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3E50",
    minWidth: 40,
    textShadowColor: "rgba(255,255,255,0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  forceIndicator: {
    position: "absolute",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  forceText: {
    fontSize: 30,
  },
  gameArea: {
    flex: 1,
    position: "relative",
  },
  ground: {
    position: "absolute",
    bottom: 60,
    left: 0,
    right: 0,
    height: 80,
  },
  tree: {
    position: "absolute",
    bottom: 140,
    width: 30,
    justifyContent: "flex-end",
    alignItems: "center",
    zIndex: 4,
  },
  treeEmoji: {
    fontSize: 25,
  },
  cloud: {
    position: "absolute",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  cloudEmoji: {
    fontSize: 30,
  },
  finishLine: {
    position: "absolute",
    bottom: 140,
    width: 40,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  finishText: {
    fontSize: 35,
  },
  monkey: {
    position: "absolute",
    width: MONKEY_SIZE,
    height: MONKEY_SIZE,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
  },
  monkeyEmoji: {
    fontSize: 45,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  instructions: {
    padding: 15,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    marginHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  instructionText: {
    textAlign: "center",
    fontSize: 14,
    color: "#2C3E50",
    fontWeight: "500",
  },
  difficultyInfo: {
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 8,
    marginHorizontal: 10,
    marginBottom: 5,
  },
  difficultyText: {
    color: "white",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '80%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2C3E50',
  },
  modalButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginVertical: 8,
    width: '100%',
    alignItems: 'center',
  },
  soundButton: {
    backgroundColor: '#2ecc71',
  },
  closeButton: {
    backgroundColor: '#e74c3c',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
