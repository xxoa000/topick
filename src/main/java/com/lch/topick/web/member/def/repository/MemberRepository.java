package com.lch.topick.web.member.def.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lch.topick.web.member.def.entity.Member;

public interface MemberRepository extends JpaRepository<Member, String> {
	// findAll() , findById() , save() 등은 기본으로 제공됨
	
	// 예시: SELECT 로그인
	//public Member findById(String memberId);

}//interface
