import { useLayoutEffect, useRef, useState } from 'react';
import { getKakaoMaps } from '../lib/kakaoMapsApi';
import {
  loadKakaoMaps,
  relayoutMap,
  type KakaoMap,
} from '../lib/loadKakaoMaps';
import { fetchKakaoMapsJsKey } from '../services/filterApi';
import { useFilterSearch } from '../context/FilterSearchContext';
import MapZoomControls from './MapZoomControls';
// import useCustomLogin from '@/hooks/useCustomLogin';
// const { member } = useCustomLogin();

const DEFAULT_CENTER = { lat: 37.350106, lng: 127.109001 };
// if (member?.addressX && member.addressY) {
//   const DEFAULT_CENTER = {
//     lat: member.addressX,
//     lng: member.addressY
//   }
// } else {
//   const DEFAULT_CENTER = { lat: 37.350106, lng: 127.109001 };
// }
  
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

function getCurrentCenter(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(DEFAULT_CENTER);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => resolve(DEFAULT_CENTER),
      {
        enableHighAccuracy: true,
        timeout: 5000,
      },
    );
  });
}

export default function FilterMapView() {
  const { attachMap, reportMapError } = useFilterSearch();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<KakaoMap | null>(null);
  const [mapInstance, setMapInstance] = useState<KakaoMap | null>(null);

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

        const center = await getCurrentCenter();
        if (cancelled) return;

        const maps = getKakaoMaps();
        const map = new maps.Map(el, {
          center: new maps.LatLng(center.lat, center.lng),
          level: 5,
        });
        map.setDraggable?.(false);
        map.setZoomable?.(true);
        mapRef.current = map;
        setMapInstance(map);
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
      setMapInstance(null);
      void attachMap(null);
    };
  }, [attachMap, reportMapError]);

  return (
    <div className="filter-map-wrap">
      <div ref={containerRef} className="filter-map" />
      <MapZoomControls map={mapInstance} />
    </div>
  );
}
