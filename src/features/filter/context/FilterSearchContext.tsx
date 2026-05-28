import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { StoreItem } from '../../store/types';
import { extractFoodType } from '../lib/categoryFoodType';
import { getKakaoMaps } from '../lib/kakaoMapsApi';
import { type KakaoMap, type KakaoMarker } from '../lib/loadKakaoMaps';
import { fetchStoreMenus, fetchTags, searchByFilter, searchByKeyword } from '../services/filterApi';
import type { Menu, SearchResponse, Tag } from '../types';

type SearchMode = 'keyword' | 'filter';
type DistanceOption = 100 | 500 | 1000 | null;

type FilterSearchContextValue = {
  keyword: string;
  setKeyword: (value: string) => void;
  /** API 원본 목록 (음식 종류 추출 기준) */
  results: StoreItem[];
  /** 선택한 음식 종류(두 번째 구간) 기준으로 필터된 목록 · 마커 표시용 */
  displayedResults: StoreItem[];
  foodTypesFromResults: string[];
  selectedFoodType: string | null;
  selectFoodType: (type: string | null) => void;
  selectedDistance: DistanceOption;
  setSelectedDistance: (distance: DistanceOption) => void;
  selectedTags: Set<string>;
  tags: Tag[];
  tagsLoading: boolean;
  tagsError: string;
  total: number;
  status: string;
  mapError: string;
  runKeywordSearch: (fromMapMove?: boolean) => Promise<void>;
  runFilterSearch: (fromMapMove?: boolean) => Promise<void>;
  handleToggleTag: (tagName: string) => void;
  handleResultClick: (store: StoreItem) => void;
  selectedStore: StoreItem | null;
  storeMenus: Menu[];
  storeDetailLoading: boolean;
  storeDetailError: string;
  selectStore: (store: StoreItem) => Promise<void>;
  clearStoreDetail: () => void;
  attachMap: (map: KakaoMap | null) => Promise<void>;
  reportMapError: (message: string) => void;
};

const FilterSearchContext = createContext<FilterSearchContextValue | null>(null);

export function useFilterSearch() {
  const ctx = useContext(FilterSearchContext);
  if (!ctx) {
    throw new Error('useFilterSearch must be used within FilterSearchProvider');
  }
  return ctx;
}

export function FilterSearchProvider({ children }: { children: ReactNode }) {
  const mapRef = useRef<KakaoMap | null>(null);
  const markersRef = useRef<KakaoMarker[]>([]);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressIdleUntilRef = useRef(0);
  const lastFetchedBoundsKeyRef = useRef('');
  const searchInFlightRef = useRef(false);
  const lastModeRef = useRef<SearchMode>('keyword');
  const selectedTagsRef = useRef<Set<string>>(new Set());
  const keywordRef = useRef('');

  const [keyword, setKeywordState] = useState('');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagsLoading, setTagsLoading] = useState(true);
  const [tagsError, setTagsError] = useState('');
  const [results, setResults] = useState<StoreItem[]>([]);
  const [selectedFoodType, setSelectedFoodType] = useState<string | null>(null);
  const [selectedDistance, setSelectedDistance] = useState<DistanceOption>(null);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('');
  const [mapError, setMapError] = useState('');
  const [selectedStore, setSelectedStore] = useState<StoreItem | null>(null);
  const [storeMenus, setStoreMenus] = useState<Menu[]>([]);
  const [storeDetailLoading, setStoreDetailLoading] = useState(false);
  const [storeDetailError, setStoreDetailError] = useState('');

  selectedTagsRef.current = selectedTags;
  keywordRef.current = keyword;

  const setKeyword = useCallback((value: string) => {
    setKeywordState(value);
  }, []);

  const selectFoodType = useCallback((type: string | null) => {
    setSelectedFoodType((prev) => {
      if (type === null) return null;
      return prev === type ? null : type;
    });
  }, []);

  const toDistanceOption = useCallback((value: DistanceOption) => {
    setSelectedDistance(value);
  }, []);

  const calcDistanceMeters = useCallback(
    (lat1: number, lng1: number, lat2: number, lng2: number) => {
      const toRad = (deg: number) => (deg * Math.PI) / 180;
      const radius = 6371000;
      const dLat = toRad(lat2 - lat1);
      const dLng = toRad(lng2 - lng1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
          Math.cos(toRad(lat2)) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return radius * c;
    },
    [],
  );

  const foodTypesFromResults = useMemo(() => {
    const set = new Set<string>();
    for (const s of results) {
      const t = extractFoodType(s.categoryName);
      if (t) set.add(t);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'ko'));
  }, [results]);

  const displayedResults = useMemo(() => {
    const byFoodType =
      selectedFoodType == null
        ? results
        : results.filter(
            (s) => extractFoodType(s.categoryName) === selectedFoodType,
          );

    const map = mapRef.current;
    if (!map) return byFoodType;

    const bounds = map.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    const centerLat = (sw.getLat() + ne.getLat()) / 2;
    const centerLng = (sw.getLng() + ne.getLng()) / 2;

    const withDistance = byFoodType
      .filter((s) => s.y != null && s.x != null)
      .map((s) => ({
        store: s,
        distance: calcDistanceMeters(centerLat, centerLng, s.y, s.x),
      }));

    const byDistance =
      selectedDistance == null
        ? withDistance
        : withDistance.filter((d) => d.distance <= selectedDistance);

    return byDistance.sort((a, b) => a.distance - b.distance).map((d) => d.store);
  }, [results, selectedFoodType, selectedDistance, calcDistanceMeters]);

  const buildBounds = useCallback(() => {
    const map = mapRef.current;
    if (!map) {
      return { swX: 0, swY: 0, neX: 0, neY: 0 };
    }
    const bounds = map.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    return {
      swX: sw.getLng(),
      swY: sw.getLat(),
      neX: ne.getLng(),
      neY: ne.getLat(),
    };
  }, []);

  const currentBoundsKey = useCallback(() => {
    const b = buildBounds();
    return [b.swX, b.swY, b.neX, b.neY].map((v) => v.toFixed(5)).join('|');
  }, [buildBounds]);

  const suppressIdle = useCallback((ms: number) => {
    suppressIdleUntilRef.current = Date.now() + ms;
  }, []);

  const isIdleSuppressed = useCallback(
    () => Date.now() < suppressIdleUntilRef.current,
    [],
  );

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
  }, []);

  const selectStoreRef = useRef<(store: StoreItem) => void>(() => {});

  const selectStore = useCallback(async (store: StoreItem) => {
    setSelectedStore(store);
    setStoreMenus([]);
    setStoreDetailError('');
    setStoreDetailLoading(true);

    try {
      const menus = await fetchStoreMenus({
        kakaoId: store.id,
        storeName: store.placeName,
      });
      setStoreMenus(menus);
    } catch (e) {
      const message = e instanceof Error ? e.message : '메뉴 조회 실패';
      setStoreDetailError(message);
    } finally {
      setStoreDetailLoading(false);
    }
  }, []);

  selectStoreRef.current = (store: StoreItem) => {
    void selectStore(store);
  };

  const clearStoreDetail = useCallback(() => {
    setSelectedStore(null);
    setStoreMenus([]);
    setStoreDetailError('');
    setStoreDetailLoading(false);
  }, []);

  const drawMarkers = useCallback(
    (items: StoreItem[]) => {
      const map = mapRef.current;
      if (!map) return;

      clearMarkers();
      items.forEach((item) => {
        if (item.y == null || item.x == null) return;
        const maps = getKakaoMaps();
        const position = new maps.LatLng(item.y, item.x);
        const marker = new maps.Marker({ map, position });
        maps.event.addListener(marker, 'click', () => {
          selectStoreRef.current(item);
        });
        markersRef.current.push(marker);
      });
    },
    [clearMarkers],
  );

  const renderResult = useCallback((data: SearchResponse) => {
    const items = data.item ?? [];
    setTotal(data.total ?? 0);
    setResults(items);
    setSelectedFoodType(null);
  }, []);

  const runKeywordSearch = useCallback(
    async (fromMapMove = false) => {
      const map = mapRef.current;
      if (!map || searchInFlightRef.current) return;

      lastModeRef.current = 'keyword';
      const boundsKey = currentBoundsKey();
      setStatus(fromMapMove ? '이 지역 검색 중...' : '키워드 검색 중...');
      searchInFlightRef.current = true;

      try {
        const data = await searchByKeyword({
          ...buildBounds(),
          keyword: keywordRef.current.trim(),
        });
        lastFetchedBoundsKeyRef.current = boundsKey;
        renderResult(data);
      } catch (e) {
        const message = e instanceof Error ? e.message : '알 수 없는 오류';
        setStatus(`키워드 검색 실패: ${message}`);
      } finally {
        searchInFlightRef.current = false;
      }
    },
    [buildBounds, currentBoundsKey, renderResult],
  );

  const runFilterSearch = useCallback(
    async (fromMapMove = false) => {
      const map = mapRef.current;
      if (!map || searchInFlightRef.current) return;

      const tagNames = Array.from(selectedTagsRef.current);
      if (tagNames.length === 0) {
        alert('태그를 하나 이상 선택해주세요.');
        return;
      }

      lastModeRef.current = 'filter';
      const boundsKey = currentBoundsKey();
      setStatus(fromMapMove ? '이 지역 태그 검색 중...' : '태그 필터 검색 중...');
      searchInFlightRef.current = true;

      try {
        const data = await searchByFilter({
          ...buildBounds(),
          tagName: tagNames,
        });
        lastFetchedBoundsKeyRef.current = boundsKey;
        renderResult(data);
      } catch (e) {
        const message = e instanceof Error ? e.message : '알 수 없는 오류';
        setStatus(`필터 검색 실패: ${message}`);
      } finally {
        searchInFlightRef.current = false;
      }
    },
    [buildBounds, currentBoundsKey, renderResult],
  );

  const rerunLastSearch = useCallback(() => {
    const map = mapRef.current;
    if (!map || isIdleSuppressed() || searchInFlightRef.current) return;

    const boundsKey = currentBoundsKey();
    if (boundsKey === lastFetchedBoundsKeyRef.current) return;

    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      if (!mapRef.current || isIdleSuppressed() || searchInFlightRef.current) {
        return;
      }
      if (currentBoundsKey() === lastFetchedBoundsKeyRef.current) return;

      if (lastModeRef.current === 'filter' && selectedTagsRef.current.size > 0) {
        void runFilterSearch(true);
      } else {
        void runKeywordSearch(true);
      }
    }, 500);
  }, [currentBoundsKey, isIdleSuppressed, runFilterSearch, runKeywordSearch]);

  const handleToggleTag = useCallback(
    (tagName: string) => {
      const next = new Set(selectedTags);
      if (next.has(tagName)) {
        next.delete(tagName);
      } else {
        next.add(tagName);
      }
      selectedTagsRef.current = next;
      setSelectedTags(next);

      if (next.size > 0) {
        void runFilterSearch(false);
      } else {
        lastModeRef.current = 'keyword';
        void runKeywordSearch(false);
      }
    },
    [runFilterSearch, runKeywordSearch, selectedTags],
  );

  const handleResultClick = useCallback(
    (store: StoreItem) => {
      void selectStore(store);
    },
    [selectStore],
  );

  const runKeywordSearchRef = useRef(runKeywordSearch);
  const rerunLastSearchRef = useRef(rerunLastSearch);
  runKeywordSearchRef.current = runKeywordSearch;
  rerunLastSearchRef.current = rerunLastSearch;

  const reportMapError = useCallback((message: string) => {
    setMapError(message);
    setStatus(`지도 초기화 실패: ${message}`);
  }, []);

  const attachMap = useCallback(
    async (map: KakaoMap | null) => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      clearMarkers();
      mapRef.current = map;

      if (!map) return;

      setMapError('');
      const maps = getKakaoMaps();
      maps.event.addListener(map, 'idle', () => {
        rerunLastSearchRef.current();
      });
      suppressIdle(300);
      await runKeywordSearchRef.current(false);
    },
    [clearMarkers, suppressIdle],
  );

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setTagsLoading(true);
      try {
        const data = await fetchTags();
        if (!cancelled) {
          setTags(data);
          setTagsError('');
        }
      } catch (e) {
        if (!cancelled) {
          setTagsError('태그 로딩 실패');
          setStatus(e instanceof Error ? e.message : '태그 로딩 실패');
        }
      } finally {
        if (!cancelled) setTagsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    drawMarkers(displayedResults);
    if (results.length === 0) {
      setStatus('');
    } else {
      const suffix = selectedFoodType ? ` · ${selectedFoodType}` : '';
      const distanceSuffix =
        selectedDistance == null ? '' : ` · ${selectedDistance}m 이내`;
      setStatus(
        `지도에 ${displayedResults.length}개 표시${suffix}${distanceSuffix}`,
      );
    }
  }, [
    displayedResults,
    results.length,
    selectedFoodType,
    selectedDistance,
    drawMarkers,
  ]);

  useEffect(() => {
    if (!selectedStore) return;
    const still = displayedResults.some((s) => s.id === selectedStore.id);
    if (!still) clearStoreDetail();
  }, [displayedResults, selectedStore, clearStoreDetail]);

  const value: FilterSearchContextValue = {
    keyword,
    setKeyword,
    results,
    displayedResults,
    foodTypesFromResults,
    selectedFoodType,
    selectFoodType,
    selectedDistance,
    setSelectedDistance: toDistanceOption,
    selectedTags,
    tags,
    tagsLoading,
    tagsError,
    total,
    status,
    mapError,
    runKeywordSearch,
    runFilterSearch,
    handleToggleTag,
    handleResultClick,
    selectedStore,
    storeMenus,
    storeDetailLoading,
    storeDetailError,
    selectStore,
    clearStoreDetail,
    attachMap,
    reportMapError,
  };

  return (
    <FilterSearchContext.Provider value={value}>
      {children}
    </FilterSearchContext.Provider>
  );
}
