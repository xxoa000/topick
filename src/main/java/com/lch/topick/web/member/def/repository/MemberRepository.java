package com.lch.topick.web.member.def.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lch.topick.web.member.def.entity.Member;

public interface MemberRepository extends JpaRepository<Member, String> {
	// findAll() , findById() , save() 등은 기본으로 제공됨
	
	// 예시: SELECT 로그인
	//public Member findById(String memberId);
	
	public boolean existsByMemberPhone(String memberPhone);
	public boolean existsByMemberEmail(String memberEmail);
	
	// 활동 상태의 회원만 검색
	public Optional<Member> findByMemberIdAndMemberStatus(String memberId, String memberStatus);

}//interface
