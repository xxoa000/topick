// src/features/pick/hooks/usePick.ts
import { useState } from 'react';
import type { PickRequest } from '../types/pickType';
import { PICK_QUESTIONS } from '../constants/pickConstant';
import { pickService } from '../services/pickService';

const initialForm: PickRequest = {
  foodTemp: '',
  foodExcludeCategory: [],
  foodIsSoup: '',
  foodMainIngredient: [],
  foodFlavor: [],
  foodFullness: ''
};

export const usePick = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<PickRequest>(initialForm);
  const [recommendedMenus, setRecommendedMenus] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const currentQuestion = PICK_QUESTIONS.find((q) => q.step === currentStep);

  //선택지 클릭
  const handleSelect = (value: string) => {
    if (!currentQuestion) return;

    const { pickType, isMultiple } = currentQuestion;

    setFormData((prev) => {
      if (isMultiple) {
        // [다중 선택] 값 유무 판단 후 토글 연산 (contains -> includes 수정 완료)
        const currentArray = prev[pickType] as string[];

        if(value === '없음'){
          const updatedArray = currentArray.includes('없음')?[]:['없음'];
          return {...prev, [pickType]: updatedArray};
        }
        else{
          const arrayWithoutNone = currentArray.filter((item)=>item !=='없음');

          const updatedArray = arrayWithoutNone.includes(value)
          ? arrayWithoutNone.filter((item) => item !== value) //이미 있으면 제거
          : [...arrayWithoutNone, value]; //없으면 추가

          return { ...prev, [pickType]: updatedArray };
        }
      } else {
        // [단일 선택] 덮어쓰기
        return { ...prev, [pickType]: value };
      }
    });
  };

  //다음 단계로 이동
  const handleNext = async () => {
    if (currentStep < PICK_QUESTIONS.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // 6단계 초과 완료 시점 가동
      setIsLoading(true);
      try {
        console.log('백엔드로 전송될 최종 유저 데이터:', formData);
      
        const result = await pickService.recommendMenu(formData);
        setRecommendedMenus(result);
        setCurrentStep(7);
        
      } catch (error) {
        console.error('추천 데이터 로드 실패:', error);
        alert('추천 데이터를 가져오는 도중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  //이전 단계로 이동
  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  //상태 초기화
  const handleReset = () => {
    setCurrentStep(1);
    setFormData(initialForm);
    setRecommendedMenus([]);
  };

  return {
    currentStep,
    totalSteps: PICK_QUESTIONS.length,
    currentQuestion,
    formData,
    recommendedMenus,
    isLoading,
    handleSelect,
    handleNext,
    handlePrev,
    handleReset
  };
};