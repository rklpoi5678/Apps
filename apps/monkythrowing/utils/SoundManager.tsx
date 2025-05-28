import { Audio } from "expo-av"

export class SoundManager {
  private sounds: { [key: string]: Audio.Sound } = {}
  private backgroundMusic?: Audio.Sound
  private soundEnabled = true

  async initialize() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      })
    } catch (error) {
      console.log("Error initializing audio:", error)
    }
  }

  async loadSounds() {
    try {
      // Load sound effects
      const soundFiles = {
        propel: require("../assets/sounds/propel.mp3"),
        achievement: require("../assets/sounds/achievement.mp3"),
        levelComplete: require("../assets/sounds/level-complete.mp3"),
        newHighScore: require("../assets/sounds/new-high-score.mp3"),
      }

      for (const [name, source] of Object.entries(soundFiles)) {
        try {
          const { sound } = await Audio.Sound.createAsync(
            source,
            { shouldPlay: false, volume: 0.7 }
          )
          this.sounds[name] = sound
        } catch (error) {
          console.log(`Error loading sound ${name}:`, error)
        }
      }

      // Load background music
      try {
        const { sound } = await Audio.Sound.createAsync(
          require("../assets/sounds/background-music.mp3"),
          { shouldPlay: false, volume: 0.3, isLooping: true }
        )
        this.backgroundMusic = sound
      } catch (error) {
        console.log("Error loading background music:", error)
      }
    } catch (error) {
      console.log("Error in loadSounds:", error)
    }
  }

  async playSound(name: string, options: { volume?: number; rate?: number } = {}) {
    if (!this.soundEnabled || !this.sounds[name]) return

    try {
      const sound = this.sounds[name]
      await sound.setPositionAsync(0)

      if (options.volume !== undefined) {
        await sound.setVolumeAsync(options.volume)
      }

      if (options.rate !== undefined) {
        await sound.setRateAsync(options.rate, true)
      }

      await sound.playAsync()
    } catch (error) {
      console.log(`Error playing sound ${name}:`, error)
    }
  }

  async playBackgroundMusic() {
    if (!this.soundEnabled || !this.backgroundMusic) return

    try {
      await this.backgroundMusic.playAsync()
    } catch (error) {
      console.log("Error playing background music:", error)
    }
  }

  async stopBackgroundMusic() {
    if (!this.backgroundMusic) return

    try {
      await this.backgroundMusic.pauseAsync()
    } catch (error) {
      console.log("Error stopping background music:", error)
    }
  }

  setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled
    if (!enabled && this.backgroundMusic) {
      this.stopBackgroundMusic()
    }
  }

  async cleanup() {
    for (const sound of Object.values(this.sounds)) {
      try {
        await sound.unloadAsync()
      } catch (error) {
        console.log("Error unloading sound:", error)
      }
    }

    if (this.backgroundMusic) {
      try {
        await this.backgroundMusic.unloadAsync()
      } catch (error) {
        console.log("Error unloading background music:", error)
      }
    }

    this.sounds = {}
    this.backgroundMusic = undefined
  }
}
