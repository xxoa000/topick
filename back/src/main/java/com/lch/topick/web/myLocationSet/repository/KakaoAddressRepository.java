package com.lch.topick.web.myLocationSet.repository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@Repository
public class KakaoAddressRepository {

    // application.properties에 등록한 REST API 키를 자동으로 가져옵니다.
    @Value("${kakao.rest-api-key}")
    private String kakaoRestApiKey;

    // 카카오 주소 검색 API 기본 URL
    private final String KAKAO_ADDRESS_URL = "https://dapi.kakao.com/v2/local/search/address.json";

    /**
     * 도로명 주소를 받아서 카카오 API를 호출하고 위도(latitude), 경도(longitude)를 반환합니다.
     */
    public Map<String, String> findCoordinateByAddress(String roadAddress) {
        RestTemplate restTemplate = new RestTemplate();

        // 1. 헤더 설정 (Authorization: KakaoAK {REST_API_KEY})
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK " + kakaoRestApiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        // 2. 한글 주소가 깨지지 않도록 URI 빌더를 사용해 안전하게 URL 인코딩 및 조립
        URI targetUrl = UriComponentsBuilder.fromHttpUrl(KAKAO_ADDRESS_URL)
                .queryParam("query", roadAddress)
                .build()
                .encode(StandardCharsets.UTF_8)
                .toUri();

        try {
            // 3. 카카오 서버로 GET 요청 전송 및 응답 수신
            ResponseEntity<Map> response = restTemplate.exchange(targetUrl, HttpMethod.GET, entity, Map.class);
            Map<String, Object> body = response.getBody();

            if (body != null) {
                List<Map<String, Object>> documents = (List<Map<String, Object>>) body.get("documents");

                // 검색된 결과가 존재하는지 체크
                if (documents != null && !documents.isEmpty()) {
                    // 가장 매칭 확률이 높은 첫 번째 결과 데이터를 가져옴
                    Map<String, Object> firstResult = documents.get(0);

                    // 카카오 스펙: x는 경도(longitude), y는 위도(latitude) 문자열
                    String x = (String) firstResult.get("x"); 
                    String y = (String) firstResult.get("y"); 

                    // 직관적인 이름으로 다시 묶어서 서비스 레이어로 반환
                    return Map.of(
                        "longitude", x,
                        "latitude", y
                    );
                }
            }
        } catch (Exception e) {
            // 에러 발생 시 로그를 찍고 0,0 좌표를 반환 (서버 다운 방지 예외 처리)
            System.err.println("카카오 주소 변환 중 에러 발생: " + e.getMessage());
        }

        // 결과가 없거나 에러가 나면 기본값 반환
        return Map.of("longitude", "0.0", "latitude", "0.0");
    }
}