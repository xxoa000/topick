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
import com.lch.topick.web.store.let.domain.FilterStoreItemDTO;
import com.lch.topick.web.store.let.domain.FilterStoreRequestDTO;
import com.lch.topick.web.menu.def.entity.Menu;
import com.lch.topick.web.menu.def.repository.MenuRepository;
import com.lch.topick.web.menu.let.domain.MenuDTO;
import com.lch.topick.web.store.let.entity.FilterStore;
import com.lch.topick.web.store.let.repository.FilterStoreRepository;
import com.lch.topick.web.store.let.service.FilterStoreService;


@Service
public class KakaoSearchServiceImpl implements KakaoSearchService {

    // 기본 검색어 (키워드 없을 때 사용)
    private static final String DEFAULT_QUERY = "음식점";

    // HTTP 요청을 보내는 클라이언트
    private final RestClient restClient;

    // 카카오 API 인증키 (application.properties 에서 가져옴)
    private final String kakaoRestApiKey;

    // Store DB 접근
    private final FilterStoreRepository storeRepository;

    // Store 저장·태그 연결
    private final FilterStoreService filterStoreService;

    // Menu DB 접근
    private final MenuRepository menuRepository;

    // 생성자
    // Http 요청을 보내는 줄
    public KakaoSearchServiceImpl(
            @Value("${kakao.rest-api-key:}") String kakaoRestApiKey,
            FilterStoreRepository storeRepository,
            FilterStoreService filterStoreService,
            MenuRepository menuRepository) {
        this.kakaoRestApiKey = kakaoRestApiKey;
        this.restClient = RestClient.builder().build();
        this.storeRepository = storeRepository;
        this.filterStoreService = filterStoreService;
        this.menuRepository = menuRepository;
    }

    @Override
    // 키워드 검색 메서드 - 헤더 검색창에서 검색어 입력 시 사용
    public SearchResponseDTO searchByKeyword(KeywordRequestDTO req) {
    	
    	//유효성 검사
        vaildateKeyword(req);

        Map<String, FilterStoreItemDTO> merge = new LinkedHashMap<>(); //임시저장소	

        String keyword = (req.getKeyword() == null || req.getKeyword().isBlank())
                ? DEFAULT_QUERY
                : req.getKeyword();

        fetchByQuery(req.getSwX(), req.getSwY(), req.getNeX(), req.getNeY(), keyword, merge);

        List<FilterStoreItemDTO> item = new ArrayList<>(merge.values());
        filterStoreService.saveStoresIfAbsent(item);
        filterStoreService.enrichStoreNumbers(item);

        return new SearchResponseDTO(item.size(), item);
    }

    @Override
    // 태그 필터링 메서드 - 필터창에서 태그 선택 시 사용
    public SearchResponseDTO searchByFilter(FilterRequestDTO req) {

        vaildateFilter(req);

        Map<String, FilterStoreItemDTO> merge = new LinkedHashMap<>();

        List<String> input = buildInput(req.getTagName());

        for (String i : input) {
            fetchByQuery(req.getSwX(), req.getSwY(), req.getNeX(), req.getNeY(), i, merge);
        }

        List<FilterStoreItemDTO> item = new ArrayList<>(merge.values());
        filterStoreService.saveStoresIfAbsent(item);
        filterStoreService.enrichStoreNumbers(item);
        filterStoreService.linkStoresToTags(item, req.getTagName());

        return new SearchResponseDTO(item.size(), item);
    }

    @Override
    // 저장된 가게의 메뉴 조회 (가게 저장은 검색 결과 반환 시 수행)
    public List<MenuDTO> menuList(FilterStoreRequestDTO req) {

    	FilterStore store = resolveStore(req);
    	if (store == null) {
    	    return List.of();
    	}

        return menuRepository.findByStoreNo(store.getStoreNo()).stream()
                .map(menu -> new MenuDTO(
                        menu.getMenuNo(),
                        menu.getMenuName(),
                        menu.getMenuPrice()))
                .toList();
    }

    // 하나의 검색어(query) 로 카카오 API 를 호출해서 결과를 merge 에 저장하는 메서드
    private void fetchByQuery(Double swX, Double swY, Double neX, Double neY,
                              String query, Map<String, FilterStoreItemDTO> merge) {

        String url = UriComponentsBuilder
                .fromHttpUrl("https://dapi.kakao.com/v2/local/search/keyword.json")
                .queryParam("query", query)
                .queryParam("category_group_code", "FD6")
                .queryParam("rect", swX + "," +swY + "," + neX + "," + neY)
                .build()
                .toUriString();

        JsonNode root = restClient.get()
                .uri(url)
                .headers(h -> h.set("Authorization", "KakaoAK " + kakaoRestApiKey))
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .body(JsonNode.class);
        
        if (root == null || !root.path("documents").isArray()) {
            return;
        }

        JsonNode docs = root.path("documents");

        for (JsonNode d : docs) {

            String placeName = d.path("place_name").asText();
            String placeUrl = d.path("place_url").asText();
            String categoryName = d.path("category_name").asText();
            String addressName = pickAddress(d);
            Double x = Double.parseDouble(d.path("x").asText("0"));
            Double y = Double.parseDouble(d.path("y").asText("0"));
            String id = d.path("id").asText(null);

            merge.putIfAbsent(id, new FilterStoreItemDTO(
                    id,
                    null,
                    placeName,
                    placeUrl,
                    categoryName,
                    x,
                    y,
                    addressName));
        }
    }

    private FilterStore resolveStore(FilterStoreRequestDTO req) {
        if (req == null) {
            return null;
        }
        if (req.getStoreNo() != null) {
            return storeRepository.findById(req.getStoreNo()).orElse(null);
        }
        String kakaoId = req.getKakaoId();
        if (kakaoId == null || kakaoId.isBlank()) {
            return null;
        }
        return storeRepository.findByKakaoId(kakaoId.trim());
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
                if (tag == null || tag.isBlank()) {
                    continue;
                }
                input.add(tag.trim() + " 맛집");
            }
        }

        if (input.isEmpty()) {
            input.add(DEFAULT_QUERY);
        }
        return input;
    }

    // 키워드 검색 유효성 검사
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