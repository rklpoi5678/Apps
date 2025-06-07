
export interface Debate {
    id: string
    title: string
    category: string
    description: string        // (옵션) 상세 설명이 필요한 경우
    participants?: number      // 참여자 수 (추천 토론용)
    timeLeft?: string          // 남은 시간 (추천 토론용)
    votes?: number             // 찬성/반대 등 투표 수 (인기 토론용)
    likes: number             // 좋아요 수
    dislikes: number          // 싫어요 수
    comments?: number          // 댓글 수 (인기 토론용)
    author?: string            // 작성자 (인기 토론용)
    timeAgo?: string           // “몇 시간 전” (인기 토론용)
    isFeatured?: boolean       // 오늘의 추천 플래그
    trending?: boolean         // 인기 여부(트렌딩) 플래그
    createdAt: Date            // 생성일, 정렬용
    updatedAt: Date            // 수정일, 정렬용
    deletedAt?: Date           // 삭제일, 정렬용
  }
  
  export interface Comment {
    id: string
    content: string
    author: {
      name: string
      avatar: string
      username: string
    }
    createdAt: string
    likes: number
    replies?: Comment[]
  }