import type { StoreItem } from '../../store/types';
import type { Menu } from '../types';

function escapeHtml(text: string): string {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatPrice(price: number): string {
  return `${price.toLocaleString('ko-KR')}원`;
}

export function buildStoreInfoWindowHtml(
  store: StoreItem,
  menus: Menu[],
  loading: boolean,
  error: string,
): string {
  const placeUrl = store.placeUrl
    ? `<a class="filter-iw-link" href="${escapeHtml(store.placeUrl)}" target="_blank" rel="noopener noreferrer">카카오맵에서 보기</a>`
    : '';

  let menuBlock = '';
  if (loading) {
    menuBlock = '<p class="filter-iw-status">메뉴 불러오는 중...</p>';
  } else if (error) {
    menuBlock = `<p class="filter-iw-error">${escapeHtml(error)}</p>`;
  } else if (menus.length === 0) {
    menuBlock =
      '<p class="filter-iw-empty">등록된 메뉴가 없습니다. DB에 메뉴가 등록된 가게만 목록이 표시됩니다.</p>';
  } else {
    const items = menus
      .map(
        (menu) =>
          `<li class="filter-iw-menu-item"><span class="filter-iw-menu-name">${escapeHtml(menu.menuName)}</span><span class="filter-iw-menu-price">${formatPrice(menu.menuPrice)}</span></li>`,
      )
      .join('');
    menuBlock = `<ul class="filter-iw-menu-list">${items}</ul>`;
  }

  return `
    <div class="filter-iw">
      <h3 class="filter-iw-title">${escapeHtml(store.placeName)}</h3>
      <p class="filter-iw-meta">📍 ${escapeHtml(store.addressName)}</p>
      <p class="filter-iw-meta">🍽️ ${escapeHtml(store.categoryName)}</p>
      ${placeUrl}
      <div class="filter-iw-menus">
        <h4 class="filter-iw-menus-title">메뉴</h4>
        ${menuBlock}
      </div>
    </div>
  `;
}
