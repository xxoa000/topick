package com.lch.topick.jwtToken;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.util.StringUtils;
import com.fasterxml.jackson.core.type.TypeReference;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

/* JWT 인증 필터
 *
 * 역할:
 * - 모든 요청이 Controller에 도착하기 전에 먼저 실행됨
 * - Authorization 헤더에서 JWT 토큰을 꺼냄
 * - 토큰이 있으면 TokenProvider로 검증함
 * - 토큰 안의 memberId, roleList를 꺼냄
 * - Spring Security의 SecurityContextHolder에 인증 정보를 등록함
 *
 * 즉, 이 필터를 통과한 뒤에는 Spring Security가
 * "이 요청은 로그인한 사용자의 요청이다"라고 인식할 수 있음.
 */


@Log4j2
@Component     // 컴포넌트 에너테이션 : 서버 흐름에 포함되지 않는 기타 Bean 객체들에 지정
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final TokenProvider tokenProvider;
	private final ObjectMapper objectMapper = new ObjectMapper();
	

	
	/* 1. Authorization 헤더에서 Bearer 토큰을 꺼냄.
	 *
	 * 요청 헤더 예:
	 * Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
	 *
	 * 여기서는 앞의 "Bearer " 7글자를 제거하고
	 * 순수 JWT 문자열만 반환함. */
	private String parseBearerToken(HttpServletRequest request) {
		
		String bearerToken = request.getHeader("Authorization");
		
		if ( StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ") ) {
			return bearerToken.substring(7);
		}
		
		return null;
	
	} //parseBearerToken
	
	
	
	// 2. JWT 토큰으로 Spring Security 인증 객체를 생성하고 등록함.
	private void authenticateByToken(String token, HttpServletRequest request) {

		Claims claims = tokenProvider.validateToken(token);
		String memberId = claims.get("memberId", String.class);
		List<String> roleList = objectMapper.convertValue(
				claims.get("roleList"),
				new TypeReference<List<String>>() {}
		);
		
		/* roleList의 값을 Spring Security 권한 형식으로 변환함.
		 *
		 * 예:
		 * MEMBER -> ROLE_MEMBER
		 * ADMIN  -> ROLE_ADMIN */
		List<SimpleGrantedAuthority> authorities = roleList.stream()
				.map(role -> new SimpleGrantedAuthority("ROLE_" + role))
				.toList();
		
		/* UsernamePasswordAuthenticationToken
		 *
		 * 첫 번째 값: principal
		 * - 현재 로그인한 사용자 식별값
		 * - 여기서는 memberId를 넣음
		 *
		 * 두 번째 값: credentials
		 * - 비밀번호 자리
		 * - JWT 인증에서는 이미 토큰 검증이 끝났으므로 null 사용
		 *
		 * 세 번째 값: authorities
		 * - 현재 사용자의 권한 목록 */
		
		AbstractAuthenticationToken authentication =
				new UsernamePasswordAuthenticationToken(memberId, null, authorities);

		/* 인증 요청의 부가 정보 등록.
		 * 예: IP, 세션 ID 같은 request 기반 정보. */
		
		authentication.setDetails(
				new WebAuthenticationDetailsSource().buildDetails(request)
		);
		
		/* SecurityContextHolder에 인증 정보를 등록함.
		 * 이 등록이 끝나야 Spring Security 가 현재 요청을 인증된 요청으로 취급함. */
		SecurityContextHolder.getContext().setAuthentication(authentication);
	
	} //authenticateByToken
	
	
	
	

	
	
	// 3. 헤더에서 accessToken 을 꺼내 검증 -> 검증 성공시 로그인 사용자, 검증 실패시 비로그인 사용자로 취급
	@Override
	protected void doFilterInternal(
			HttpServletRequest request, 
			HttpServletResponse response, 
			FilterChain filterChain
	) throws ServletException, IOException {
		
		try {
			String token = parseBearerToken(request);
			/* 
			 * 토큰이 없으면 인증 처리를 하지 않음.
			 * 이 경우 바로 다음 필터 또는 Controller로 요청을 넘김.
			 * "null" 문자열 체크는 프론트에서 실수로 Authorization: Bearer null
			 * 형태를 보낼 가능성을 방어하기 위한 코드임.
			 */
			if (token != null && !token.equalsIgnoreCase("null")) {
				authenticateByToken(token, request);
			}
			
		} catch (Exception e) {
			/*
			 * JWT 검증 중 오류가 발생하면 현재 요청의 인증 정보를 비움.
			 *
			 * 여기서 예외를 다시 던지지 않으면 요청은 계속 다음 단계로 넘어감.
			 * 보호된 API라면 이후 SecurityConfig의 권한 설정에서 차단됨.
			 */
			log.error("JWT 인증 필터 오류: {}"+e.getMessage());
			SecurityContextHolder.clearContext();
		} //try
		
		filterChain.doFilter(request, response);
		
	} //doFilterInternal
	
}//class
