package com.lch.topick.web.member.def.service;

import java.util.List;

import com.lch.topick.web.member.def.domain.MemberJoinRequestDTO;
import com.lch.topick.web.member.def.domain.MemberLoginRequestDTO;
import com.lch.topick.web.member.def.domain.MemberLoginResponseDTO;
import com.lch.topick.web.member.def.domain.MemberRoleUpdateRequestDTO;
import com.lch.topick.web.member.def.domain.MemberRoleUpdateResponseDTO;
import com.lch.topick.web.member.def.domain.MemberUpdateRequestDTO;
import com.lch.topick.web.member.def.entity.Member;

public interface MemberService {
	
	// SELECT 고객 리스트
	public List<Member> selectList();
	
	// SELECT 고객 상세
	public Member selectOne(String memberId);

	// SELECT 회원가입 - Id 중복 확인
	public Boolean exist(String memberId);
	
	// INSERT 회원가입
	public Member insert(MemberJoinRequestDTO requestDto);
	
	// SELECT 로그인
	public MemberLoginResponseDTO login(MemberLoginRequestDTO requestDto);
	
	// INSERT,UPDATE 더미 데이터 전체에 기본 권한 부여 
	public int addDefaultRole();
	
	// UPDATE 기존 계정 권한 수정
	public MemberRoleUpdateResponseDTO updateRole(MemberRoleUpdateRequestDTO requestDto);

	// UPDATE 기존 계정 수정
	public Member update(String memberId, MemberUpdateRequestDTO requestDto);
	
	// UPDATE 회원탈퇴 (status 변경)
	public void delete(String memberId);

}//interface
