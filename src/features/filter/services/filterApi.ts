import { httpClient } from '../../../shared/api/httpClient';
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
  const { data } = await httpClient.post<SearchResponse>(
    '/api/keyword',
    body,
  );
  return data;
};

export const searchByFilter = async (
  body: FilterRequest,
): Promise<SearchResponse> => {
  const { data } = await httpClient.post<SearchResponse>(
    '/api/filter',
    body,
  );
  return data;
};

export const fetchTags = async (): Promise<Tag[]> => {
  const { data } = await httpClient.get<Tag[]>('/api/tag');
  return data;
};

export const fetchStoreMenus = async (body: StoreRequest): Promise<Menu[]> => {
  const { data } = await httpClient.post<Menu[]>('/api/filter/menu/store', body);
  return data;
};

export const fetchKakaoMapsJsKey = async (): Promise<string> => {
  const { data } = await httpClient.get<KakaoMapsConfig>(
    '/api/config/kakao-maps-js-key',
  );
  if (!data.jsKey?.trim()) {
    throw new Error(
      'kakao.maps.js-key가 application.properties에 설정되지 않았습니다.',
    );
  }
  return data.jsKey.trim();
};
