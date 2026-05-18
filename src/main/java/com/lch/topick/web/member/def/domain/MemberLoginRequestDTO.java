package com.lch.topick.web.member.def.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

// 로그인 시도시, 클라이언트 -> 서버
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberLoginRequestDTO {
	
	// 클라이언트 -> 서버로 요청할때 전송받을 데이터
	private String memberId;
	private String memberPw;

}//class
