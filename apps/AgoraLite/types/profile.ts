interface UserDebateItem {
  id: number
  title: string
  category: string
  status: string
  side: "pro" | "con"
  votes: number
  comments: number
  date: string
  result: string | null
}

interface ArgumentItem {
  id: number
  debateTitle: string
  content: string
  votes: number
  side: "pro" | "con"
  date: string
}

interface VoteItem {
  id: number
  debateTitle: string
  side: "pro" | "con"
  date: string
  status: string
}

// --- 실제 데이터들 (원래 코드와 동일) ---
export const userDebates: UserDebateItem[] = [
  {
    id: 1,
    title: "Remote work is more productive than office work",
    category: "Technology",
    status: "active",
    side: "pro",
    votes: 89,
    comments: 24,
    date: "2 hours ago",
    result: null,
  },
  {
    id: 2,
    title: "AI will replace most creative jobs within 10 years",
    category: "Technology",
    status: "concluded",
    side: "con",
    votes: 156,
    comments: 31,
    date: "3 days ago",
    result: "won",
  },
  {
    id: 3,
    title: "Social media has a net negative impact on society",
    category: "Science",
    status: "concluded",
    side: "pro",
    votes: 67,
    comments: 18,
    date: "1 week ago",
    result: "lost",
  },
]

const userArguments: ArgumentItem[] = [
  {
    id: 1,
    debateTitle: "Universal Basic Income should be implemented globally",
    content:
      "The economic models supporting UBI often overlook the inflationary pressures that would result from...",
    votes: 89,
    side: "con",
    date: "1 day ago",
  },
  {
    id: 2,
    debateTitle: "Climate change is the most urgent global issue",
    content:
      "While climate change is serious, we must also address immediate humanitarian crises that affect millions...",
    votes: 67,
    side: "con",
    date: "3 days ago",
  },
]

const userVotes: VoteItem[] = [
  {
    id: 1,
    debateTitle: "Pineapple belongs on pizza",
    side: "con",
    date: "2 hours ago",
    status: "active",
  },
  {
    id: 2,
    debateTitle: "Cryptocurrency will replace traditional money",
    side: "pro",
    date: "1 day ago",
    status: "concluded",
  },
]