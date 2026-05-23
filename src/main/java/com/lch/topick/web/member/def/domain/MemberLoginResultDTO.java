package com.lch.topick.web.member.def.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MemberLoginResultDTO {
	
	private final MemberLoginResponseDTO responseDto;
	private final String refreshToken;
	
} //class