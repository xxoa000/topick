package com.lch.topick.web.store.def.service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.*;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Log4j2
public class StoreProxyServiceImpl implements StoreProxyService {
	private final RestTemplate restTemplate;
	private final ObjectMapper objectMapper = new ObjectMapper();

	public String fetchStoreData(String kakaoId) {
		String targetUrl = "https://place-api.map.kakao.com/places/panel3/" + kakaoId;

		HttpHeaders headers = new HttpHeaders();

		// [1] 보내주신 카카오 내부 앱/플랫폼 식별자 (우회 핵심 데이터)
		headers.set("appversion", "6.6.0");
		headers.set("pf", "PC");

		// [2] 브라우저 표준 헤더 동기화
		headers.set("Accept", "application/json, text/plain, */*");
		headers.set("Accept-Language", "ko,en;q=0.9,en-GB;q=0.8,en-US;q=0.7,ja;q=0.6");
		headers.set("Origin", "https://place.map.kakao.com");
		headers.set("Referer", "https://place.map.kakao.com/");
		headers.set("User-Agent",
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36");
		headers.set("priority", "u=1, i");
		headers.set("Connection", "keep-alive");

		// [3] 최신 브라우저 보안/차단 우회용 크롬 핑거프린트 헤더 설정
		headers.set("sec-ch-ua", "\"Chromium\";v=\"148\", \"Google Chrome\";v=\"148\", \"Not/A)Brand\";v=\"99\"");
		headers.set("sec-ch-ua-mobile", "?0");
		headers.set("sec-ch-ua-platform", "\"Windows\"");
		headers.set("sec-fetch-dest", "empty");
		headers.set("sec-fetch-mode", "cors");
		headers.set("sec-fetch-site", "same-site");

		// 💡 [주의] 쿠키는 만료되기 때문에 우선 주석 처리하고 테스트합니다.
		// 만약 쿠키가 없어서 실패(401, 403 등)한다면 아래 주석을 풀고 유저님의 쿠키를 넣어 확인해 보세요.
		// headers.set("Cookie", "webid=dd2295000ffd... (중략)");

		HttpEntity<String> entity = new HttpEntity<>(headers);

		try {
			ResponseEntity<String> response = restTemplate.exchange(targetUrl, HttpMethod.GET, entity, String.class);
			return response.getBody();
		} catch (HttpClientErrorException e) {
			return "{\"error\": \"외부 서버로부터 데이터를 가져오지 못했습니다. 상태코드: " + e.getStatusCode() + "\"}";
		} catch (Exception e) {
			return "{\"error\": \"서버 내부 오류가 발생했습니다.\"}";
		}
	}//fetchStoreData
	
	public String fetchMenuData(String yogiyId, String lat, String lng) {
        String customerUrl = "https://memberyo.yogiyo.co.kr/v1/customers";
        String targetUrl = "https://frontyo.yogiyo.co.kr/v1/aggregation/shops/" + yogiyId 
        		+ "/menus?lat="+lat+"&lng="+lng+"&order_serving_type=delivery";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", "application/json, text/plain, */*");
        headers.set("Accept-Language", "ko,en;q=0.9");
        headers.set("Origin", "https://www.yogiyo.co.kr");
        headers.set("Referer", "https://www.yogiyo.co.kr/");
        headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36");
        headers.setContentType(MediaType.APPLICATION_JSON);

        try {
            HttpEntity<String> customerEntity = new HttpEntity<>("{}", headers);
            ResponseEntity<String> customerResponse = restTemplate.exchange(customerUrl, HttpMethod.POST, customerEntity, String.class);
            JsonNode customerJson = objectMapper.readTree(customerResponse.getBody());
            String authorizationUrl = customerJson.path("authorization_url").asText();

            if (authorizationUrl == null || authorizationUrl.isEmpty()) {
                log.error("인증 URL(authorization_url) 추출 실패. 응답 바디: {}", customerResponse.getBody());
                return "{\"error\": \"인증 URL을 가져오지 못했습니다.\"}";
            }

            HttpEntity<Void> authEntity = new HttpEntity<>(headers);
            ResponseEntity<String> authResponse = restTemplate.exchange(authorizationUrl, HttpMethod.GET, authEntity, String.class);
            JsonNode authJson = objectMapper.readTree(authResponse.getBody());
            String accessToken = authJson.path("access_token").asText();

            if (accessToken.isEmpty()) {
                accessToken = authJson.path("token").asText();
            }
            if (accessToken.isEmpty()) {
                log.error("최종 Access Token 추출 실패. 응답 바디: {}", authResponse.getBody());
                return "{\"error\": \"Access Token을 파싱하지 못했습니다.\"}";
            }

            headers.set("Authorization", "Bearer " + accessToken);
            HttpEntity<Void> menuEntity = new HttpEntity<>(headers);
            ResponseEntity<String> menuResponse = restTemplate.exchange(targetUrl, HttpMethod.GET, menuEntity, String.class);
            return menuResponse.getBody();

        } catch (HttpClientErrorException e) {
            log.error("요기요 외부 API 호출 에러 - 상태코드: {}, 본문: {}", e.getStatusCode(), e.getResponseBodyAsString(), e);
            return "{\"error\": \"외부 서버 통신 실패. 상태코드: " + e.getStatusCode() + "\"}";
        } catch (Exception e) {
            log.error("프록시 서버 내부 처리 에러 발생", e);
            return "{\"error\": \"서버 내부 오류가 발생했습니다.\"}";
        }
    }
}
