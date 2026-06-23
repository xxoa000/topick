import { publicApiClient } from '@/config/axios';
import type { StoreRequest } from '../../store/types';
import type {
  FilterRequest,
  KakaoMapsConfig,
  KeywordRequest,
  Menu,
  SearchResponse,
  Tag,
} from '../types';

export const searchByKeyword = async (
  body: KeywordRequest,
): Promise<SearchResponse> => {
  const { data } = await publicApiClient.post<SearchResponse>('/keyword', body);
  return data;
};

export const searchByFilter = async (
  body: FilterRequest,
): Promise<SearchResponse> => {
  const { data } = await publicApiClient.post<SearchResponse>('/filter', body);
  return data;
};

export const fetchTags = async (): Promise<Tag[]> => {
  const { data } = await publicApiClient.get<Tag[]>('/tag');
  return data;
};

export const fetchStoreMenus = async (body: StoreRequest): Promise<Menu[]> => {
  const { data } = await publicApiClient.post<Menu[]>('/filter/menu/store', body);
  return data;
};

export const fetchKakaoMapsJsKey = async (): Promise<string> => {
  const { data } = await publicApiClient.get<KakaoMapsConfig>(
    '/filter/kakao-maps-js-key',
  );
  if (!data.jsKey?.trim()) {
    throw new Error(
      'kakao.maps.js-key가 application.properties에 설정되지 않았습니다.',
    );
  }
  return data.jsKey.trim();
};
