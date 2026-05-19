package com.lch.topick.web.member.def.domain;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

// 회원가입 시도시, 클라이언트 -> 서버로 보내는 데이터를 담기 위한 DTO 객체
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberJoinRequestDTO {
	
	// 클라이언트 -> 서버로 요청할때 전송받을 데이터
	private String memberId;
	private String memberPw;
	
	private String memberName;
	private String memberEmail;
	private String memberPhone;
	private String memberGender;
	private LocalDate memberBirthday;

}//class
