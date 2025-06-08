import React from 'react';
import {
  Modal,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { deleteDoc, doc } from 'firebase/firestore';
import { signOut, User } from 'firebase/auth'; // 'User' 타입으로 변경
import { auth, db } from '@/firebaseConfig'; // 경로는 실제 프로젝트에 맞게 확인

// UserProfile 타입은 Firebase의 User 타입을 사용하는 것이 일반적입니다.
// 만약 UserProfile이 User 타입과 다르다면, 해당 정의를 유지해주세요.
// 예: type UserProfile = { uid: string; email: string; /* ... */ };
// 여기서는 Firebase의 User 타입으로 가정합니다.
type UserProfile = User; // Firebase User 타입으로 가정

interface ProfileDeleteModalProps {
  visible: boolean; // 모달을 열고 닫을지 결정하는 prop
  onClose: () => void; // 모달을 닫는 함수
  userProfile: UserProfile | null; // 현재 로그인된 사용자 정보 (null 가능성 포함)
  onDeleteSuccess: () => void; // 탈퇴 성공 시 호출될 콜백 함수
}

const ProfileDeleteModal = ({
  visible,
  onClose,
  userProfile,
  onDeleteSuccess,
}: ProfileDeleteModalProps) => {

  const handleDeleteAccount = async () => {
    try {
      if (!userProfile || !userProfile.uid) { // uid가 없을 경우 처리
        Alert.alert("오류", "사용자 정보를 찾을 수 없습니다.");
        return;
      }

      // Firestore에서 사용자 문서 삭제
      const userDocRef = doc(db, "users", userProfile.uid);
      await deleteDoc(userDocRef);
      console.log("Firestore 사용자 문서 삭제 완료:", userProfile.uid);

      // Firebase 인증에서 사용자 계정 삭제 (선택적)
      // 주의: 이 부분은 클라이언트에서 직접 사용자 계정을 삭제하는 매우 강력한 기능이며,
      // Firebase 보안 규칙에 따라 사용자 본인만 자신의 계정을 삭제할 수 있도록 엄격하게 제한해야 합니다.
      // 때로는 이 기능을 백엔드(Firebase Admin SDK)에서만 처리하는 것이 더 안전할 수 있습니다.
      // 현재 로그인된 사용자의 delete() 메서드 호출
      await userProfile.delete(); // 현재 인증된 사용자 객체의 delete() 메서드 호출
      console.log("Firebase 인증 계정 삭제 완료");

      // 모든 작업 완료 후 로그아웃
      await signOut(auth);
      console.log("로그아웃 완료");

      Alert.alert("성공", "회원 탈퇴가 완료되었습니다.");
      onClose(); // 모달 닫기
      onDeleteSuccess(); // 성공 콜백 호출
    } catch (err: any) { // 에러 타입 명시
      console.error("회원 탈퇴 실패:", err);
      // Firebase 에러 코드에 따른 상세 메시지 처리
      let errorMessage = "회원 탈퇴에 실패했습니다. 다시 시도해주세요.";
      if (err.code === 'auth/requires-recent-login') {
        errorMessage = '보안상의 이유로 최근 로그인 필요합니다. 다시 로그인 후 시도해주세요.';
      }
      Alert.alert("오류", errorMessage);
    }
  };

  return (
    <Modal
      animationType="slide" // 'fade', 'none' 등
      transparent={true} // 배경을 투명하게 할지
      visible={visible} // 모달의 가시성
      onRequestClose={onClose} // 안드로이드 백 버튼 처리
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>회원 탈퇴</Text>
          <Text style={styles.modalText}>
            정말로 회원 탈퇴하시겠습니까?{"\n"}모든 데이터가 삭제되며 복구할 수 없습니다.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.textStyle}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleDeleteAccount} // 모달 내에서 탈퇴 함수 호출
            >
              <Text style={styles.textStyle}>탈퇴 확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%', // 모달 너비 조절
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    flex: 1, // 버튼들이 공간을 균등하게 차지하도록
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  confirmButton: {
    backgroundColor: '#dc3545', // 빨간색 (위험)
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ProfileDeleteModal;