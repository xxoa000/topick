package com.lch.topick.web.member.def.domain;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;

//권한 설정 수정 시도시, 클라이언트 -> 서버 
@Data
@NoArgsConstructor
public class MemberRoleUpdateRequestDTO {
	
	// 클라이언트 -> 서버로 요청할때 전송받을 데이터
	private String memberId;
	private List<MemberRole> roleList = new ArrayList<>();

}
