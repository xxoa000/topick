// Vite 환경 기준 (CRA 환경이라면 process.env 사용)
export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  IS_PRODUCTION: import.meta.env.MODE === 'production',
} as const;

//시스템에 필수적인 환경 변수가 누락되었는지 컴파일 시점에 체크
if (!ENV.API_BASE_URL) {
  console.warn('환경 변수 VITE_API_BASE_URL이 설정되지 않았습니다');
}