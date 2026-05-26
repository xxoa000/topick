import FilterHeaderPortal from '../components/FilterHeaderPortal';
import FilterMapView from '../components/FilterMapView';
import SearchResultsPanel from '../components/SearchResultsPanel';
import StoreDetailPanel from '../components/StoreDetailPanel';
import TagFilterPanel from '../components/TagFilterPanel';
import { FilterSearchProvider } from '../context/FilterSearchContext';
import '../styles/filterHome.scss';

export default function FilterHomePage() {
  return (
    <FilterSearchProvider>
      <FilterHeaderPortal />
      <div className="filter-home">
        <div className="filter-layout">
          <SearchResultsPanel />
          <TagFilterPanel />
          <div className="filter-map-column">
            <FilterMapView />
            <StoreDetailPanel />
          </div>
        </div>
      </div>
    </FilterSearchProvider>
  );
}
