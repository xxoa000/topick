package com.lch.topick.web.member.def.service;

import java.util.List;
import com.lch.topick.web.member.def.domain.MemberJoinRequestDTO;
import com.lch.topick.web.member.def.domain.MemberLoginRequestDTO;
import com.lch.topick.web.member.def.domain.MemberLoginResultDTO;
import com.lch.topick.web.member.def.domain.MemberRoleUpdateRequestDTO;
import com.lch.topick.web.member.def.domain.MemberRoleUpdateResponseDTO;
import com.lch.topick.web.member.def.domain.MemberUpdateRequestDTO;
import com.lch.topick.web.member.def.entity.Member;

public interface MemberService {
	
	// Read) SELECT 고객 리스트
	public List<Member> selectList();
	
	// Read) SELECT 고객 상세
	public Member selectOne(String memberId);
	
	

	// Create) SELECT 회원가입 - Id 중복 확인
	public Boolean exist(String memberId);
	
	// Create) INSERT 회원가입
	public Member insert(MemberJoinRequestDTO requestDto);
	
	// Read) SELECT 로그인
	public MemberLoginResultDTO login(MemberLoginRequestDTO requestDto);
	
	// Read) SELECT 로그아웃
	public void logout(String memberId);
	
	
	// Update) UPDATE 기존 계정 권한 수정
	public MemberRoleUpdateResponseDTO updateRole(MemberRoleUpdateRequestDTO requestDto);

	// Update) UPDATE 기존 계정 수정
	public Member update(String memberId, MemberUpdateRequestDTO requestDto);
	
	// Update) UPDATE 회원탈퇴 (status 변경)
	public void resign(String memberId);
	
	
	
	// Update) INSERT,UPDATE 더미 데이터 전체에 기본 권한 부여 
	public int addDefaultRole();
	

}//interface
