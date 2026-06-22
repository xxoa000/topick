import React, { useState } from 'react';
import styles from './_store-tab.module.scss';

export const StoreTab: React.FC = () => {
    // 우선 기능 없이 UI 및 시각적 전환만 확인하기 위해 로컬 State로 구성했습니다.
    const [activeTab, setActiveTab] = useState('홈');
    const tabs = ['홈', '메뉴', '사진', '리뷰'];

    return (
        <div className={styles.tabsContainer}>
            {tabs.map((tab) => (
                <button
                    key={tab}
                    className={`${styles.tabItem} ${activeTab === tab ? styles.active : ''}`}
                    onClick={() => setActiveTab(tab)}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};