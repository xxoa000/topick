import accessApiClient from '@/config/axios';
import type { PickRequest } from '../types/pickType';

export const pickService = {
  //사용자가 선택한 6가지 취향 데이터를 보낸 뒤, 
  //백엔드(PickController)로부터 상위 3개 추천 음식 이름 리스트를 받아오기
  recommendMenu: async (requestData: PickRequest): Promise<string[]> => {
    const response = await accessApiClient.post<string[]>('/pick/recommendMenu', requestData);
    return response.data;
  }
};