export interface KakaoAddressResponse {
        documents: {
            y: string; // 위도 (latitude)
            x: string; // 경도 (longitude)
        }[];
        meta: {
            total_count: number;
        };
    }