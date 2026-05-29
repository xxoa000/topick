import axios, { AxiosError } from 'axios';
import { ENV } from './env';
import { API_TIMEOUT } from '@/config/constant';
import { zustandAuthStore } from '@/hooks/useCustomLogin';

// ==========================================
// 1. 독립된 두 개의 인스턴스 정의
// ==========================================

//일반 요청 인스턴스 (매 요청마다 자동으로 Access Token을 헤더에 탑재)
export const accessApiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔄 재발급 전용 인스턴스 (인터셉터 무풍지대)
export const refreshApiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true, // 쿠키 기반 인증(Refresh Token 쿠키 전송 등) 활성화
});

// ==========================================
// 2. 토큰 재발급 중 동시 다발적 요청 제어를 위한 큐(Queue) 변수 및 타입 정의
// ==========================================
let isRefreshing = false; 

// 대기열 큐에 저장할 객체의 구조 정의
interface FailedRequest {
  resolve: (token: string | null) => void;
  reject: (error: AxiosError) => void;
}

let failedQueue: FailedRequest[] = []; 

/**
 * 대기 중인 요청들을 처리하거나 에러를 방출하는 헬퍼 함수
 * @param error 발생한 Axios 에러 객체 (성공 시 null)
 * @param token 재발급된 신규 Access Token (실패 시 null)
 */
const processQueue = (error: AxiosError | null, token: string | null = null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};


// ==========================================
// 3. 일반 인스턴스(accessApiClient)용 request 인터셉터
// ==========================================
accessApiClient.interceptors.request.use(
  (config) => {
    // Zustand 스토어에서 실시간으로 최신 멤버 상태 꺼내기
    const member = zustandAuthStore.getState().member;
    
    // API 요청 보내기 전 Access Token이 존재할 경우, Header에 Bearer 토큰 주입
    if (member?.accessToken) {
      config.headers.Authorization = `Bearer ${member?.accessToken}`; 
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// ==========================================
// 4. 일반 인스턴스(accessApiClient)용 response 인터셉터
// ==========================================
accessApiClient.interceptors.response.use(
  (response) => response, // 2xx 성공 응답은 그대로 통과
  async (error) => {      // 4xx, 5xx 에러 가로채기
    
    const originalRequest = error.config;

    // 👉 401(인증 만료) 에러 발생 시 처리
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      
      // 이미 다른 요청에 의해 토큰 재발급 프로세스가 진행 중인 경우 (동시 요청 방어)
      if (isRefreshing) {
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            // 재발급 완료된 새 토큰으로 원래 요청의 헤더를 갈아끼우고 재요청
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return accessApiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      // 첫 번째 401 에러 진입 시 실행 락(Lock) 걸기
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("🔄 Access Token 만료 감지: 토큰 재발급을 요청합니다.");
        
        // 1. refreshApiClient로 백엔드에 토큰 재발급 요청 (일반적으로 결과로 새 accessToken이 내려옴)
        const response = await refreshApiClient.post('/auth/refresh'); 
        const newAccessToken = response.data.accessToken;

        // 2. Zustand Auth 스토어의 상태 갱신
        const {member, login} = zustandAuthStore.getState();
        if (member) {
          login({
            ...member,
            accessToken : newAccessToken
          })
        }

        // 3. 대기열(Queue)에 있던 동시 요청들에게 새 토큰을 전달하며 전부 해제(resolve)
        processQueue(null, newAccessToken);

        // 4. 원래 실패했던 요청도 새 토큰으로 헤더를 교체하여 최종 생환시키기
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return accessApiClient(originalRequest);
        
      } catch (refreshError) {
        // 리프레시 토큰마저 만료되었거나 에러가 난 경우 -> 강제 로그아웃 
        console.log("🚨 세션 연장 실패: 완전히 만료되었거나 비정상적인 접근입니다.");
        
        // 에러 타입을 AxiosError로 안전하게 가드하여 큐 처리
        const axiosError = axios.isAxiosError(refreshError)
          ? refreshError
          : new AxiosError('토큰 재발급 실패');
          
        processQueue(axiosError, null); 
        
        alert("🔒 로그인 세션이 만료되었습니다. 다시 로그인해 주세요.");
        
        // 스토리지 및 세션 초기화 후 로그인 페이지로 튕구기
        sessionStorage.clear();
        window.location.replace("/member/login"); 
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false; 
      }
    }

    // 401(세션만료) 외의 서버 공통 에러 핸들링
    if (error.response) {
      switch (error.response.status) {
        case 403:
          alert('🚨 접근 권한이 없습니다.');
          break;
        case 404:
          alert('🔍 요청하신 데이터를 찾을 수 없습니다.');
          break;
        case 500:
          alert('💻 서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
          break;
      }
    }

    return Promise.reject(error);
  }
);

export default accessApiClient;