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
import { useLocation, useNavigate } from 'react-router-dom';
import type { FilterNavigateState } from '../types/navigate';
import type { StoreItem } from '../../store/types';
import { buildStoreInfoWindowHtml } from '../lib/buildStoreInfoWindowHtml';
import { getKakaoMaps } from '../lib/kakaoMapsApi';
import { type KakaoInfoWindow, type KakaoMap, type KakaoMarker } from '../lib/loadKakaoMaps';
import { fetchStoreMenus, fetchTags, searchByFilter, searchByKeyword } from '../services/filterApi';
import type { Menu, SearchResponse, Tag } from '../types';

type SearchMode = 'keyword' | 'filter';
type DistanceOption = 100 | 500 | 1000 | null;

type SelectStoreOptions = {
  marker?: KakaoMarker;
};

type FilterSearchContextValue = {
  results: StoreItem[];
  /** 거리·지도 bounds 기준으로 정렬·필터된 목록 · 마커 표시용 */
  displayedResults: StoreItem[];

  /** 카카오 키워드 API에 전달 중인 검색어 (빈 문자열이면 기본 '음식점') */
  searchKeyword: string;
  submitKeywordSearch: (keyword: string) => Promise<void>;
  selectedDistance: DistanceOption;
  setSelectedDistance: (distance: DistanceOption) => void;
  selectedTags: Set<string>;
  tags: Tag[];
  tagsLoading: boolean;
  tagsError: string;
  total: number;
  status: string;
  mapError: string;
  handleToggleTag: (tagName: string) => void;
  handleResultClick: (store: StoreItem) => void;
  selectedStore: StoreItem | null;
  storeMenus: Menu[];
  storeDetailLoading: boolean;
  storeDetailError: string;
  selectStore: (store: StoreItem, options?: SelectStoreOptions) => Promise<void>;
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
  const location = useLocation();
  const navigate = useNavigate();
  const pendingKeywordRef = useRef<string | null>(null);
  const mapRef = useRef<KakaoMap | null>(null);
  const markersRef = useRef<KakaoMarker[]>([]);
  const infoWindowRef = useRef<KakaoInfoWindow | null>(null);
  const selectedMarkerRef = useRef<KakaoMarker | null>(null);
  const markerByStoreIdRef = useRef<Map<string, KakaoMarker>>(new Map());
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressIdleUntilRef = useRef(0);
  const lastFetchedBoundsKeyRef = useRef('');
  const searchInFlightRef = useRef(false);
  const lastModeRef = useRef<SearchMode>('keyword');
  const selectedTagsRef = useRef<Set<string>>(new Set());
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagsLoading, setTagsLoading] = useState(true);
  const [tagsError, setTagsError] = useState('');

  const [results, setResults] = useState<StoreItem[]>([]);

  const [searchKeyword, setSearchKeyword] = useState('');
  const searchKeywordRef = useRef('');
  const [selectedDistance, setSelectedDistance] = useState<DistanceOption>(null);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('');
  const [mapError, setMapError] = useState('');
  const [selectedStore, setSelectedStore] = useState<StoreItem | null>(null);
  const [storeMenus, setStoreMenus] = useState<Menu[]>([]);
  const [storeDetailLoading, setStoreDetailLoading] = useState(false);
  const [storeDetailError, setStoreDetailError] = useState('');

  selectedTagsRef.current = selectedTags;
  searchKeywordRef.current = searchKeyword;

  useEffect(() => {
    const isFilterPage =
      location.pathname === '/filter' ||
      location.pathname.startsWith('/filter/');
    if (!isFilterPage) return;

    const state = location.state as FilterNavigateState | null;
    if (state && 'keyword' in state) {
      pendingKeywordRef.current = state.keyword ?? '';
    }
  }, [location.pathname, location.state]);

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

  const displayedResults = useMemo(() => {
    const map = mapRef.current;
    if (!map) return results;

    const bounds = map.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    const centerLat = (sw.getLat() + ne.getLat()) / 2;
    const centerLng = (sw.getLng() + ne.getLng()) / 2;

    const withDistance = results
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
  }, [results, selectedDistance, calcDistanceMeters]);

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

  const closeInfoWindow = useCallback(() => {
    infoWindowRef.current?.close();
    selectedMarkerRef.current = null;
  }, []);

  const clearMarkers = useCallback(() => {
    closeInfoWindow();
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
    markerByStoreIdRef.current.clear();
  }, [closeInfoWindow]);

  const openInfoWindow = useCallback(
    (marker: KakaoMarker, store: StoreItem, menus: Menu[], loading: boolean, error: string) => {
      const map = mapRef.current;
      if (!map) return;

      const maps = getKakaoMaps();
      const content = buildStoreInfoWindowHtml(store, menus, loading, error);

      if (!infoWindowRef.current) {
        infoWindowRef.current = new maps.InfoWindow({ removable: true });
      }
      infoWindowRef.current.setContent(content);
      infoWindowRef.current.open(map, marker);
      selectedMarkerRef.current = marker;
    },
    [],
  );

  const selectStoreRef = useRef<(store: StoreItem, marker: KakaoMarker) => void>(() => {});

  const selectStore = useCallback(
    async (store: StoreItem, options?: SelectStoreOptions) => {
      setSelectedStore(store);
      setStoreMenus([]);
      setStoreDetailError('');
      setStoreDetailLoading(true);

      const marker =
        options?.marker ?? markerByStoreIdRef.current.get(store.id) ?? null;
      const map = mapRef.current;
      if (marker && map) {
        if (store.y != null && store.x != null) {
          suppressIdle(600);
          const maps = getKakaoMaps();
          map.panTo(new maps.LatLng(store.y, store.x));
        }
        openInfoWindow(marker, store, [], true, '');
      }

      try {
        const menus = await fetchStoreMenus({
          storeNo: store.storeNo,
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
    },
    [closeInfoWindow, openInfoWindow, suppressIdle],
  );

  selectStoreRef.current = (store: StoreItem, marker: KakaoMarker) => {
    void selectStore(store, { marker });
  };

  const clearStoreDetail = useCallback(() => {
    closeInfoWindow();
    setSelectedStore(null);
    setStoreMenus([]);
    setStoreDetailError('');
    setStoreDetailLoading(false);
  }, [closeInfoWindow]);

  const drawMarkers = useCallback(
    (items: StoreItem[]) => {
      const map = mapRef.current;
      if (!map) return;

      clearMarkers();
      const markerMap = new Map<string, KakaoMarker>();
      items.forEach((item) => {
        if (item.y == null || item.x == null) return;
        const maps = getKakaoMaps();
        const position = new maps.LatLng(item.y, item.x);
        const marker = new maps.Marker({ map, position });
        markerMap.set(item.id, marker);
        maps.event.addListener(marker, 'click', () => {
          selectStoreRef.current(item, marker);
        });
        markersRef.current.push(marker);
      });
      markerByStoreIdRef.current = markerMap;
    },
    [clearMarkers],
  );

  const renderResult = useCallback((data: SearchResponse) => {
    const items = data.item ?? [];
    setTotal(data.total ?? 0);
    setResults(items);
  }, []);

  const runKeywordSearch = useCallback(
    async (fromMapMove = false) => {
      const map = mapRef.current;
      if (!map || searchInFlightRef.current) return;

      lastModeRef.current = 'keyword';
      const boundsKey = currentBoundsKey();
      const keywordLabel = searchKeywordRef.current.trim() || '음식점';
      setStatus(
        fromMapMove
          ? `이 지역 "${keywordLabel}" 검색 중...`
          : `"${keywordLabel}" 검색 중...`,
      );
      searchInFlightRef.current = true;

      try {
        const data = await searchByKeyword({
          ...buildBounds(),
          keyword: searchKeywordRef.current,
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

  const submitKeywordSearch = useCallback(
    async (keyword: string) => {
      const trimmed = keyword.trim();
      setSearchKeyword(trimmed);
      searchKeywordRef.current = trimmed;
      selectedTagsRef.current = new Set();
      setSelectedTags(new Set());
      lastModeRef.current = 'keyword';
      lastFetchedBoundsKeyRef.current = '';
      await runKeywordSearch(false);
    },
    [runKeywordSearch],
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

  useEffect(() => {
    if (!selectedStore || !selectedMarkerRef.current) {
      return;
    }
    openInfoWindow(
      selectedMarkerRef.current,
      selectedStore,
      storeMenus,
      storeDetailLoading,
      storeDetailError,
    );
  }, [selectedStore, storeMenus, storeDetailLoading, storeDetailError, openInfoWindow]);

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
        rerunLastSearchRef.current(); // ref 처럼 실시간
      });
      suppressIdle(300); // 0.3초 재검색 막기

      const pending = pendingKeywordRef.current;
      if (pending !== null) {
        pendingKeywordRef.current = null;
        setSearchKeyword(pending);
        searchKeywordRef.current = pending;
        selectedTagsRef.current = new Set();
        setSelectedTags(new Set());
        lastModeRef.current = 'keyword';
        lastFetchedBoundsKeyRef.current = '';
        navigate(location.pathname, { replace: true, state: null });
      }

      await runKeywordSearchRef.current(false);
    },
    [clearMarkers, suppressIdle, navigate, location.pathname],
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
      const keywordSuffix = searchKeyword.trim()
        ? ` · "${searchKeyword.trim()}"`
        : '';
      const distanceSuffix =
        selectedDistance == null ? '' : ` · ${selectedDistance}m 이내`;
      setStatus(
        `지도에 ${displayedResults.length}개 표시${keywordSuffix}${distanceSuffix}`,
      );
    }
  }, [
    displayedResults,
    results.length,
    searchKeyword,
    selectedDistance,
    drawMarkers,
  ]);

  useEffect(() => {
    if (!selectedStore) return;
    const still = displayedResults.some((s) => s.id === selectedStore.id);
    if (!still) clearStoreDetail();
  }, [displayedResults, selectedStore, clearStoreDetail]);

  const value: FilterSearchContextValue = {
    results,
    displayedResults,
    searchKeyword,
    submitKeywordSearch,
    selectedDistance,
    setSelectedDistance: toDistanceOption,
    selectedTags,
    tags,
    tagsLoading,
    tagsError,
    total,
    status,
    mapError,
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
