import type { AddressItem,  LocationSaveRequest } from '../types/location';
import accessApiClient from '@/config/axios';
import { zustandAuthStore } from '@/hooks/useCustomLogin';
import { SESSION } from '@/config/constant';

//  자바(서버) Controller: 내 위치 저장 API 호출
export async function saveMyLocationApi(requestData: LocationSaveRequest) {
  const response = await accessApiClient.post<string[]>('/myLocationSet/join', requestData);
  return response.data;
}

// 회원별 내 주소록 목록 조회 API 호출
export async function getMyLocationListApi(memberId: string) {
  const response = await accessApiClient.get<AddressItem[]>('/myLocationSet/addresslist', {
    params: { memberId }
  });
  return response.data;
}

// 내 주소록 삭제 API 호출
export async function deleteMyLocationApi(addressNo: number) {
  const response = await accessApiClient.delete<String>(`/myLocationSet/delete/${addressNo}`);
  return response.data;
}

// 기본 배송지 변경 API 호출 (addressNo만 서버로 전달)
export async function changeAddressDefaultApi(addressNo: number) {
  const response = await accessApiClient.patch(`/myLocationSet/default/${addressNo}`);
  const { member } = zustandAuthStore.getState();
  const newMemberData = {
    ...member!,
    addressX: response.data.addressX, 
    addressY: response.data.addressY
  };
  sessionStorage.setItem(
    SESSION.ACCESS_DATA,
    JSON.stringify(newMemberData)
  );
  zustandAuthStore.setState({
    member: newMemberData,
  });
  return response.data;
}