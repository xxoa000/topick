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

// 백엔드에서 받아올 주소 객체 타입
export interface AddressItem {
    addressNo: number; // 혹은 주소 고유 식별자 키
    memberId: string | number;
    addressPostcode: string;
    addressRoad: string;
    addressLot: string;
    addressDetail: string;
    addressName: string;
    addressX: string;
    addressY: string;
    addressDefault: string;
}