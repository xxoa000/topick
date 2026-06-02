/**
 * 카카오 local keyword 응답의 category_name 예: "음식점 > 한식 > 육류,고기"
 * 두 번째 구간(음식 종류)을 반환합니다.
 */
export function extractFoodType(categoryName: string): string | null {
  if (!categoryName?.trim()) return null;
  const parts = categoryName
    .split('>')
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length >= 2) return parts[1];
  return null;
}
