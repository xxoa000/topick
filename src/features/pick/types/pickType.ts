// src/features/pick/types/pickType.ts

// 1. 백엔드 전송용 DTO 구조 규격
export interface PickRequest {
  [key: string]: string | string[];
  
  foodTemp: string;                 // 'HOT' | 'COLD'
  foodExcludeCategory: string[];    // ['한식', '중식' ...]
  foodIsSoup: string;               // 'Y' | 'N'
  foodMainIngredient: string[];     // ['곡류', '육류/해산물' ...]
  foodFlavor: string[];             // ['매콤', '달콤' ...]
  foodFullness: string;             // '든든함' | '가벼움'
}

// 2. 단일 선택지 문항 구조 타입
export interface ChoiceItem {
  label: string; // 화면에 보여줄 친절한 문구
  value: string; // 백엔드 DB와 통신할 실제 키값
}

// 3. 단계별 질문지 뼈대 타입 정의
export interface QuestionStep {
  step: number;
  pickType: keyof PickRequest;      // PickRequest의 Key값만 입력 가능하도록 제한
  question: string;
  isMultiple: boolean;              // 다중 선택(체크박스 스타일) 여부
  choices: ChoiceItem[];
}