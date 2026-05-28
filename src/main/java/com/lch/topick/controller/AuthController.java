package com.lch.topick.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lch.topick.exception.CustomException;
import com.lch.topick.exception.ErrorCode;
import com.lch.topick.jwtToken.TokenProvider;
import com.lch.topick.web.member.def.entity.Member;
import com.lch.topick.web.member.def.repository.MemberRepository;
import com.lch.topick.web.member.def.service.MemberService;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Transactional //데이터 변화를 자동감지 -> findById() 썼을 경우 save() 안해도 자동 수정 됨
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
	
	private final TokenProvider tokenProvider;
	private final MemberRepository memberRepository;
	private final MemberService memberService;
	
	// accessToken 만료 유무 확인
		
	// accesssToken 만료 -> refreshToken 만료 유무 확인
	// refreshToken 만료 -> 계정 로그아웃 && DB에서도 삭제
	
	
	// accessToken 재발급 메서드
	/*
	 * accessToken 재발급 요청
	 * -> refreshToken 있음
	 * -> DB 확인 : memberId && refreshToken 일치
	 * => accessToken 재발급
	 */
	@PostMapping("/refresh")
	public ResponseEntity<?> newAccesssToken(@CookieValue(value="refreshToken") String refreshToken, 
											HttpServletRequest request, HttpServletResponse response) {
		
		// refreshToken 이 없을 경우 오류 출력
		if (refreshToken == null) {
			throw new CustomException(ErrorCode.JWT_ERROR);
		}
		
		// refreshToken 검증 -> memberId, tokenType, iss, iat, exp 등을 꺼냄
		Claims claims = tokenProvider.validateToken(refreshToken);
				
		// DB 에서 id 찾기
		String memberId = claims.get("memberId", String.class);
		Member member = memberRepository.findById(memberId)
						.orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));
		
		// DB 에 저장된 refreshToken =/= 쿠키에서 보낸 refreshToken 인 경우,
		// -> 계정 로그아웃(DB의 refreshToken 삭제) & 오류 출력
		if ( ! refreshToken.equals(member.getMemberRefreshToken()) ) {
			memberService.logout(memberId);
			throw new CustomException(ErrorCode.JWT_MALFORMED);
		}
		
		// 새 accessToken 발급
		String newAccessToken = tokenProvider.createAccessToken(claims);
		
		// 클라이언트로 전달
		return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
	} //newAccesssToken
	
	
	
	
	
	// refreshToken 발급 -> DB에서도 추가
	
	
} //class
