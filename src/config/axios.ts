import axios from 'axios';
import { ENV } from './env';
import { API_TIMEOUT, SESSION } from '@/config/constant';
import { zustandAuthStore } from '@/hooks/useCustomLogin';

/* ** axios 인스턴스 와 인터셉터 설정 
1) axios 인스턴스(Instance)
   -> 공통설정(baseURL, headers, timeout 등)이 들어있는 axios 복사본
   -> 매 요청마다 같은 설정을 반복하지 않고 재사용하기 위해 사용

2) axios 인터셉터(Interceptor)
   -> 요청이나 응답을 가로채는 기능 (브라우저 ↔ interceptor ↔ 서버)
   -> 인스턴스별로 독립적으로 동작하므로 일반 요청과 재발급 요청 분리 운영 가능
*/

// ==========================================
// 1. 독립된 두 개의 인스턴스 정의
// ==========================================

// 🚀 일반 요청 인스턴스 (매 요청마다 자동으로 세션 ID/토큰을 챙겨감)
export const accessApiClient = axios.create({
  baseURL: ENV.API_BASE_URL, // env.ts에서 관리하는 기본 API 주소
  timeout: API_TIMEOUT,             // 5초 내에 응답 안 오면 timeout 에러 발생 (무한 로딩 방지)
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔄 재발급 전용 인스턴스 (인터셉터를 거치지 않는 무풍지대 안전 무전기)
// - 토큰 재발급 요청 시 만료된 accessToken이 헤더에 중복 탑재되어 무한 루프 도는 것을 원천 차단
export const refreshApiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true,     // 쿠키 기반 인증(RefreshToken 쿠키 전송 등)을 위한 설정
});


// ==========================================
// 2. 일반 인스턴스(accessApiClient)용 request 인터셉터
// ==========================================
accessApiClient.interceptors.request.use(
  (config) => {
    // 요청이 날아가는 바로 그 순간 세션스토리지를 뒤져서 최신 ID를 가져옴
    const member = zustandAuthStore.getState().member;
    console.log(`** [요청 인터셉터] accessApiClient, memberId=${member?.memberId}`);

    // API 요청 보내기 전, 로그인 정보(memberId)가 존재할 경우.
    // Header에 자동으로 추가하여 백엔드에서 인증할 수 있도록 함
    if (member?.accessToken) {
      config.headers.Authorization = `Bearer ${member?.accessToken}`; 
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// ==========================================
// 3. 일반 인스턴스(accessApiClient)용 response 인터셉터
// ==========================================
let isRefreshing = false; // 현재 세션 리프레시(재발급) 요청이 날아가서 진행 중인지 체크

accessApiClient.interceptors.response.use(
  (response) => response, // 성공 응답(2xx)이면 그대로 통과
  async (error) => {      // 에러 발생(4xx, 5xx) 시 가로채기 공통 처리
    
    // 디버깅을 위한 에러 로그 확인
    console.log("❌ 에러 발생 URL:", error.config?.url);
    console.log("❌ 요청 method:", error.config?.method);
    console.log("❌ 응답 status:", error.response?.status);

    const originalRequest = error.config;

    // 👉 401(세션 만료)이 발생했고, 이 요청이 '이미 재시도했던 요청'이 아니라면 실행
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // _retry 속성을 true로 만들어 한 번만 실행되도록 락(Lock)을 걺 (무한루프 예방)

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          console.log("🔄 세션 만료 감지: refreshApiClient를 통해 백엔드에 재인증을 요청합니다.");
          
          /* 💡 [토큰 재발급 로직 탑재 구역] 
             나중에 JWT 방식으로 고도화될 때 아래 주석을 풀고 백엔드 엔드포인트를 매핑하면 됩니다.
             인터셉터가 없는 refreshApiClient를 호출하므로 안전지대에서 통신합니다.
          */
          const response = await refreshApiClient.get('/auth/refresh');
          const newData = response.data;
          sessionStorage.setItem(SESSION.ACCESS_DATA, JSON.stringify(newData));
          
          // 원래 실패했던 요청의 헤더를 새 로그인 정보로 갱신한 후 다시 요청하여 살려내기
          // originalRequest.headers['X-USER-ID'] = newId;
          // return accessApiClient(originalRequest);
          
        } catch (refreshError) {
          console.log("🚨 세션 연장 실패: 완전히 만료되었거나 비정상적인 접근입니다.");
          alert("🔒 세션이 만료되었습니다. 다시 로그인 하세요.");
          sessionStorage.clear(); // 세션 비우기
          
          // 인터셉터 내부(일반 JS 환경)에서는 useNavigate()를 쓸 수 없으므로 강제 이동 처리
          window.location.replace("/login"); 
          
          // Promise를 pending(보류) 상태로 만들어 뒤이어 화면단에서 에러 폭탄이 터지는 것을 방지
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false; // 재발급 프로세스가 끝나면 상태 해제
        }
      }
    }

    // 401(세션만료) 외의 서버 공통 에러 핸들링
    if (error.response) {
      switch (error.response.status) {
        case 403:
          // 예: 남이 쓴 리뷰를 수정/삭제하려 할 때 백엔드에서 403을 뱉으면 작동
          alert('🚨 접근 권한이 없습니다. (본인이 작성한 글이 아닙니다)');
          break;
        case 404:
          alert('🔍 요청하신 데이터를 찾을 수 없습니다.');
          break;
        case 500:
          alert('💻 서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
          break;
      }
    }

    return Promise.reject(error); // 최종 반환하여 컴포넌트나 훅의 catch 블록으로 에러 전달
  }
);

// 기본값으로 가장 많이 쓰일 일반 요청용 인스턴스를 내보냅니다.
export default accessApiClient;