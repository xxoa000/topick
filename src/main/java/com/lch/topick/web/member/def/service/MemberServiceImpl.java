package com.lch.topick.web.member.def.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lch.topick.exception.CustomException;
import com.lch.topick.exception.ErrorCode;
import com.lch.topick.jwtToken.TokenProvider;
import com.lch.topick.web.member.def.domain.MemberJoinRequestDTO;
import com.lch.topick.web.member.def.domain.MemberLoginRequestDTO;
import com.lch.topick.web.member.def.domain.MemberLoginResponseDTO;
import com.lch.topick.web.member.def.domain.MemberLoginResultDTO;
import com.lch.topick.web.member.def.domain.MemberRoleUpdateRequestDTO;
import com.lch.topick.web.member.def.domain.MemberRoleUpdateResponseDTO;
import com.lch.topick.web.member.def.domain.MemberUpdateRequestDTO;
import com.lch.topick.web.member.def.entity.Member;
import com.lch.topick.web.member.def.repository.MemberRepository;
import com.lch.topick.web.myLocationSet.entity.MyLocationSet;
import com.lch.topick.web.myLocationSet.service.MyLocationSetService;

import lombok.RequiredArgsConstructor;

@Service
@Transactional //데이터 변화를 자동감지 -> findById() 썼을 경우 save() 안해도 자동 수정 됨
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {
	
	private final MemberRepository repository;
	private final PasswordEncoder pwEncoder;
	private final TokenProvider tokenProvider;
	// 주소 추가용
	private final MyLocationSetService addrService;
	
	
	
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
		// id 가 제대로 들어오지 않은 경우 오류 출력
		if (memberId == null) throw new CustomException(ErrorCode.MEMBER_ID_EXIST);
		if ( repository.existsById(memberId)) return false; // 이미 존재하는 아이디
		
		return true; // 사용가능 아이디
	}//exist
	

	// INSERT 새 계정 생성
	@Override
	public Member insert(MemberJoinRequestDTO requestDto) {
		if ( repository.existsById(requestDto.getMemberId()) ) throw new CustomException(ErrorCode.MEMBER_ID_EXIST);
		if ( repository.existsByMemberEmail(requestDto.getMemberEmail()) ) throw new CustomException(ErrorCode.MEMBER_EMAIL_EXIST);
		if ( requestDto.getMemberPhone()!=null ) {			
			if (repository.existsByMemberPhone(requestDto.getMemberPhone()) ) throw new CustomException(ErrorCode.MEMBER_PHONE_EXIST);
		}
		
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
	public MemberLoginResultDTO login(MemberLoginRequestDTO requestDto) {
		
		// 1.1 아이디 존재여부 체크
		Member entity = repository.findById(requestDto.getMemberId())
						 		  .orElseThrow(() -> new CustomException(ErrorCode.LOGIN_FAILED));
		// 1.2 탈퇴 계정 여부 체크
		if ( "delete".equals(entity.getMemberStatus()) ) {
			throw new CustomException(ErrorCode.MEMBER_NOT_FOUND);	
		}
		// 1.3 비밀번호 동일 체크
		if ( !pwEncoder.matches(requestDto.getMemberPw(), entity.getMemberPw()) ) {
			throw new CustomException(ErrorCode.LOGIN_FAILED);	
		} 
		
		// 2. 로그인 성공
		/* accessToken, refreshToken 생성
		 * 유효시간은 application.properties의 jwt 설정값 사용 */
		final String accessToken = tokenProvider.createAccessToken(entity.claimList());
		Map<String, Object> refreshClaimList = 
			Map.of(
				"memberId", entity.getMemberId(),
				"tokenType", "refresh"
			     );
		final String refreshToken = tokenProvider.createRefreshToken(refreshClaimList);
		
		// 2.1 DB 에 로그인 시각, refreshToken, refreshTokenExp update
		entity.updateLastLoginAt();
		updateToken(entity, refreshToken);
		
		// 2.2 클라이언트로 주소 추가 하여 전송
		MyLocationSet addr = addrService
							.findByMemberIdAndAddressDefault(entity.getMemberId(), 'Y');
		
		// 2.3 클라이언트로 필요한 데이터만 보내기 위한 응답DTO
		MemberLoginResponseDTO responseDto = new MemberLoginResponseDTO(
															entity.getMemberId(),
															entity.getMemberName(),
															accessToken,
															addr.getAddressX(),
															addr.getAddressY(),
															entity.getRoleList()
															);
		
		// 3. 응답DTO 와 refreshToken 반환 -> 컨트롤러에서 분리 처리하기 위함
		return new MemberLoginResultDTO(responseDto, refreshToken);
	} //login
	
	
	
	// Read) SELECT 로그아웃
	@Override
	public void logout(String memberId) {
	
		Member entity = repository.findById(memberId)
		  		.orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));
		
		entity.clearToken();
	} //logout
	
	
	
	
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
	} //updateRole
	
	
	


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
	} //update

	
	
	
	
	
	// UPDATE 계정 탈퇴
	@Override
	public void resign(String memberId) {
		Member entity = repository.findById(memberId)
				  		.orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));
		entity.resign();
	} //resign
	
	
	
	// 개발용
	// Update 더미 데이터 계정에 전체 권한 부여 & 비밀번호 암호화 
	@Override
	public int addDefaultRole() {
		List<Member> entityList = repository.findAll();
		int count = 0 ;
		
		for ( Member entity : entityList ) {
			entity.addDefaultRole();										 	 // 기본 권한 부여
			String pw = entity.getMemberPw();
			if (!isEncode(pw)) { entity.changePw(pwEncoder.encode(pw)); }  		 // 비밀번호 인코딩
			count++; 
		}		
		return count;
	}
	// 이미 암호화 된 password 는 건너뜀
	private boolean isEncode(String pw) { return pw != null && pw.matches("^\\$2[aby]\\$\\d{2}\\$.{53}$"); }
	
	
	
	
	// UPDATE 토큰 데이터 저장
	private void updateToken(Member entity, String refreshToken) {
		// refreshToken 암호화, 만료시간 계산
		LocalDateTime exp = LocalDateTime.now().plusSeconds(tokenProvider.getRefreshTokenExp()/1000);		
		// DB 에 저장
		entity.updateToken(refreshToken, exp);
	}
		
	
	
}// class
