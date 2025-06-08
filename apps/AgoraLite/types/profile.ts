export interface UserProfile {
  uid: string
  name: string
  rank: string
  points: number
  bio: string
  joinDate: string
  avatar: string
  stats: {
    argumentsPosted: number
    debatesCreated: number
    votesReceived: number
    winRate: number
  }
  badges: string[]
  favoriteTopics: string[]
  updatedAt: Date
  createdAt: Date
  deletedAt: Date | null
}
