import { create } from "zustand";


// 전역에서 회원가입 단계 관리

// 1. 도메인 타입 정의
// 이후 확장 가능: "agree" , "idCheck", "pwCheck", "emailAuth" , "info", "complete"
// * 참고: | 는 or 의 뜻이 아닌 유니온 문법(이 타입 또는 저 타입)
type JoinStep = 1 | 2 | 3 | 4 | 5 | 6;

// 2. 저장소 설계도 (service) -> 변수 종류, 이름, 타입 정의
type JoinStepStore = {
  step : JoinStep;
  setStep : (set:JoinStep) => void;
  resetStep : () => void;
};

// 3. 실제 구현체 (serviceImpl)
export const useJoinStepStore = create<JoinStepStore>((set) => ({
  step: 1,
  setStep: (step) => set({step}),
  resetStep: () => set({step:1})
}));