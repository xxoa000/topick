import FilterMapView from '../components/FilterMapView';
import SearchResultsPanel from '../components/SearchResultsPanel';
import TagFilterPanel from '../components/TagFilterPanel';
import '../styles/filterHome.scss';

export default function FilterHomePage() {
  return (
    <div className="filter-home">
      <div className="filter-layout">
        <SearchResultsPanel />
        <div className="filter-map-column">
          <FilterMapView />
          <TagFilterPanel />
        </div>
      </div>
    </div>
  );
}
