package com.lch.topick.web.member.def.domain;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

//권한 설정 수정 시도시, 서버 -> 클라이언트 
@Getter
@AllArgsConstructor
public class MemberRoleUpdateResponseDTO {
	
	// 서버 -> 클라이언트 데이터
	private String memberId;
	private List<MemberRole> roleList; //serviceImpl 에서 직접 값 넣을 예정이라 초기화 필요 x

}
