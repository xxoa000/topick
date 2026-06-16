package com.lch.topick.web.member.def.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

// 프론트로 전달하여 사용 -> reesponseDto
// 쿠키에 바로 저장 -> refreshToken
@Getter
@AllArgsConstructor
public class MemberLoginResultDTO {
	
	private final MemberLoginResponseDTO responseDto;
	private final String refreshToken;
	
} //class