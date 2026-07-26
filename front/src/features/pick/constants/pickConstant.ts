// src/features/pick/constants/pickConstant.ts
import type { QuestionStep } from '../types/pickType';

export const PICK_QUESTIONS: QuestionStep[] = [
  {
    step: 1,
    pickType: 'foodTemp',
    question: '어떤 온도의 음식을 원하시나요?',
    isMultiple: false,
    choices: [
      { label: '🔥 뜨겁고 따뜻한 음식', value: 'HOT' },
      { label: '❄️ 시원하고 차가운 음식', value: 'COLD' }
    ]
  },
  {
    step: 2,
    pickType: 'foodExcludeCategory',
    question: '제외하고 싶은 카테고리가 있나요? (다중 선택 가능)',
    isMultiple: true,
    choices: [
      { label: '한식', value: '한식' },
      { label: '중식', value: '중식' },
      { label: '일식', value: '일식' },
      { label: '양식', value: '양식' },
      { label: '분식', value: '분식' },
      { label: '샌드위치/샐러드', value: '샌드위치/샐러드' },
      { label: '디저트', value: '디저트' },
      { label: '없음', value: '없음' }
    ]
  },
  {
    step: 3,
    pickType: 'foodFlavor',
    question: '오늘, 어떤 맛이 당기시나요? (다중 선택 가능)',
    isMultiple: true,
    choices: [
      { label: '🌶️ 매운 음식 좋아해요!', value: '매콤' },
      { label: '🍯 달달한 게 당겨요', value: '달콤' },
      { label: '🧂 짭조름한 맛!', value: '짭짤' },
      { label: '🍲 자극적이지 않고 담백한 맛', value: '담백' }
    ]
  },
  {
    step: 4,
    pickType: 'foodIsSoup',
    question: '국물이 있는 음식을 원하시나요?',
    isMultiple: false,
    choices: [
      { label: '🥣 국물 요리 필수!', value: 'Y' },
      { label: '🙅 국물 없는 요리요', value: 'N' }
    ]
  },
  {
    step: 5,
    pickType: 'foodMainIngredient',
    question: '어떤 재료가 좋으신가요? (다중 선택 가능)',
    isMultiple: true,
    choices: [
      { label: '🌾 밥/면 등 곡류', value: '곡류' },
      { label: '🍖 고기/물고기 등 육류 및 해산물', value: '육류/해산물' },
      { label: '🥗 야채/과일 류', value: '채소/과일류' },
      { label: '🧀 치즈/우유 등 유제품류', value: '유제품류' }
    ]
  },
  {
    step: 6,
    pickType: 'foodFullness',
    question: '포만감은 어느 정도가 좋으신가요?',
    isMultiple: false,
    choices: [
      { label: '🐷 배부르게 든든함!', value: '든든함' },
      { label: '🏃 가볍고 산뜻함', value: '가벼움' }
    ]
  }
];