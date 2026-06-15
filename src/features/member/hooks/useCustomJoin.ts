import { create } from "zustand";
import type { JoinStepState } from "../types/joinDTO";

//실제 구현체 (serviceImpl)



// 전역에서 회원가입 단계 관리
export const zustandJoinStepStore = create<JoinStepState>((set) => ({
  isCheck : false,
  setIsCheck: (checked) => set({ isCheck: checked }),
  
  step: 1,
  setStep: (step) => set({ step }),

  resetState: () => set({
    step: 1,
    isCheck : false
    })
  }));

// Join custom hook (controller)
export const useCustomJoin = () => {
  const isCheck = zustandJoinStepStore((state) => state.isCheck);
  const setIsCheck = zustandJoinStepStore((state) => state.setIsCheck);

  const step = zustandJoinStepStore((state) => state.step);
  const setStep = zustandJoinStepStore((state) => state.setStep);
  const resetState = zustandJoinStepStore((state) => state.resetState);

  return {
    isCheck,
    setIsCheck,

    step,
    setStep,
    resetState
  };
}