// src/features/category/components/CategoryList.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORY_LIST } from '../constants/categoryConstant';
import styles from './_category_component.module.scss';

export const CategoryComponent: React.FC = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryLabel: string) => {
    // 클릭 시 /filter 페이지로 이동하면서 검색 키워드로 카테고리명 전달
    navigate('/filter', {
      state: { keyword: categoryLabel }
    });
  };

  return (
    <div className={styles.categoryContainer}>
      <div className={styles.gridContainer}>
        {CATEGORY_LIST.map((item) => (
          <button
            key={item.value}
            type="button"
            className={styles.categoryItem}
            onClick={() => handleCategoryClick(item.label)}
          >
            <div className={styles.iconWrapper}>
              <span className={styles.icon}>{item.icon}</span>
            </div>
            <span className={styles.label}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};