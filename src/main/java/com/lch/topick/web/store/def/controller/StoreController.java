package com.lch.topick.web.store.def.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lch.topick.web.store.def.service.StoreProxyService;
import com.lch.topick.web.store.def.service.StoreService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/store")
public class StoreController {
	private final StoreService storeService;
	private final StoreProxyService storeProxyService;
	private final ObjectMapper objectMapper = new ObjectMapper();

	@GetMapping("{storeNo}/kakaoId/{kakaoId}/lat/{lat}/lng/{lng}")
	public ResponseEntity<Map<String, Object>> getStoreDetails(@PathVariable("storeNo") Long storeNo, @PathVariable("kakaoId") String kakaoId,
			@PathVariable("lat") String lat, @PathVariable("lng") String lng) {

		// 1. 카카오 플레이스 데이터 조회
		String jsonResult = storeProxyService.fetchStoreData(kakaoId); // 카카오 가게 데이터
		String yogiyoId = extractYogiyoId(jsonResult); // 요기요 ID
		String jsonResult2 = storeProxyService.fetchMenuData(yogiyoId, lat, lng); // 요기요 메뉴 데이터
		ResponseEntity<Map<String, Object>> result;
		try {

			// 2. 카카오 데이터에서 추출한 동적 ID를 전달하여 요기요 메뉴 데이터 조회
			System.out.println("추출된 요기요 ID: " + yogiyoId);
			System.out.println(jsonResult2);

			JsonNode storeNode = objectMapper.readTree(jsonResult);
			JsonNode menuNode = objectMapper.readTree(jsonResult2);

			// 자바 컬렉션 프레임워크의 Map을 생성하여 두 데이터를 깔끔하게 key-value로 묶어줍니다.
			Map<String, Object> combinedResponse = new HashMap<>();
			combinedResponse.put("storeDetails", storeNode);
			combinedResponse.put("menuData", menuNode);

			result = ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(combinedResponse);

		} catch (Exception e) {
			System.err.println("요기요 ID 추출 중 예외 발생: " + e.getMessage());

			// 💡 [여기서 에러가 났던 것임!] 에러 발생 시 프론트엔드에 보낼 에러 Map 객체를 반환합니다.
			Map<String, Object> errorResponse = new HashMap<>();
			errorResponse.put("error", "서버 내부 오류가 발생했습니다.");
			errorResponse.put("message", e.getMessage());

			result =  ResponseEntity.internalServerError().body(errorResponse);
		}

		storeService.saveMenuData(jsonResult, jsonResult2, storeNo);
		//jsonResult, jsonResult, storeNo 데이터를 인자로 넣어서 필요한 엔티티값을 구해서 Repository save하는 serviceImpl 메서드 호출
		
		return result;
	}// getStoreDetails

	// 요기요 ID 추출 헬퍼 메서드
	private String extractYogiyoId(String jsonResult) {
		String yogiyoId = "";
		try {
			// String 구조의 JSON 데이터를 트리 객체로 변환
			JsonNode rootNode = objectMapper.readTree(jsonResult);

			// 중첩 구조 깊숙이 있는 "yogiyo_menu_url" 노드를 검색
			JsonNode urlNode = rootNode.findValue("yogiyo_menu_url");
			System.out.println(urlNode);
			if (urlNode != null && !urlNode.asText().isEmpty()) {
				String fullUrl = urlNode.asText();

				int startIndex = fullUrl.indexOf("shops/");
				if (startIndex != -1) {
					startIndex += 6; // "shops/" 문자열의 길이만큼 인덱스 시작점 이동

					// 시작점 이후로 처음 나타나는 슬래시('/')의 위치를 찾습니다.
					int endIndex = fullUrl.indexOf("/", startIndex);

					if (endIndex != -1) {
						// 슬래시가 있다면 그 전까지만 자름 (352667 추출)
						yogiyoId = fullUrl.substring(startIndex, endIndex);
					} else {
						// 혹시나 /menu가 없고 바로 ?order_... 가 붙는 예외 케이스 방어
						int queryIndex = fullUrl.indexOf("?", startIndex);
						if (queryIndex != -1) {
							yogiyoId = fullUrl.substring(startIndex, queryIndex);
						} else {
							yogiyoId = fullUrl.substring(startIndex);
						}
					}

				}
			}
		} catch (Exception ignored) {
		}
		return yogiyoId; // 실패 시 Fallback 기본값
	}// extractYogiyoId

}