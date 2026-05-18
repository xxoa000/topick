package com.lch.topick.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.lch.topick.jwtToken.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

/* SecurityConfig
 * 	: 애플리케이션의 보안 관련 설정을 관리하는 설정 파일.

 * 	주요 역할
 * 	- 인증(Authentication)과 인가(Authorization) 설정
 * 	- Spring Security 필터 체인 설정
 * 	- JWT 인증 필터 같은 커스텀 필터 등록
 * 	- 비밀번호 암호화 설정을 추가할 수 있는 위치


 * Spring Security의 핵심 개념
 * 
 * 1. 인증(Authentication)
 *    - 사용자가 누구인지 확인하는 과정
 *    - 예: 로그인 시 아이디/비밀번호 확인, JWT 토큰 검증
   
 * 2. 인가(Authorization)
 *    - 인증된 사용자가 특정 API나 기능을 사용할 권한이 있는지 확인하는 과정
 *    - 예: ADMIN만 관리자 API 접근 가능, OWNER만 점주 API 접근 가능


 * SecurityFilterChain
 * 	: 클라이언트의 요청이 Controller 에 도착하기 전에 먼저 거치는 보안 필터들의 묶음.

 * 요청 흐름
 * 클라이언트 요청
 * → SecurityFilterChain
 * → JWT 인증 필터
 * → 권한 검사
 * → Controller


 * HttpSecurity 기본 설정

 * 1. httpBasic
 *    - 요청마다 사용자 아이디와 비밀번호를 HTTP Header 에 담아 인증하는 방식이다.
 *    - JWT 방식에서는 사용하지 않으므로 비활성화한다.

 * 2. formLogin
 *    - Spring Security 가 기본으로 제공하는 로그인 폼 화면이다.
 *    - React 같은 프론트엔드에서 JSON으로 로그인 요청을 보내고,
 *      서버가 JWT를 발급하는 구조에서는 필요하지 않으므로 비활성화한다.

 * 3. logout
 *    - Spring Security 가 제공하는 기본 로그아웃 기능이다.
 *    - JWT 방식은 서버 세션을 사용하지 않기 때문에,
 *      보통 클라이언트가 저장한 토큰을 삭제하는 방식으로 로그아웃을 처리한다.
 *    - 따라서 기본 로그아웃 기능은 비활성화한다.

 * 4. csrf
 *    - CSRF 공격을 막기 위한 보호 기능이다.
 *    - 서버 세션과 쿠키 기반 인증에서는 중요하지만,
 *      JWT처럼 토큰을 Authorization Header 에 담아 보내는 무상태 인증 방식에서는
 *      일반적으로 비활성화한다.

 * 5. cors
 *    - 다른 출처의 프론트엔드에서 백엔드 API를 호출할 수 있도록 허용하는 설정이다.
 *    - 예: React 개발 서버(http://localhost:5173 또는 5174)에서
 *      Spring Boot 서버(http://localhost:8080)로 요청을 보내는 경우 필요하다.

 * 6. sessionManagement
 *    - 세션 생성 정책을 설정한다.
 *    - JWT는 서버가 로그인 상태를 세션에 저장하지 않는 무상태 인증 방식이다.
 *    - 따라서 SessionCreationPolicy.STATELESS로 설정하여
 *      서버가 세션을 생성하거나 저장하지 않도록 한다.


 * @EnableWebSecurity
 * 	: Spring Security의 웹 보안 기능을 활성화하는 애너테이션이다.

 * 	역할
 * 	- Spring Security 필터 체인이 동작하도록 설정
 * 	- 요청에 대해 인증과 인가 검사를 수행하도록 활성화
 * 	- 커스텀 SecurityFilterChain 설정을 사용할 수 있게 함

 * 	참고
 * 	- Spring Boot에서는 보안 자동 설정이 기본으로 동작하지만,
 *    직접 SecurityConfig를 작성해서 프로젝트에 맞는 보안 규칙을 커스텀할 수 있다.
 * 	- 보통 @Configuration과 함께 사용한다.


 * @EnableMethodSecurity
 * : 메서드 단위의 권한 검사 기능을 활성화하는 애너테이션
 *
 * 	활성화되는 대표 기능
 * 	- @PreAuthorize
 * 	- @PostAuthorize
 * 	- @Secured
 * 	- @RolesAllowed

 * 	- Controller나 Service 메서드 위에 권한 조건을 직접 붙일 수 있음
 * 		예:
 * 		@PreAuthorize("hasRole('ADMIN')")
 * 		public void adminOnlyMethod() {
 *     		...
 * 		}
 */



// 보안, 권한 인가 관련 설정 파일
@Configuration
@EnableWebSecurity 		//스프링 시큐리티 활성화, 필터 체인이 동작하며 요청을 인증 & 인가 함.
@EnableMethodSecurity   //메서드 단위의 권한 검사기능 활성화
@RequiredArgsConstructor
public class SecurityConfig {
	
	private final JwtAuthenticationFilter jwtAuthenticationFilter;
	
	@Bean
	SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		
		// 1. Filter 등록
		http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
		/* jwtAuthenticationFilter: JWT 인증용 커스텀 필터, 유효성 검사, 토큰 기반 인증 처리
		 * UsernamePasswordAuthenticationFilter.class : 스프링 시큐리티 기본 필터 (폼 로그인 시 사용자 이름과 비밀번호를 받아 인증)
         * Before 인 이유는 JWT 인증 필터가 먼저 실행되도록 하기 위해
         
         * 동작 순서
         * 1. jwtAuthenticationFilter(jwt 인증 필터)가 먼저 실행 -> Request 헤더의 JWT 토큰 검사 -> 인증 객체 생성 or 실패 처리
         * 2. UsernamePasswordAuthenticationFilter 가 실행 되어 로그인 처리
         * 3. 만약 JWT 토큰이 유효할 경우, 이 후 필터는 이미 인증된 상태로 Request 처리(로그인 유지의 경우) */
		
		
		// 2. HttpSecurity 빌더 설정 & return
		return http.httpBasic(httpBasic -> httpBasic.disable())								// HTTP 기본 인증 비활성화
				.formLogin(formLogin -> formLogin.disable())								// 기본 formLogin 비활성화
				.logout(logout -> logout.disable())											// 기본 logout 비활성화
				.csrf(csrf -> csrf.disable())												// CSRF 비활성화_필수항목
				.cors(cors -> {})															// CORS 설정 활성화(기본값)_필수항목
				.sessionManagement(session -> session
						.sessionCreationPolicy(SessionCreationPolicy.STATELESS))			// 세션 비활성화(무상태) -> 매 요청마다 인증 하도록
				.authorizeHttpRequests(auth -> auth 										// authorizeHttpRequests : 인가 규칙 정의, 경로별 권한 설정
						.requestMatchers("/api/admin/**").hasRole("ADMIN")
						.requestMatchers("/api/owner/**").hasRole("OWNER")
						.requestMatchers("/api/payment/**", "/api/myPage/**").hasRole("MEMBER")
						.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
						.anyRequest().permitAll()) 											// 모든요청 허용
				.build();
		
	} //filterChain

	
}//class
