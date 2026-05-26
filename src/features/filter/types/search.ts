import type { Bounds } from './bounds';
import type { StoreItem } from '../../store/types';

export type KeywordRequest = Bounds & {
  keyword: string;
};

export type FilterRequest = Bounds & {
  tagName: string[];
};

export type SearchResponse = {
  total: number;
  item: StoreItem[];
};
