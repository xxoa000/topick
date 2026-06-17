import type { Tag } from '../types';
import { useFilterSearch } from '../context/FilterSearchContext';
import { useState } from 'react';

function groupTagsByType(tags: Tag[]): Record<string, Tag[]> {
  const grouped: Record<string, Tag[]> = {};
  tags.forEach((tag) => {
    const type = tag.tagType?.trim() ? tag.tagType.trim() : '기타';
    if (!grouped[type]) grouped[type] = [];
    grouped[type].push(tag);
  });
  return grouped;
}

export default function TagFilterPanel() {
  const {
    selectedTags,
    selectedDistance,
    setSelectedDistance,
    tags,
    tagsLoading,
    tagsError,
    handleToggleTag,
  } = useFilterSearch();
  const [isOpen, setIsOpen] = useState(false);
  const groupedTags = groupTagsByType(tags);
  const selectedTagsText =
    selectedTags.size === 0
      ? '태그를 선택하면 맛집을 검색합니다'
      : `선택: ${Array.from(selectedTags).join(', ')}`;

  return (
    <aside className={`filter-tags-panel${isOpen ? '' : ' closed'}`}>
    {isOpen && (
      <>
      <h2 className="filter-panel-title">태그 필터</h2>
      <p className="filter-selected-tags">{selectedTagsText}</p>
      <div>
        <label htmlFor="distance-filter-select">거리순 정렬</label>
        <select
          id="distance-filter-select"
          value={selectedDistance == null ? '' : String(selectedDistance)}
          onChange={(e) => {
            const value = e.target.value;
            if (value === '100') setSelectedDistance(100);
            else if (value === '500') setSelectedDistance(500);
            else if (value === '1000') setSelectedDistance(1000);
            else setSelectedDistance(null);
          }}
        >
          <option value="">전체</option>
          <option value="100">100m</option>
          <option value="500">500m</option>
          <option value="1000">1km</option>
        </select>
      </div>

      <div className="filter-tag-container">
        {tagsLoading && <span className="filter-empty">태그 로딩 중...</span>}
        {!tagsLoading && tagsError && (
          <span className="filter-empty">{tagsError}</span>
        )}
        {!tagsLoading && !tagsError && tags.length === 0 && (
          <span className="filter-empty">
            활성 태그가 없습니다. (tag_status=active)
          </span>
        )}
        {!tagsLoading &&
          !tagsError &&
          Object.keys(groupedTags)
            .sort()
            .map((type) => (
              <div key={type} className="filter-tag-group">
                <p className="filter-tag-type">{type}</p>
                <div className="filter-chips">
                  {groupedTags[type].map((tag) => (
                    <span
                      key={tag.tagNo}
                      className={`filter-chip${selectedTags.has(tag.tagName) ? ' selected' : ''}`}
                      title={type}
                      onClick={() => handleToggleTag(tag.tagName)}
                    >
                      {tag.tagName}
                    </span>
                  ))}
                </div>
              </div>
            ))}
      </div>
      </>
      )}
      <div className="filter-tag-button">
        {isOpen ? (
          <button onClick={() => setIsOpen(false)} style={{fontSize: '20px'}}>{"<"}</button>
        ) : (
          <button onClick={() => setIsOpen(true)} >{">"}</button>
        )}
      </div>
    </aside>
  );
}
