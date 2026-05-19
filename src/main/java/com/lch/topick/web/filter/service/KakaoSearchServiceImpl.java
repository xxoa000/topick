package com.lch.topick.web.filter.service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.databind.JsonNode;
import com.lch.topick.web.filter.domain.FilterRequestDTO;
import com.lch.topick.web.filter.domain.KeywordRequestDTO;
import com.lch.topick.web.filter.domain.SearchResponseDTO;
import com.lch.topick.web.filter.domain.StoreItemDTO;

import lombok.RequiredArgsConstructor;

@Service
public class KakaoSearchServiceImpl implements KakaoSearchService {

    // 기본 검색어 (키워드 없을 때 사용)
    private static final String DEFAULT_QUERY = "음식점";

    // ──────────────────────────────────────
    // 필드 선언
    // HTTP 요청을 보내는 클라이언트
    private final RestClient restClient;

    // 카카오 API 인증키 (application.properties 에서 가져옴)
    private final String kakaoRestApiKey;
    
    // 생성자 - RestClient 를 미리 만들어둠
    // application.properties 의 kakao.rest-api-key 값을 가져옴
    // 값이 없으면 빈문자열("") 로 기본값 설정
    public KakaoSearchServiceImpl(@Value("${kakao.rest-api-key:}") String kakaoRestApiKey) {
        this.kakaoRestApiKey = kakaoRestApiKey;
        // HTTP 요청을 보낼 수 있는 RestClient 도구 생성
        // builder() : RestClient 만들 준비
        // build()   : RestClient 최종 완성
        // 카카오 API 에 HTTP 요청을 보내기 위한 클라이언트 생성
        this.restClient = RestClient.builder().build();
    }

    @Override
    // 키워드 검색 메서드 - 헤더 검색창에서 검색어 입력 시 사용
    public SearchResponseDTO searchByKeyword(KeywordRequestDTO req) {

        // 요청값 유효성 검사 (좌표값 등이 올바른지 확인)
        vaildateKeyword(req);

        // 중복 제거를 위한 Map (키 = 음식점 id, 값 = 음식점 정보)
        // LinkedHashMap = 입력한 순서를 유지하는 Map
        Map<String, StoreItemDTO> merge = new LinkedHashMap<>();

        // 키워드가 없으면 기본 검색어 사용
        String keyword = (req.getKeyword() == null || req.getKeyword().isBlank())
                ? DEFAULT_QUERY
                : req.getKeyword();

        // 카카오 API 호출
        fetchByQuery(req.getSwX(), req.getSwY(), req.getNeX(), req.getNeY(), keyword, merge);

        // Map 의 값(음식점 정보)들만 꺼내서 List 로 변환
        List<StoreItemDTO> item = new ArrayList<>(merge.values());

        // 최종 응답 객체 생성 후 반환
        // item.size() = 총 음식점 수
        // item = 음식점 목록
        return new SearchResponseDTO(item.size(), item);
    }

    @Override
    // 태그 필터링 메서드 - 필터창에서 태그 선택 시 사용
    public SearchResponseDTO searchByFilter(FilterRequestDTO req) {

        // 요청값 유효성 검사 (좌표값 등이 올바른지 확인)
        vaildateFilter(req);

        // 중복 제거를 위한 Map (키 = 음식점 id, 값 = 음식점 정보)
        // LinkedHashMap = 입력한 순서를 유지하는 Map
        Map<String, StoreItemDTO> merge = new LinkedHashMap<>();

        // 태그들을 검색어 목록으로 변환
        // 예) 태그 = ["혼밥", "조용한"] => ["혼밥", "조용한"]
        List<String> input = buildInput(req.getTagName());

        // 각 태그로 카카오 API 를 호출해서 결과를 merge 에 저장
        for (String i : input) {
            // fetch = 가져오다
            // By = ~ 을 기준으로
            // Query = 검색어
            // 즉, "검색어를 기준으로 데이터를 가져오는 메서드"
            fetchByQuery(req.getSwX(), req.getSwY(), req.getNeX(), req.getNeY(), i, merge);
        }

        // Map 의 값(음식점 정보)들만 꺼내서 List 로 변환
        List<StoreItemDTO> item = new ArrayList<>(merge.values());

        // 최종 응답 객체 생성 후 반환
        // item.size() = 총 음식점 수
        // item = 음식점 목록
        return new SearchResponseDTO(item.size(), item);
    }

    // 하나의 검색어(query) 로 카카오 API 를 호출해서 결과를 merge 에 저장하는 메서드
    // swX, swY = 지도 좌하단 좌표
    // neX, neY = 지도 우상단 좌표
    // query = 검색 키워드 (예: "파스타", "혼밥")
    // merge = 결과를 저장할 Map (중복 제거용)
    private void fetchByQuery(Double swX, Double swY, Double neX, Double neY,
                              String query, Map<String, StoreItemDTO> merge) {

        // 카카오 API 요청 URL 생성
        // 예) https://dapi.kakao.com/v2/local/search/keyword.json?query=파스타&category_group_code=FD6&rect=127.02,37.49,127.05,37.51
        // UriComponentBuilder = 웹 어플리케이션에서 복잡한 URL(URI) 문자열을 오타 없이 안전하고 편리하게 생성하기 위해 빌더 패턴
        // queryParam(key, value) = 주소 뒤에 붙는 파라미터(?key=value)를 안전하게 이어 붙임
        String url = UriComponentsBuilder
                .fromHttpUrl("https://dapi.kakao.com/v2/local/search/keyword.json")
                .queryParam("query", query)
                .queryParam("category_group_code", "FD6")
                .queryParam("rect", swX + "," + swY + "," + neX + "," + neY)
                .build()
                .toUriString();
        
        // 카카오 API 에 GET 요청을 보내고 JSON 응답을 JsonNode 로 받음
        // => 카카오 서버 전송{"documents": [...]} 형태의 JSON 문자열을 바이트로 전송
        // => RestClient 수신 바이트 스트림을 받음
        // => RestClient 내부의 Jackson 라이브러리가 자동으로 JsonNode 로 변환
        // headers = 요청에 대한 헤더값 = 인증정보
        JsonNode root = restClient.get()
                .uri(url) // 요청 URL 설정
                .headers(h -> h.set("Authorization", "KakaoAK " + kakaoRestApiKey)) // 카카오 인증키 헤더 설정
                .accept(MediaType.APPLICATION_JSON) // 응답을 JSON 형식으로 받겠다
                .retrieve() // 실제 HTTP 요청 실행
                .body(JsonNode.class); // 응답을 JsonNode 타입으로 변환

        // 응답이 없거나 documents 가 배열이 아니면 (비정상 응답)
        // 메서드를 즉시 종료 (더 이상 처리 안함)
        if (root == null || !root.path("documents").isArray()) {
            return;
        }

        // 응답 JSON 에서 음식점 목록(documents 배열에서) 만 꺼냄
        // [{"id" : "123", "place_name" : "파스타"...}, {"id" : "456"...}, ...]
        JsonNode docs = root.path("documents");

        // 음식점 목록을 하나씩 순회하며 정보 추출
        for (JsonNode d : docs) {

            // 음식점 이름 (없으면 "" 빈문자열)
            String placeName = d.path("place_name").asText();

            // 카카오맵 URL (없으면 "" 빈문자열)
            String placeUrl = d.path("place_url").asText();

            // 카테고리 (예: "음식점 > 양식", 없으면 "" 빈문자열)
            String categoryName = d.path("category_name").asText();

            // pickAddress() 메서드에서 처리
            // pickAddress = 주소(도로명 주소 우선, 없으면 지번 주소)
            String addressName = pickAddress(d);

            // 경도 (문자열 → Double 변환)
            // x 값이 없으면 "0" 으로 처리
            Double x = Double.parseDouble(d.path("x").asText("0"));

            // 위도 (문자열 → Double 변환)
            // y 값이 없으면 "0" 으로 처리
            Double y = Double.parseDouble(d.path("y").asText("0"));

            // 음식점 고유 ID
            String id = d.path("id").asText(null);

            // 중복이면 건너뜀 (putIfAbsent = 없을 때만 저장)
            merge.putIfAbsent(id, new StoreItemDTO(
                    id,
                    placeName,
                    placeUrl,
                    categoryName,
                    x,
                    y,
                    addressName));
        }
    }

    // 도로명 주소 우선, 없으면 지번 주소 반환
    private String pickAddress(JsonNode d) {
        String road = d.path("road_address_name").asText();
        return !road.isBlank() ? road : d.path("address_name").asText();
    }

    // 태그 목록을 검색어 목록으로 변환
    private List<String> buildInput(List<String> tagName) {
        List<String> input = new ArrayList<>();

        if (tagName != null && !tagName.isEmpty()) {
            for (String tag : tagName) {
                // 태그가 비어있으면 건너뜀
                if (tag == null || tag.isBlank()) {
                    continue;
                }
                // 태그 이름 + "맛집" 으로 변환
                // 예) "혼밥" → "혼밥 맛집"
                // 예) "주차가능" → "주차가능 맛집"
                input.add(tag.trim() + " 맛집");
            }
        }

        // 태그가 없으면 기본 검색어 사용
        if (input.isEmpty()) {
            input.add(DEFAULT_QUERY);
        }
        return input;
    }

    // 키워드 검색 유효성 검사
    // vaildate 는 "이 데이터가 올바른가?" 라는 비즈니스 로직
    // try catch 와 다름 => 이는 발생한 에러를 해결하는데 중심이라면
    // vaildate 는 맞고 틀림을 확인(유효성) 에 중점
    private void vaildateKeyword(KeywordRequestDTO req) {
        if (req == null || req.getNeY() == null || req.getNeX() == null
                || req.getSwY() == null || req.getSwX() == null) {
            throw new IllegalArgumentException("neY, neX, swY, swX are required");
        }
        if (kakaoRestApiKey == null || kakaoRestApiKey.isBlank()) {
            throw new IllegalStateException("kakao.rest-api-key is not configured");
        }
    }

    // 태그 필터링 유효성 검사
    private void vaildateFilter(FilterRequestDTO req) {
        if (req == null || req.getNeY() == null || req.getNeX() == null
                || req.getSwY() == null || req.getSwX() == null) {
            throw new IllegalArgumentException("neY, neX, swY, swX are required");
        }
        if (kakaoRestApiKey == null || kakaoRestApiKey.isBlank()) {
            throw new IllegalStateException("kakao.rest-api-key is not configured");
        }
    }
}