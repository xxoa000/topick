import FilterHeaderPortal from '../components/FilterHeaderPortal'; //React Portal로 다른 DOM 위치(예: 헤더 영역)에 꽂아 넣는 구조
import FilterMapView from '../components/FilterMapView'; //지도(카카오맵 등)를 실제로 그리는 컴포넌트
import SearchResultsPanel from '../components/SearchResultsPanel'; //검색된 가게 리스트(결과 목록 패널) 컴포넌트
import TagFilterPanel from '../components/TagFilterPanel'; //태그 기반 필터 UI(예: 매운맛, 혼밥, 주차 등)를 보여주는 컴포넌트 / 결과 목록을 좁히는 제어부 역할
import { FilterSearchProvider } from '../context/FilterSearchContext'; //Context Provider를 가져와서, 하위 컴포넌트들이 공통 상태(키워드, 선택 태그, 결과, 선택 매장, 지도 상태 등)를 공유
import '../styles/filterHome.scss';

export default function FilterHomePage() { //이 파일의 기본(default) export인 페이지 컴포넌트 선언
  return ( //JSX 트리를 반환 시작. "페이지 화면 구성도"
    <FilterSearchProvider> 
      <FilterHeaderPortal />
      <div className="filter-home">
        <div className="filter-layout">
          <SearchResultsPanel />
          <TagFilterPanel />
          <div className="filter-map-column">
            <FilterMapView />
          </div>
        </div>
      </div>
    </FilterSearchProvider>
  );
}
