import { useFilterSearch } from '../context/FilterSearchContext';

function escapeHtml(text: string): string {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default function SearchResultsPanel() {
  const { results, total, status, mapError, handleResultClick, selectedStore } =
    useFilterSearch();

  return (
    <aside className="filter-results-panel">
      <h2 className="filter-panel-title">
        검색 결과 <span className="filter-count">({total}개)</span>
      </h2>

      <div className="filter-results-list">
        {mapError && <p className="filter-empty">{escapeHtml(mapError)}</p>}
        {!mapError && results.length === 0 && (
          <p className="filter-empty">검색 결과가 없습니다.</p>
        )}
        {results.map((store) => (
          <div
            key={store.id}
            className={`filter-result-item${selectedStore?.id === store.id ? ' selected' : ''}`}
            onClick={() => handleResultClick(store)}
          >
            <h4>
              <a
                href={store.placeUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                {store.placeName}
              </a>
            </h4>
            <p>📍 {store.addressName}</p>
            <p>🍽️ {store.categoryName}</p>
          </div>
        ))}
      </div>

      {status && <p className="filter-status">{status}</p>}
    </aside>
  );
}
