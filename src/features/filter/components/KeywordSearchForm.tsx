type KeywordSearchFormProps = {
  inputValue: string;
  activeKeyword: string;
  searching: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClear: () => void;
};

export default function KeywordSearchForm({
  inputValue,
  activeKeyword,
  searching,
  onInputChange,
  onSubmit,
  onClear,
}: KeywordSearchFormProps) {
  return (
    <form
      className="filter-keyword-search"
      onSubmit={onSubmit}
      aria-label="맛집 키워드 검색"
    >
      <input
        type="search"
        className="filter-keyword-search__input"
        value={inputValue}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder="음식점, 한식, 치킨 등 검색"
        aria-label="검색어 입력"
        disabled={searching}
      />
      <button
        type="submit"
        className="filter-keyword-search__submit"
        disabled={searching}
      >
        {searching ? '검색 중' : '검색'}
      </button>
      {activeKeyword.trim() !== '' && (
        <button
          type="button"
          className="filter-keyword-search__clear"
          onClick={onClear}
          disabled={searching}
          title="전체(음식점)으로 다시 검색"
        >
          전체
        </button>
      )}
    </form>
  );
}
