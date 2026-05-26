import { useFilterSearch } from '../context/FilterSearchContext';

export default function KeywordSearchBar() {
  const { keyword, setKeyword, runKeywordSearch } = useFilterSearch();

  return (
    <form
      className="filter-keyword-search"
      onSubmit={(e) => {
        e.preventDefault();
        void runKeywordSearch(false);
      }}
    >
      <input
        type="text"
        className="filter-keyword-input"
        placeholder="예: 파스타, 치킨..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <button type="submit" className="filter-keyword-btn">
        검색
      </button>
    </form>
  );
}
