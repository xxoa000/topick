import axios from 'axios';
import type { StoreRequest } from '../../store/types';
import type {
  FilterRequest,
  KakaoMapsConfig,
  KeywordRequest,
  Menu,
  SearchResponse,
  Tag,
} from '../types';

const filterHttp = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

export const searchByKeyword = async (
  body: KeywordRequest,
): Promise<SearchResponse> => {
  const { data } = await filterHttp.post<SearchResponse>(
    '/api/keyword',
    body,
  );
  return data;
};

export const searchByFilter = async (
  body: FilterRequest,
): Promise<SearchResponse> => {
  const { data } = await filterHttp.post<SearchResponse>(
    '/api/filter',
    body,
  );
  return data;
};

export const fetchTags = async (): Promise<Tag[]> => {
  const { data } = await filterHttp.get<Tag[]>('/api/tag');
  return data;
};

export const fetchStoreMenus = async (body: StoreRequest): Promise<Menu[]> => {
  const { data } = await filterHttp.post<Menu[]>('/api/filter/menu/store', body);
  return data;
};

export const fetchKakaoMapsJsKey = async (): Promise<string> => {
  const { data } = await filterHttp.get<KakaoMapsConfig>(
    '/api/filter/kakao-maps-js-key',
  );
  if (!data.jsKey?.trim()) {
    throw new Error(
      'kakao.maps.js-key가 application.properties에 설정되지 않았습니다.',
    );
  }
  return data.jsKey.trim();
};
