export interface KakaoAddressResponse {
    documents: {
        y: string; // 위도 (latitude)
        x: string; // 경도 (longitude)
    }[];
    meta: {
        total_count: number;
    };
}

// Java 서버로 보낼 DTO 타입 정의
export interface LocationSaveRequest {
    memberId: string | number | undefined;
    addressPostcode: string;
    addressRoad: string;
    addressLot: string;
    addressDetail: string;
    addressName: string;
    addressX: string;
    addressY: string;
}