import React, { useState } from 'react';
import styles from './_store-tab.module.scss';

interface StoreTabProps {
    activeTab: string;
    setActiveTab: (id: string) => void;
}

export const StoreTab: React.FC<StoreTabProps> = ({ activeTab, setActiveTab }) => {
    // 우선 기능 없이 UI 및 시각적 전환만 확인하기 위해 로컬 State로 구성했습니다.
    const tabs = [
        { id: 'home', label: '홈' },
        { id: 'menu', label: '메뉴' },
        { id: 'photo', label: '사진' },
        { id: 'review', label: '리뷰' }
    ];

    return (
        <div className={styles.tabsContainer}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`${styles.tabItem} ${activeTab === tab.id ? styles.active : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

