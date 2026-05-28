import { useFilterSearch } from '../context/FilterSearchContext';

export default function FoodTypeFilterBar() {
  const {
    foodTypesFromResults,
    selectedFoodType,
    selectFoodType,
    results,
  } = useFilterSearch();

  if (results.length === 0 || foodTypesFromResults.length === 0) {
    return null;
  }

  return (
    <div aria-label="음식 종류 선택">
      <select
        value={selectedFoodType ?? ''}
        aria-label="음식 종류 선택"
        onChange={(e) => {
          const v = e.target.value;
          selectFoodType(v === '' ? null : v);
        }}
      >
        <option value="">음식 종류 선택 (전체)</option>
        {foodTypesFromResults.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>
  );
}
