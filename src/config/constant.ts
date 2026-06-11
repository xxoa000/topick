// 로그인 시 세션스토리지에 저장: SESSION.ACCESS_DATA / 실제 저장 이름값: accessMemberData
export const SESSION = {
  ACCESS_DATA: 'accessMemberData'
} as const;

export const API_TIMEOUT = 5000;

// 미완성
export const ERROR_CODE = {
  MEMBER_ID_EXIST: "MEMBER_ID_EXIST",
  MEMBER_EMAIL_EXIST: "MEMBER_EMAIL_EXIST",
  MEMBER_PHONE_EXIST: "MEMBER_PHONE_EXIST",
  LOGIN_FAILED : "LOGIN_FAILED",
} as const;
