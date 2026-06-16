// src/features/category/types/categoryType.ts

export interface CategoryItemType {
  label: string; // 화면에 표시될 이름 (ex. 한식)
  value: string; // 서버 통신이나 내부 로직용 영문 코드 (예: 'KOREAN')
  icon: string;  // 표시할 이모지 또는 이미지 파일 경로
}