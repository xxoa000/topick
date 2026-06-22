import { useState, useCallback } from 'react';
// import type { Review } from '../types/reviewType';
import { storeService } from '../services/storeService';
// import useCustomLogin from '@/hooks/useCustomLogin';

export const useStore = () => {
    //   const { member } = useCustomLogin();
    const [storeData, setStoreData] = useState<any>(null);

    const getStoreData = useCallback(async (storeNo: number, id: string, y: string, x: string) => {
        try {
            const data = await storeService.getStoreData(storeNo, id, y, x)
            if (data.avg == null) data.avg = 0;
            setStoreData(data);
        } catch (err) {
            console.error("가게 정보 불러오기 실패:", err);
        }
    }, []);

    return {
        getStoreData,
        storeData
    };
};