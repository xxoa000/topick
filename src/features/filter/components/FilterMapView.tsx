import { useLayoutEffect, useRef } from 'react';
import { getKakaoMaps } from '../lib/kakaoMapsApi';
import {
  loadKakaoMaps,
  relayoutMap,
  type KakaoMap,
} from '../lib/loadKakaoMaps';
import { fetchKakaoMapsJsKey } from '../services/filterApi';
import { useFilterSearch } from '../context/FilterSearchContext';

const DEFAULT_CENTER = { lat: 37.3943, lng: 127.111 };

function waitForElementSize(el: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    let attempts = 0;

    const check = () => {
      if (el.offsetWidth > 0 && el.offsetHeight > 0) {
        resolve();
        return;
      }

      attempts += 1;
      if (attempts >= 40) {
        resolve();
        return;
      }

      requestAnimationFrame(check);
    };

    check();
  });
}

export default function FilterMapView() {
  const { attachMap, reportMapError } = useFilterSearch();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<KakaoMap | null>(null);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el || mapRef.current) return;

    let cancelled = false;

    const handleResize = () => {
      if (mapRef.current) relayoutMap(mapRef.current);
    };

    (async () => {
      try {
        await waitForElementSize(el);
        if (cancelled) return;

        const jsKey = await fetchKakaoMapsJsKey();
        await loadKakaoMaps(jsKey);
        if (cancelled) return;

        const maps = getKakaoMaps();
        const map = new maps.Map(el, {
          center: new maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng),
          level: 5,
        });
        mapRef.current = map;
        relayoutMap(map);
        window.addEventListener('resize', handleResize);
        await attachMap(map);
      } catch (e) {
        if (!cancelled) {
          const message = e instanceof Error ? e.message : '지도 초기화 실패';
          reportMapError(message);
        }
      }
    })();

    return () => {
      cancelled = true;
      window.removeEventListener('resize', handleResize);
      mapRef.current = null;
      void attachMap(null);
    };
  }, [attachMap, reportMapError]);

  return (
    <div className="filter-map-wrap">
      <div ref={containerRef} className="filter-map" />
    </div>
  );
}
