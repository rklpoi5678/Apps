export interface UserProfile {
  uid: string
  name: string
  rank: string
  points: number
  bio: string
  joinDate: string
  avatar: string
  stats: {
    debatesCreated: number
    argumentsPosted: number
    votesReceived: number
    winRate: number
  }
  badges: string[]
  favoriteTopics: string[]
}
