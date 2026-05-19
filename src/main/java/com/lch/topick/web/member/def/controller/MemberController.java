package com.lch.topick.web.member.def.controller;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lch.topick.web.member.def.domain.MemberJoinRequestDTO;
import com.lch.topick.web.member.def.domain.MemberLoginRequestDTO;
import com.lch.topick.web.member.def.domain.MemberRoleUpdateRequestDTO;
import com.lch.topick.web.member.def.domain.MemberUpdateRequestDTO;
import com.lch.topick.web.member.def.entity.Member;
import com.lch.topick.web.member.def.service.MemberService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
public class MemberController {

	private final MemberService memberService;

	
	// 전체 고객 리스트
	@GetMapping("/list")
	public ResponseEntity<?> selectList() {
		
		return ResponseEntity.status(HttpStatus.OK)
							 .body(memberService.selectList());
	}// selectList
	
	
	
	// 고객 상세(내 정보 보기)
	@GetMapping("/{memberId}")
	public ResponseEntity<?> selectOne(@PathVariable String memberId) {
		
		return ResponseEntity.status(HttpStatus.OK)
							 .body(memberService.selectOne(memberId));
	}// selectOne

	
	
	// 회원가입 - Id 중복 확인
	@GetMapping("/idCheck/{memberId}")
	public ResponseEntity<String> idCheck(@PathVariable("memberId") String memberId) {
		
		boolean exist = memberService.exist(memberId);
		if (!exist) return ResponseEntity.ok("사용 가능한 ID 입니다.");
		return ResponseEntity.ok("이미 존재하는 ID 입니다.");
		
	}//duplicateId
	
	
	// 회원가입
	@PostMapping("/join")
	public ResponseEntity<?> join(@RequestBody MemberJoinRequestDTO dto) {
		
		return ResponseEntity.status(HttpStatus.CREATED)
							 .body(memberService.insert(dto)); //성공시 코드 201
	}// join
	
	
	// 로그인
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody MemberLoginRequestDTO requestDto) {
		
		return ResponseEntity.status(HttpStatus.OK)
							 .body(memberService.login(requestDto));
	}// login
	
	
	// 로그아웃
	@GetMapping("/logout")
	public ResponseEntity<?> logout(@RequestBody MemberLoginRequestDTO requestDto) {
		return ResponseEntity.ok("로그아웃 되었습니다.");
	}//logout

	
	
	
	
	// 더미 데이터 전체에 기본 권한 부여
	@PatchMapping
	public ResponseEntity<Integer> addDefaultRole() {
		return ResponseEntity.ok(memberService.addDefaultRole());
	}
	
	// 계정 권한 수정
	@PatchMapping("/updateRole")
	public ResponseEntity<?> updateRole(@RequestBody MemberRoleUpdateRequestDTO requestDto) {
		return ResponseEntity.status(HttpStatus.OK)
							 .body(memberService.updateRole(requestDto));
	}//updateRole
	
	
	// 기존 계정 수정
	@PatchMapping("/update/{memberId}")
	public ResponseEntity<?> update(@PathVariable String memberId, @RequestBody MemberUpdateRequestDTO requestDto) {
		
		return ResponseEntity.ok(memberService.update(memberId, requestDto));
		
	}//update
	

	// 계정 삭제
	@DeleteMapping("/delete/{memberId}")
	public void delete(@PathVariable String memberId, Member entity) {

	}// delete

}// class
