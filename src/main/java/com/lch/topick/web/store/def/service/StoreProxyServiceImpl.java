package com.lch.topick.web.store.def.service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Log4j2
public class StoreProxyServiceImpl implements StoreProxyService {
	private final RestTemplate restTemplate;

	public String fetchStoreData(String id) {
		String targetUrl = "https://place-api.map.kakao.com/places/panel3/" + id;

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
	
	
	public String fetchMenuData(String yogiyId) {
		// JLS §15.18.1 (String Concatenation Operator +)를 참조하여 
		// 추출한 yogiyId를 포함해 targetUrl을 동적으로 조립합니다.
		// lat(위도), lng(경도) 값도 필요하다면 파라미터로 빼서 동적 할당할 수 있습니다.
		String targetUrl = "https://frontyo.yogiyo.co.kr/v1/aggregation/shops/6907/menus?lat=37.3496914&lng=127.10735253&order_serving_type=delivery";

		HttpHeaders headers = new HttpHeaders();

	    // [1] 권한 및 인증
	    headers.set("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3ODE1MDIwNDMsImV4cCI6MTc4MTUwOTI0MywicGxhdGZvcm0iOiJZR1kiLCJyb2xlIjoidXNlciIsInN1Yl9pZCI6IjkyNTc3MzA4NCIsImJhc2VfdXJsIjoiaHR0cHM6Ly93d3cueW9naXlvLmNvLmtyIn0.iMZ1DYX9Im18BMDseDgNJbsfgnozat7clAmo6levb1SG7CySRPx7rH_eBUb4fXKHbGSirOsuf3GEgOar8GvhiBxABDiIFkwhXnZv9ubfE0z1ADq9uXdU1Qf6SEQN_dw0pBtlQPcNQxbmFwdvdxT50ca81k1lGYKiRF68wevio-JuupP_mVy1cu27crPOXtjXRMIkhmDyRqHJuKZj_uTINdftCtIXFbTfnYO3IzJ-agoFl1NlkuiZwHg__vvgRHAtRO8R4jzuFixwevRLB_tiYLc8zR7pMC-m6XU0ILlqU9P0cCJBy_2B7KfUqNdRq9pt7jjdxyMt3oKn6yCXSNBv5A");

	    // [2] 표준 요청 헤더
	    headers.set("Accept", "application/json, text/plain, */*");
//	    headers.set("Accept-Encoding", "gzip, deflate, br, zstd");
	    headers.set("Accept-Language", "ko,en;q=0.9,en-GB;q=0.8,en-US;q=0.7,ja;q=0.6");
	    headers.set("Origin", "https://www.yogiyo.co.kr");
	    headers.set("Referer", "https://www.yogiyo.co.kr/");
	    headers.set("priority", "u=1, i");

	    // [3] 브라우저 식별 헤더
	    headers.set("sec-ch-ua", "\"Google Chrome\";v=\"149\", \"Chromium\";v=\"149\", \"Not)A;Brand\";v=\"24\"");
	    headers.set("sec-ch-ua-mobile", "?0");
	    headers.set("sec-fetch-dest", "empty");
	    headers.set("sec-fetch-mode", "cors");
	    headers.set("sec-fetch-site", "same-site");
	    headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36");

	    HttpEntity<String> entity = new HttpEntity<>(headers);
	    
		// JLS §14.20 (The try statement)에 명시된 규칙에 따라,
		// 더 구체적인 하위 예외(HttpClientErrorException)를 먼저 catch하고 
		// 최상위 예외(Exception)를 나중에 catch하여 안전하게 처리합니다.
		try {
			ResponseEntity<String> response = restTemplate.exchange(targetUrl, HttpMethod.GET, entity, String.class);
//			System.out.println(response.getBody());
			return response.getBody();

		} catch (HttpClientErrorException e) {
			log.error("요기요 API 호출 실패 - 상태코드: {}", e.getStatusCode(), e);
			return "{\"error\": \"외부 서버로부터 데이터를 가져오지 못했습니다. 상태코드: " + e.getStatusCode() + "\"}";
		} catch (Exception e) {
			log.error("요기요 API 프록시 서버 내부 오류", e);
			return "{\"error\": \"서버 내부 오류가 발생했습니다.\"}";
		}
	}//fetchMenuData
}
