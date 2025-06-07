import { collection, query, where, orderBy, getDocs, limit, QueryDocumentSnapshot, DocumentData, startAfter, Query } from "firebase/firestore"
import { db } from "@/firebaseConfig"
import type { Debate } from "@/types/home"

// 오늘의 추천 토론 가져오기 (페이징 지원)
export async function fetchFeaturedDebates() {
    const q = query(
      collection(db, "debates"),
      where("isFeatured", "==", true),
      orderBy("createdAt", "desc"), // 최신 추천 순으로 정렬
      limit(10)
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ ...(doc.data() as Debate),id: doc.id }))
  }

// 인기 토론 가져오기 (페이징 지원)
export async function fetchTrendingDebates() {
    const q = query(
      collection(db, "debates"),
      where("trending", "==", true),
      orderBy("votes", "desc"), // 투표 수 많은 순으로 정렬
      limit(20)
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ ...(doc.data() as Debate),id: doc.id }))
  }
  

// 마지막으로 받은 문서 스냅샷 타입
export type LastDoc = QueryDocumentSnapshot<DocumentData> | null

// 전체 토론 목록 보기 (필터 + 페이징 처리)
export async function fetchAllDebates(
  categoryFilter?: string,
  lastDoc: LastDoc = null
) {
  let qRef: Query<DocumentData> = collection(db, "debates")

  if (categoryFilter && categoryFilter !== "전체") {
    qRef = query(qRef, where("category", "==", categoryFilter))
  }
  // 기본 정렬 및 limit 20
  let q = query(qRef, orderBy("createdAt", "desc"), limit(20))

  // 마지막 문서가 넘어오면 startAfter 적용
  if (lastDoc) {
    q = query(qRef, orderBy("createdAt", "desc"), startAfter(lastDoc), limit(20))
  }

  const snapshot = await getDocs(q)
  const debates = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      title: data.title,
      category: data.category,
      description: data.description,
      likes: data.likes,
      dislikes: data.dislikes,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt),
      deletedAt: data.deletedAt?.toDate ? data.deletedAt.toDate() : undefined,
      // Ensure author is string only
      author: typeof data.author === 'object' && data.author?.id ? data.author.id : (typeof data.author === 'string' ? data.author : ''),
      // Ensure participants is number
      participants: typeof data.participants === 'number' ? data.participants : 0,
      // Ensure votes/comments are numbers
      votes: typeof data.votes === 'number' ? data.votes : 0,
      comments: typeof data.comments === 'number' ? data.comments : 0,
      // Defensive: timeAgo as string
      timeAgo: typeof data.timeAgo === 'string' ? data.timeAgo : '',
    }
  })
  // 다음 페이지를 위해 마지막 문서 스냅샷 반환
  const nextLastDoc = snapshot.docs[snapshot.docs.length - 1] || null

  return { debates, nextLastDoc }
}