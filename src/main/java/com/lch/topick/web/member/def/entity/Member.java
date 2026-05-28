package com.lch.topick.web.member.def.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.lch.topick.web.member.def.domain.MemberRole;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "member")

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class) //생성,수정시간 자동감지 리스너
public class Member {

	@Id
	@Column(name = "member_id", nullable = false, length = 30)
	private String memberId;

	@Column(name = "member_pw", nullable = false)
	private String memberPw;

	@Column(name = "member_name", nullable = false, length = 50)
	private String memberName;

	@Column(name = "member_email", nullable = false, length = 100)
	private String memberEmail;

	@Builder.Default
	@Column(name = "member_gender", nullable = false, length = 10)
	private String memberGender = "none";

	@Column(name = "member_birthday")
	private LocalDate memberBirthday;

	@Column(name = "member_phone", length = 20)
	private String memberPhone;

	@CreatedDate
	@Column(name = "member_create_at", nullable = false, updatable = false)
	private LocalDateTime memberCreateAt;

	@LastModifiedDate
	@Column(name = "member_update_at")
	private LocalDateTime memberUpdateAt;

	@Column(name = "member_last_login_at")
	private LocalDateTime memberLastLoginAt;

	@Builder.Default
	@Column(name = "member_status", nullable = false)
	private String memberStatus = "active";

	@Builder.Default //Default 값 지정했을 경우, .builder() 시 해당 칼럼은 생략 가능
	@Column(name = "member_point", nullable = false)
	private Integer memberPoint = 0;
	
	@Column(name = "member_refresh_token", length=1000)
	private String memberRefreshToken;
	
	@Column(name = "member_refresh_token_exp")
	private LocalDateTime memberRefreshTokenExp;
	
	
	
	
	
	// 1. Role(member,owner,admin) 권한 부여 관련
	@ElementCollection(fetch=FetchType.LAZY)
	@CollectionTable(
			name="member_role_list",
		    joinColumns = @JoinColumn(name = "member_id")
			)
    // JPA에게 컬렉션 객체임을 알려줌 -> RDB 에서는 별도 테이블을 생성하여 컬렉션을 관리함.
	@Enumerated(EnumType.STRING)
	@Builder.Default
	@Column(name = "member_role")
	private List<MemberRole> roleList = new ArrayList<>();

	
	// 1.1 더미 데이터에 기본 권한(MEMBER) 부여
	public void addDefaultRole() { addRole(MemberRole.MEMBER); }

	
	// 1.2 권한 추가
	public void addRole(MemberRole memberRole) {
		if (!roleList.contains(memberRole)) roleList.add(memberRole);
	} //addRole
	
	
	// 1.3 권한 수정
	public void updateRole(List<MemberRole> memberRoleList) {
		roleList.clear(); 									// 기존 권한 초기화
		
		for (MemberRole memberRole : memberRoleList) {
			if (!roleList.contains(memberRole)) 					// 중복 권한 방지
				roleList.add(memberRole);							// 중복 없으면 권한 추가
		}		
	} //updateRole
	
	

	// 2. JWT token 발행용, 로그인 성공 후 createToken() 의 인자로 사용
	public Map<String, Object> claimList() {
		Map<String, Object> dataMap = new HashMap<>();
		dataMap.put("memberId", this.memberId);
		dataMap.put("roleList", this.roleList);
		dataMap.put("tokenType", "access");
		return dataMap;
	} //claimList
	
	// 2.1 로그인 성공 후 last_login_at 기록
	public void updateLastLoginAt() {
	    this.memberLastLoginAt = LocalDateTime.now();
	}
	
	
	

	// 3.1 내 정보 - 전체 수정
	public void putInfo(String name, String email, String phone, String gender, LocalDate birthday) {
		this.memberName = name;
		this.memberEmail = email;
		this.memberPhone = phone;
		this.memberGender = gender;
		this.memberBirthday = birthday;
	} //putInfo

	// 3.2 내 정보 - 일부만 수정. 수정된 값이 있는 경우만 수정되고, 그외 컬럼은 기존 값 동일
	public void patchInfo(String name, String email, String phone, String gender, LocalDate birthday) {
		if (name != null)
			this.memberName = name;
		if (email != null)
			this.memberEmail = email;
		if (phone != null)
			this.memberPhone = phone;
		if (gender != null)
			this.memberGender = gender;
		if (birthday != null)
			this.memberBirthday = birthday;
	}

	// 3.3 내 정보 - 비밀번호 수정
	public void changePw(String pw) {
		this.memberPw = pw;
	}
	
	
	// 4. 계정 삭제 (실제 데이터는 남기고 Status 값만 변경 : delete)
	public void resign() {
		this.memberStatus = "delete";
	}
	
	// 5. 토큰 데이터 저장
	public void updateToken(String refreshToken, LocalDateTime exp) {
		this.memberRefreshToken = refreshToken;
		this.memberRefreshTokenExp = exp;
	}
	
	// 6. 토큰 데이터 삭제
	public void clearToken() {
		this.memberRefreshToken = null;
		this.memberRefreshTokenExp = null;
	}
	
}// class
