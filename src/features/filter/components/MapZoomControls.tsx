import { useCallback } from 'react';
import type { KakaoMap } from '../lib/loadKakaoMaps';

const MIN_LEVEL = 1;
const MAX_LEVEL = 14;

type MapZoomControlsProps = {
  map: KakaoMap | null;
};

export default function MapZoomControls({ map }: MapZoomControlsProps) {
  const zoomIn = useCallback(() => {
    if (!map?.getLevel || !map?.setLevel) return;
    const level = map.getLevel();
    if (level <= MIN_LEVEL) return;
    map.setLevel(level - 1, { animate: true });
  }, [map]);

  const zoomOut = useCallback(() => {
    if (!map?.getLevel || !map?.setLevel) return;
    const level = map.getLevel();
    if (level >= MAX_LEVEL) return;
    map.setLevel(level + 1, { animate: true });
  }, [map]);

  if (!map) return null;

  return (
    <div className="filter-map-zoom" aria-label="지도 확대 축소">
      <button
        type="button"
        className="filter-map-zoom-btn"
        onClick={zoomIn}
        aria-label="확대"
      >
        +
      </button>
      <button
        type="button"
        className="filter-map-zoom-btn"
        onClick={zoomOut}
        aria-label="축소"
      >
        −
      </button>
    </div>
  );
}
