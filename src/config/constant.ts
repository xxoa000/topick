// 로그인 시 세션스토리지에 저장: SESSION.ACCESS_DATA / 실제 저장 이름값: accessMemberData
export const SESSION = {
  ACCESS_DATA: 'accessMemberData'
} as const;

// 세션스토리지의 데이터를 꺼내오는 함수
// 예 : const member = getSessionData();
// 이후 member.token , member.memberId, member.memberName 등 사용가능
export const getSessionData = () => {
  const sessionData = sessionStorage.getItem(SESSION.ACCESS_DATA);
  return sessionData ? JSON.parse(sessionData) : null;
};


export const API_TIMEOUT = 5000;