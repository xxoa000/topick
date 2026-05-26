import { type KakaoMapsApi, type KakaoMap, type KakaoMarker } from './kakaoMapsApi';

const KAKAO_SDK_URL = 'https://dapi.kakao.com/v2/maps/sdk.js';

let loadPromise: Promise<void> | null = null;

type KakaoWindow = Window & { kakao?: { maps?: KakaoMapsApi; postcode?: unknown } };

function waitForKakaoMaps(win: KakaoWindow): Promise<void> {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const check = () => {
      if (win.kakao?.maps) {
        win.kakao.maps.load(() => resolve());
        return;
      }

      attempts += 1;
      if (attempts >= 40) {
        reject(new Error('카카오 지도 SDK 초기화 시간 초과'));
        return;
      }

      setTimeout(check, 50);
    };

    check();
  });
}

function appendMapsScript(appKey: string): Promise<void> {
  const win = window as KakaoWindow;

  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-kakao-maps-sdk="true"]',
    );
    if (existing) {
      waitForKakaoMaps(win).then(resolve).catch(reject);
      return;
    }

    const script = document.createElement('script');
    script.dataset.kakaoMapsSdk = 'true';
    script.src = `${KAKAO_SDK_URL}?appkey=${encodeURIComponent(appKey)}&autoload=false`;
    script.onload = () => {
      waitForKakaoMaps(win).then(resolve).catch(reject);
    };
    script.onerror = () => {
      script.remove();
      loadPromise = null;
      reject(
        new Error(
          '카카오 지도 SDK 로드 실패. Kakao Developers Web 도메인에 현재 주소(예: http://localhost:5173)가 등록되어 있는지 확인하세요.',
        ),
      );
    };
    document.head.appendChild(script);
  });
}

export function loadKakaoMaps(appKey: string): Promise<void> {
  if (!appKey.trim()) {
    return Promise.reject(
      new Error('kakao.maps.js-key가 설정되지 않았습니다. (application.properties)'),
    );
  }

  const win = window as KakaoWindow;

  if (win.kakao?.maps) {
    return waitForKakaoMaps(win);
  }

  // react-daum-postcode가 kakao.postcode만 등록한 경우 maps SDK를 별도 로드
  if (win.kakao?.postcode && !win.kakao.maps) {
    loadPromise = null;
  }

  if (!loadPromise) {
    loadPromise = appendMapsScript(appKey).catch((error) => {
      loadPromise = null;
      throw error;
    });
  }

  return loadPromise;
}

export function relayoutMap(map: KakaoMap) {
  map.relayout?.();
  requestAnimationFrame(() => map.relayout?.());
  setTimeout(() => map.relayout?.(), 300);
}

export type { KakaoMap, KakaoMarker };
