package com.lch.topick.web.member.def.domain;


import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

// 로그인 성공시, 서버 -> 클라이언트로 내보내는 DTO 객체
@Getter
@Builder
@AllArgsConstructor
public class MemberLoginResponseDTO {

	// 서버 -> 클라이언트로 내보내는 데이터
	private final String memberId;
	private final String memberName;
	private final String accessToken;
	
	
	@Builder.Default
	private List<MemberRole> roleList = new ArrayList<>();
	
}//class