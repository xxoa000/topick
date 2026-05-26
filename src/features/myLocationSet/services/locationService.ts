// features/MyLocationSet/services/locationService.ts

import axios from 'axios';
import { apiCall } from './apiService'; // src/config/에 위치한 공통 apiCall 임포트
import type { KakaoAddressResponse, LocationSaveRequest } from '../types/location';

// 1. 카카오 API: 주소를 좌표로 변환
export async function getCoordsByAddress(address: string) {
  const KAKAO_KEY = "fe0df8f557406e14aa85bec86f079fc2"; // 향후 src/constants/ 에 환경변수로 분리 권장
  const url = "https://dapi.kakao.com/v2/local/search/address.json";

  try {
    const response = await axios.get<KakaoAddressResponse>(url, {
      headers: { Authorization: `KakaoAK ${KAKAO_KEY}` },
      params: { query: address },
    });

    if (response.data.documents.length > 0) {
      return response.data.documents[0];
    }
    return null;
  } catch (err: any) {
    console.error(`** Kakao API Error: ${err.message}`);
    return Promise.reject(err.response?.status || 500);
  }
}

// 2. 자바(서버) Controller: 내 위치 저장 API 호출
export async function saveMyLocationApi(requestData: LocationSaveRequest) {
  const url = '/api/myLocationSet/join';
  return await apiCall(url, 'POST', requestData, null);
}