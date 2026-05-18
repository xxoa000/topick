package com.lch.topick.web.member.def.domain;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

//권한 설정 수정 시도시, 클라이언트 -> 서버 
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberRoleUpdateRequestDTO {
	
	// 클라이언트 -> 서버로 요청할때 전송받을 데이터
	private String memberId;
	@Builder.Default //기본값 설정
	private List<MemberRole> roleList = new ArrayList<>();

}
