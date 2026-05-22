import { httpClient } from '../../../shared/api/httpClient';
import type {
  FilterRequest,
  KeywordRequest,
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
