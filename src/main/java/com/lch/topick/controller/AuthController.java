package com.lch.topick.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lch.topick.exception.CustomException;
import com.lch.topick.exception.ErrorCode;
import com.lch.topick.jwtToken.TokenProvider;
import com.lch.topick.web.member.def.entity.Member;
import com.lch.topick.web.member.def.repository.MemberRepository;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
	
	private final TokenProvider tokenProvider;
	private final MemberRepository memberRepository;
	
	// accessToken 만료 유무 확인
	
	// refreshToken 만료 유무 확인
	
	// accesssToken 만료 -> refreshToken 만료 유무 확인
		// refreshToken 만료 -> 계정 로그아웃 && DB에서도 삭제
//	@PostMapping("/refresh")
//	public ResponseEntity<?> newRefreshToken(@CookieValue(value="refreshToken", required=false) String refreshToken,
//											HttpServletResponse response) {
//		if (refreshToken == null) {
//			throw new CustomException(ErrorCode.JWT_ERROR);
//			memberService.clearToken(refreshToken);
//		}
//		return ;
//	}
	

	// accessToken 만료 -> refreshToken 있음
		// DB 확인 : memberId && refreshToken 일치 유무
		// => accessToken 재발급
	@PostMapping("/refresh")
	public ResponseEntity<?> newAccesssToken(@CookieValue(value="refreshToken") String refreshToken, HttpServletRequest request, HttpServletResponse response) {
		
		// refreshToken 이 담기지 않았을 경우 오류 출력
		if (refreshToken == null) {
			throw new CustomException(ErrorCode.JWT_ERROR);
		}
		
		// refreshToken 을 검증하고 -> memberId, tokenType, iss, iat, exp 등을 꺼냄
		Claims refreshClaimList = tokenProvider.validateToken(refreshToken);
		log.info("refreshClaimList: "+refreshClaimList);
				
		// DB 에서 id 찾기
		String memberId = refreshClaimList.get("memberId", String.class);
		Member member = memberRepository.findById(memberId)
						.orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));
		
		log.info("memberId = {}", memberId);
		log.info("cookie refreshToken = [{}]", refreshToken);
		log.info("db refreshToken     = [{}]", member.getMemberRefreshToken());
		log.info("cookie length = {}", refreshToken.length());
		log.info("db length     = {}", member.getMemberRefreshToken() == null ? null : member.getMemberRefreshToken().length());
		
		
		// DB 에 저장된 refreshToken =/= 쿠키에서 보낸 refreshToken 인 경우 오류 출력
//		if ( ! refreshToken.equals(member.getMemberRefreshToken()) ) {
//			throw new CustomException(ErrorCode.JWT_MALFORMED);
//		}
		// 새 accessToken 발급
		String newAccessToken = tokenProvider.createAccessToken(refreshClaimList);
		
		return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
	} //newAccesssToken
	
	
	
	
	
	// refreshToken 발급 -> DB에서도 추가
	
	
} //class
