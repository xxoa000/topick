import { useFilterSearch } from '../context/FilterSearchContext';

function formatPrice(price: number): string {
  return `${price.toLocaleString('ko-KR')}원`;
}

export default function StoreDetailPanel() {
  const {
    selectedStore,
    storeMenus,
    storeDetailLoading,
    storeDetailError,
    clearStoreDetail,
  } = useFilterSearch();

  if (!selectedStore) return null;

  return (
    <aside className="filter-store-detail" aria-label="가게 상세 정보">
      <div className="filter-store-detail-header">
        <h3>{selectedStore.placeName}</h3>
        <button
          type="button"
          className="filter-store-detail-close"
          onClick={clearStoreDetail}
          aria-label="닫기"
        >
          ×
        </button>
      </div>

      <p className="filter-store-detail-address">📍 {selectedStore.addressName}</p>
      <p className="filter-store-detail-category">🍽️ {selectedStore.categoryName}</p>

      {selectedStore.placeUrl && (
        <a
          className="filter-store-detail-link"
          href={selectedStore.placeUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          카카오맵에서 보기
        </a>
      )}

      <div className="filter-store-detail-menus">
        <h4>메뉴</h4>
        {storeDetailLoading && (
          <p className="filter-store-detail-status">메뉴 불러오는 중...</p>
        )}
        {!storeDetailLoading && storeDetailError && (
          <p className="filter-store-detail-error">{storeDetailError}</p>
        )}
        {!storeDetailLoading && !storeDetailError && storeMenus.length === 0 && (
          <p className="filter-store-detail-empty">등록된 메뉴가 없습니다.</p>
        )}
        {!storeDetailLoading && storeMenus.length > 0 && (
          <ul className="filter-store-menu-list">
            {storeMenus.map((menu) => (
              <li key={menu.menuNo} className="filter-store-menu-item">
                <span className="filter-store-menu-name">{menu.menuName}</span>
                <span className="filter-store-menu-price">
                  {formatPrice(menu.menuPrice)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
