import axios from "axios";
import {type KakaoAddressResponse } from "../types/kakaoAddressResponse";

export async function getCoordsByAddress(address: string) {
    // 1. 카카오 REST API 키 (환경변수 권장)
    const KAKAO_KEY = "fe0df8f557406e14aa85bec86f079fc2";

    // 2. 외부 API는 API_BASE_URL을 붙이지 않고 전체 경로를 사용합니다.
    const url = "https://dapi.kakao.com/v2/local/search/address.json";

    try {
        const response = await axios.get<KakaoAddressResponse>(url, {
            headers: {
                // 중요: 카카오는 'KakaoAK ' 접두어를 사용합니다.
                Authorization: `KakaoAK ${KAKAO_KEY}`,
            },
            params: {
                query: address,
            },
        });

        if (response.data.documents.length > 0) {
            return response.data.documents[0]; // { address_name, x, y } 반환
        }
        return null;
    } catch (err: any) {
        console.error(`** Kakao API Error: ${err.message}`);
        return Promise.reject(err.response?.status || 500);
    }
}