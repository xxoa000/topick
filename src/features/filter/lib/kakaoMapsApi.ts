export interface KakaoLatLng {
  getLat(): number;
  getLng(): number;
}

export interface KakaoLatLngBounds {
  getSouthWest(): KakaoLatLng;
  getNorthEast(): KakaoLatLng;
}

export interface KakaoMap {
  getBounds(): KakaoLatLngBounds;
  panTo(latlng: KakaoLatLng): void;
  setDraggable?(draggable: boolean): void;
  setZoomable?(zoomable: boolean): void;
  relayout?: () => void;
}

export interface KakaoMarker {
  setMap(map: KakaoMap | null): void;
}

export interface KakaoMapsApi {
  LatLng: new (lat: number, lng: number) => KakaoLatLng;
  Map: new (
    container: HTMLElement,
    options: { center: KakaoLatLng; level: number },
  ) => KakaoMap;
  Marker: new (options: { map: KakaoMap; position: KakaoLatLng }) => KakaoMarker;
  event: {
    addListener(
      target: KakaoMap | KakaoMarker,
      type: string,
      handler: () => void,
    ): void;
  };
  load(callback: () => void): void;
}

export function getKakaoMaps(): KakaoMapsApi {
  const maps = (window as Window & { kakao?: { maps?: KakaoMapsApi } }).kakao
    ?.maps;
  if (!maps) {
    throw new Error('Kakao Maps SDK is not loaded');
  }
  return maps;
}
