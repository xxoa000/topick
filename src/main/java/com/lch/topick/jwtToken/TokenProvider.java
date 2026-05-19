package com.lch.topick.jwtToken;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.lch.topick.exception.CustomException;
import com.lch.topick.exception.ErrorCode;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.Keys;


@Service
public class TokenProvider {
	
	// 암호키와 엑세스토큰 만료시간(Exp: Expiration)
	private final String secretKey;
	private final long accessTokenExp;
	
	/* 깃허브에 올라갈 코드 내부에 시크릿 키가 공개되어 있으면 보안상 위험, 때문에 환경변수로 등록 후 불러오는 방식 사용
	 * application.properties 에 jwt 관련 코드 추가됨 -> 환경변수 등록 후 export 
	 * (시크릿 키 값은 팀원마다 달라도 로컬 서버기 때문에 상관없음, 배포시엔 배포 서버 쪽에서 등록) 
	 */
	public TokenProvider(@Value("${jwt.secret}") String secretKey, 
					     @Value("${jwt.access-token-expiration}") long accessTokenExp) {
		this.secretKey = secretKey;
		this.accessTokenExp = accessTokenExp;
	}
	
	// 1. Role 을 Token 에 포함한 JWT Token 발급
	public String createToken(Map<String, Object> claimList) {
												  // memberId, roleList
		
		if ( secretKey ==null || secretKey.isBlank() ) throw new CustomException(ErrorCode.ACCESS_DENIE);
		SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
		
		Instant now = Instant.now(); 								// 토큰 발급 시간
		Instant exp = now.plusMillis(accessTokenExp); 				// 토큰 만료 시간
		
		/* JWT 생성 단계
	     *	-> Header(자동생성 되기도함) -> Payload(Claims) 설정 -> Signature(서명) -> 최종문자열 생성
	     *     참고로 demo 라이브러리 11 / 우리 라이브러리 12 라서 빌더 방식이 달라짐 */
		return Jwts.builder()
					.header() 					// => JSON { "typ": JWT }
						.type("JWT") 				// JWT 타입이라는 뜻, 대소문자 구분 x 지만 레거시에선 대문자 사용
						.and()       				// 헤더의 끝을 의미
					.claims(claimList)			// => JSON { "iss": "topick app", "iat":"...", "exp":"..." }
					.issuer("topick app")   		// 발행자
					.issuedAt(Date.from(now))		// 토큰 발급 시간
					.expiration(Date.from(exp)) 	// 토큰 만료 시간
					.signWith(key)   			// 서명, 헤더에 "alg":"..." 를 자동으로 넣어줌
					.compact();
	} //createToken
	
	
	
	
	/* 2. Role을 Token에 포함한 검증
	 * token 의 값을 디코딩 & 파싱 하여 위조여부 확인 -> Claims 타입으로 return */
	
	public Claims validateToken(String token) {
		
		if ( secretKey ==null || secretKey.isBlank() ) throw new CustomException(ErrorCode.ACCESS_DENIE);
		SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
		
		// 1.1 JSON 데이터의 Payload(Claims) 에 해당되는 부분을 return
		try { return Jwts.parser()
				   .verifyWith(key)
				   .build()
				   .parseSignedClaims(token)
				   .getPayload();
		
		// 2.2 오류 처리
		} catch (ExpiredJwtException e) {
	        throw new CustomException(ErrorCode.JWT_EXPIRED);
	
	    } catch (MalformedJwtException e) {
	        throw new CustomException(ErrorCode.JWT_MALFORMED);
	
	    } catch (JwtException e) {
	        throw new CustomException(ErrorCode.JWT_ERROR);
	    } //try
		
		
		
	} //validateToken
	

}//class
