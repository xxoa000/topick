package com.lch.topick.web.member.def.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lch.topick.exception.CustomException;
import com.lch.topick.exception.ErrorCode;
import com.lch.topick.jwtToken.TokenProvider;
import com.lch.topick.web.member.def.domain.MemberJoinRequestDTO;
import com.lch.topick.web.member.def.domain.MemberLoginRequestDTO;
import com.lch.topick.web.member.def.domain.MemberLoginResponseDTO;
import com.lch.topick.web.member.def.domain.MemberRoleUpdateRequestDTO;
import com.lch.topick.web.member.def.domain.MemberRoleUpdateResponseDTO;
import com.lch.topick.web.member.def.domain.MemberUpdateRequestDTO;
import com.lch.topick.web.member.def.entity.Member;
import com.lch.topick.web.member.def.repository.MemberRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional //데이터 변화를 자동감지 -> findById() 썼을 경우 save() 안해도 자동 수정 됨
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {
	
	private final MemberRepository repository;
	private final PasswordEncoder pwEncoder;
	private final TokenProvider tokenProvider;

	
	
	
	// SELECT 전체 고객 리스트
	@Override
	public List<Member> selectList() {
		return repository.findAll();
	}//selectList

	// SELECT 고객 상세
	@Override
	public Member selectOne(String memberId) {
		return repository.findById(memberId).orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));
	}//selectOne
	
	
	// 회원가입 - ID 중복 확인
	@Override
	public Boolean exist(String memberId) {
		if ( repository.existsById(memberId)) throw new CustomException(ErrorCode.MEMBER_ID_EXIST);
		
		return false; // 사용가능 아이디
	}//exist
	

	// INSERT 새 계정 생성
	@Override
	public Member insert(MemberJoinRequestDTO requestDto) {
		if (repository.existsById(requestDto.getMemberId())) throw new CustomException(ErrorCode.MEMBER_ID_EXIST);
		
		Member entity = Member.builder()
							.memberId(requestDto.getMemberId())
							.memberPw(pwEncoder.encode(requestDto.getMemberPw()))
							.memberName(requestDto.getMemberName())
							.memberEmail(requestDto.getMemberEmail())
							.memberPhone(requestDto.getMemberPhone())
							.memberGender(requestDto.getMemberGender())
							.memberBirthday(requestDto.getMemberBirthday())
							.build();
		entity.addDefaultRole();
		return repository.save(entity);
	}//insert
	
	
	
	
	
	
	// SELECT 로그인
	@Override
	public MemberLoginResponseDTO login(MemberLoginRequestDTO requestDto) {
		
		// 1.1 아이디 존재여부 체크
		Member entity = repository.findById(requestDto.getMemberId())
						 		  .orElseThrow(() -> new CustomException(ErrorCode.LOGIN_FAILED));
		// 1.2 탈퇴 계정 여부 체크
		if ( "delete".equals(entity.getMemberStatus()) ) {
			throw new CustomException(ErrorCode.MEMBER_NOT_FOUND);	
		}
		// 1.3 비밀번호 동일 체크
		if ( !pwEncoder.matches(requestDto.getMemberPw(),entity.getMemberPw()) ) {
			throw new CustomException(ErrorCode.LOGIN_FAILED);	
		} 
		
		// 2. 로그인 성공
		// token 생성, 유효시간은 application.properties의 jwt.access-token-expiration 사용
		final String token = tokenProvider.createToken(entity.claimList());
		entity.updateLastLoginAt();
		
		// 3. 클라이언트로 필요한 데이터만 보내기 위해 응답용 DTO return
		return new MemberLoginResponseDTO(
				token,
				entity.getMemberId(),
				entity.getRoleList()
		);
	}//login
	
	
	
	// Update 더미 데이터 계정에 전체 권한 부여
	@Override
	public int addDefaultRole() {
		List<Member> entityList = repository.findAll();
		int count = 0 ;
		
		for ( Member entity : entityList ) {
			entity.addDefaultRole();
			count++;
		}
		return count;
	}
	
	
	// UPDATE 기존 계정 권한 수정
	@Override
	public MemberRoleUpdateResponseDTO updateRole(MemberRoleUpdateRequestDTO requestDto) {
		
		Member entity = repository.findById(requestDto.getMemberId())
				  .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));
		
		entity.updateRole(requestDto.getRoleList());
		
		return new MemberRoleUpdateResponseDTO(
				entity.getMemberId(),
				entity.getRoleList()
		);	
	}
	
	
	


	// UPDATE 기존 계정 부분(patch) 수정
	@Override
	public Member update(String memberId, MemberUpdateRequestDTO requestDto) {
		Member entity = repository.findById(memberId)
								  .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));

		entity.patchInfo(requestDto.getMemberName(), 
						 requestDto.getMemberEmail(), 
						 requestDto.getMemberPhone(), 
						 requestDto.getMemberGender(),
						 requestDto.getMemberBirthday());
		return entity;
	}//update

	
	
	
	
	
	// DELETE 계정 삭제
	@Override
	public void delete(String memberId) {
		Member entity = repository.findById(memberId)
				  		.orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));
		entity.delete();
	}//delete

}// class
