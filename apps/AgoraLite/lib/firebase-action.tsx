import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { getDoc, DocumentReference, DocumentData, doc, runTransaction, deleteField } from 'firebase/firestore';
import { StyleProp, TextStyle } from 'react-native';
import { Image, ImageStyle } from 'expo-image';
import { db , auth} from '@/firebaseConfig';

// 작성자 이름 가져오기 액션
const AuthorName = ({ style, authorRef }: { style?: StyleProp<TextStyle>, authorRef: DocumentReference<DocumentData, DocumentData> }) => {
  const [authorName, setAuthorName] = useState('로딩 중...');

  useEffect(() => {
    const fetchAuthorName = async () => {
      if (authorRef) {
        try {
          const userDoc = await getDoc(authorRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setAuthorName(userData.name || '이름 없음');
          } else {
            setAuthorName('사용자 없음');
          }
        } catch (error) {
          console.log('사용자 정보 불러오기 오류:', error);
          setAuthorName('오류 발생');
        }
      }
    };

    fetchAuthorName();
  }, [authorRef]);

  return <Text style={style}>작성자: {authorName}</Text>;
};

export default AuthorName;


// 작성자 아바타 가져오기 액션
export const AuthorAvatar = ({ style, authorRef }: { style?: StyleProp<ImageStyle>, authorRef: DocumentReference<DocumentData, DocumentData> }) => {
  const [authorAvatar, setAuthorAvatar] = useState('로딩 중...');

  useEffect(() => {
    const fetchAuthorAvatar = async () => {
      if (authorRef) {
        try {
          const userDoc = await getDoc(authorRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setAuthorAvatar(userData.avatar || '이름 없음');
          } else {
            setAuthorAvatar('사용자 없음');
          }
        } catch (error) {
          console.log('사용자 정보 불러오기 오류:', error);
          setAuthorAvatar('오류 발생');
        }
      }
    };

    fetchAuthorAvatar();
  }, [authorRef]);

  return <Image style={style} source={{ uri: authorAvatar }} />;
};

// 현재 사용자 ID 가져오기
function getCurrentUserId(): string | null {
  const user = auth.currentUser;
  return user?.uid || null;
}

// 투표 기능
export const onVote = async (debateId: string, voteType: 'like' | 'dislike') => {
  const userId = getCurrentUserId();
  if (!userId) {
    console.error("사용자가 로그인되지 않았습니다.");
    return;
  }

  const debateRef = doc(db, "debates", debateId);

  try {
    await runTransaction(db, async (transaction) => {
      const debateDoc = await transaction.get(debateRef);

      if (!debateDoc.exists()) {
        throw "토론이 존재하지 않습니다!";
      }

      const currentDebate = debateDoc.data();
      const currentVotes = currentDebate.votes || {};
      const currentUserVote = currentVotes[userId];

      let newLikes = currentDebate.likes || 0;
      let newDislikes = currentDebate.dislikes || 0;
      let newVoteValue; // 1은 좋아요, -1은 싫어요, 0은 투표 없음

      if (voteType === 'like') {
        if (currentUserVote === 1) { // 사용자가 이미 좋아요를 눌렀다면, 좋아요 취소
          newLikes -= 1;
          newVoteValue = null; // 투표 제거
        } else if (currentUserVote === -1) { // 사용자가 이전에 싫어요를 누르고, 지금 좋아요를 누름
          newDislikes -= 1;
          newLikes += 1;
          newVoteValue = 1;
        } else { // 사용자가 아직 투표하지 않았거나, 투표가 제거된 경우 좋아요를 누름
          newLikes += 1;
          newVoteValue = 1;
        }
      } else { // voteType === 'dislike'
        if (currentUserVote === -1) { // 사용자가 이미 싫어요를 눌렀다면, 싫어요 취소
          newDislikes -= 1;
          newVoteValue = null; // 투표 제거
        } else if (currentUserVote === 1) { // 사용자가 이전에 좋아요를 누르고, 지금 싫어요를 누름
          newLikes -= 1;
          newDislikes += 1;
          newVoteValue = -1;
        } else { // 사용자가 아직 투표하지 않았거나, 투표가 제거된 경우 싫어요를 누름
          newDislikes += 1;
          newVoteValue = -1;
        }
      }

      const updatedFields: { [key: string]: any } = {
        likes: newLikes,
        dislikes: newDislikes,
      };

      if (newVoteValue === null) {
        // If the vote is removed, use deleteField()
        updatedFields[`votes.${userId}`] = deleteField();
      } else {
        updatedFields[`votes.${userId}`] = newVoteValue;
      }

      transaction.update(debateRef, updatedFields);
    });

    console.log("투표가 성공적으로 업데이트되었습니다!");
    // 여기서 로컬 상태를 업데이트(setDebate)하거나
    // 트랜잭션 로직을 기반으로 낙관적으로 업데이트할 수도 있습니다.
  } catch (e) {
    console.error("투표 실패: ", e);
  }
};



// Firestore Timestamp를 JS Date로 변환하는 헬퍼 1
export function dateToFirestoreTimestamp(date: Date): { seconds: number; nanoseconds: number } {
  const seconds = Math.floor(date.getTime() / 1000);
  const nanoseconds = (date.getTime() % 1000) * 1_000_000;
  return { seconds, nanoseconds };
}

// Type guard for Firestore Timestamp 2
export function isFirestoreTimestamp(obj: any): obj is { seconds: number; nanoseconds: number } {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.seconds === 'number' &&
    typeof obj.nanoseconds === 'number'
  );
}

// Firestore Timestamp를 JS Date로 변환하는 헬퍼 3
export const formatDate = (ts: { seconds: number; nanoseconds: number }) => {
    const date = new Date(ts.seconds * 1000 + ts.nanoseconds / 1000000)
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
}