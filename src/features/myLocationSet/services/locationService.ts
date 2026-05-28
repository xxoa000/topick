import axios from 'axios';
import { apiCall } from './apiService'; // src/config/에 위치한 공통 apiCall 임포트
import type { AddressItem, KakaoAddressResponse, LocationSaveRequest } from '../types/location';
import accessApiClient from '@/config/axios';

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
  const response = await accessApiClient.post<string[]>('/myLocationSet/join', requestData);
  return response.data;
}

// 3. 회원별 내 주소록 목록 조회 API 호출
export async function getMyLocationListApi(memberId: string) {
  // 백엔드 엔드포인트 설계에 맞게 URL을 수정하세요 (예: /myLocationSet/list?memberId=xxx)
  const response = await accessApiClient.get<AddressItem[]>('/myLocationSet/addresslist', {
    params: { memberId }
  });
  return response.data;
}

// 4. 기본 배송지 변경 API 호출 (addressId만 서버로 전달)
export async function changeAddressDefaultApi(addressNo: number) {
  // 💡 백엔드 Controller의 URL 매핑에 맞춰 주소를 수정해주세요. (예: @PatchMapping("/default/{addressId}"))
  const response = await accessApiClient.patch(`/myLocationSet/default/${addressNo}`);
  return response.data;
}