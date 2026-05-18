package com.lch.topick.web.member.def.service;

import java.util.List;

import com.lch.topick.web.member.def.domain.MemberJoinRequestDTO;
import com.lch.topick.web.member.def.domain.MemberLoginRequestDTO;
import com.lch.topick.web.member.def.domain.MemberLoginResponseDTO;
import com.lch.topick.web.member.def.domain.MemberUpdateRequestDTO;
import com.lch.topick.web.member.def.entity.Member;

public interface MemberService {
	
	// SELECT 고객 리스트
	public List<Member> selectList();
	
	// SELECT 고객 상세
	public Member selectOne(String memberId);

	// SELECT 회원가입 - Id 중복 확인
	public Boolean exist(String newId);
	
	// INSERT 회원가입
	public Member insert(MemberJoinRequestDTO dto);
	
	// SELECT 로그인
	public MemberLoginResponseDTO login(MemberLoginRequestDTO dto);

	// UPDATE 기존 계정 수정
	public Member update(String memberId, MemberUpdateRequestDTO requestDto);
	
	// resign 회원탈퇴
	public void delete(String memberId);

}//interface
