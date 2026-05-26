// npm install zustand 라이브러리 설치
import { create } from "zustand";
import type { LoginResponseDTO } from "@/features/member/types/loginDTO";
import { SESSION } from "@/config/constant";


// 세션스토리지의 데이터를 꺼내오는 함수
const getSessionData = ():LoginResponseDTO | null => {
  const sessionData = sessionStorage.getItem(SESSION.ACCESS_DATA);
  return sessionData ? JSON.parse(sessionData) : null;
};


// 타입 선언 (타입과 인터페이스의 차이: 타입은 함수,튜플,교차 등 더 다양한 표현이 가능)
type AuthType = {
  member : LoginResponseDTO | null;
  login : (data: LoginResponseDTO) => void;
  logout : () => void;
}


// 전역 상태 저장소 메서드(zustand, store=저장소)
export const zustandAuthStore = create<AuthType>((set) => ({
  // 기본값 -> 새로고침시에도 다시 값 꺼내와서 계속 유지되도록 하기 위함
  member: getSessionData(),
  
  // 로그인 성공시
  login: (data) => set({
    member: data,
  }),

  // 로그아웃시
  logout: () => set({
    member: null,
  })
}));


// 로그인 관련 커스텀 훅
// const { member, logout, isLogin } = useCustomLogin();
const useCustomLogin = () => {
  // 로그인 상태인지 확인 (zustand 전역으로 관리)
  const member = zustandAuthStore((state) => state.member);
  const login = zustandAuthStore((state) => state.login);
  const logout = zustandAuthStore((state) => state.logout);

  // 로그인 여부
  const isLogin = !!member?.accessToken;

  return {
    member,
    login,
    logout,
    isLogin
  }
}

export default useCustomLogin