// src/features/category/constants/categoryConstant.ts
import type { CategoryItemType } from '../types/categoryType';

export const CATEGORY_LIST: CategoryItemType[] = [
  { label: '한식', value: 'KOREAN', icon: '🍚' },
  { label: '중식', value: 'CHINESE', icon: '🥢' },
  { label: '일식', value: 'JAPANESE', icon: '🍣' },
  { label: '분식', value: 'SNACK', icon: '🍢' },
  { label: '치킨', value: 'CHICKEN', icon: '🍗' },
  { label: '피자', value: 'PIZZA', icon: '🍕' },
  { label: '패스트푸드', value: 'FASTFOOD', icon: '🍔' },
  { label: '도시락', value: 'LUNCHBOX', icon: '🍱' },
  { label: '죽', value: 'PORRIDGE', icon: '🥣' },
  { label: '뷔페', value: 'BUFFET', icon: '🍽️' },
  { label: '카페·디저트', value: 'CAFE', icon: '☕' },
];