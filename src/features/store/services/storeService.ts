import { publicApiClient } from '@/config/axios';

export const storeService = {

    getStoreData: async (storeNo: number, id: string, y: string, x: string): Promise<any> => {
        const response = await publicApiClient.get<any>(`/store/${storeNo}/kakaoId/${id}/lat/${y}/lng/${x}`);
        return response.data;
    }
};