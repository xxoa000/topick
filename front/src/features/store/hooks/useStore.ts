// src/features/store/hooks/useStore.ts
import { useState, useCallback } from 'react';
import { storeService } from '../services/storeService';

export const useStore = () => {
    const [storeData, setStoreData] = useState<any>(null);

    // 💡 async () => Promise<any> 형태로 반환 타입을 인지시킵니다.
    const getStoreData = useCallback(async (storeNo: number, id: string, y: string, x: string): Promise<any> => {
        try {
            const data = await storeService.getStoreData(storeNo, id, y, x);
            if (data.avg == null) data.avg = 0;
            
            setStoreData(data);
            return data; // 💡 핵심: 가져온 데이터를 함수 외부로 반환(return)합니다!
        } catch (err) {
            console.error("가게 정보 불러오기 실패:", err);
            throw err; // 에러가 발생했을 때 호출부(MyReviewPage)에서도 인지할 수 있도록 던져줍니다.
        }
    }, []);

    return {
        getStoreData,
        storeData
    };
};

export const useStoreTab = () => {
    const [activeTab, setActiveTab] = useState('home');
    return {
        activeTab,
        setActiveTab
    };
};