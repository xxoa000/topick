package com.lch.topick.web.client.def.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "client")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Client {

	@Id
	@Column(name = "client_id", nullable = false, length = 30)
	private String clientId;

	@Column(name = "client_pw", nullable = false)
	private String clientPw;

	@Column(name = "client_name", nullable = false, length = 50)
	private String clientName;

	@Column(name = "client_email", nullable = false, length = 100)
	private String clientEmail;

	@Builder.Default
	@Column(name = "client_gender", nullable = false, length = 10)
	private String clientGender = "none";

	@Column(name = "client_birthday")
	private LocalDate clientBirthday;

	@Column(name = "client_phone", length = 20)
	private String clientPhone;

	@CreatedDate
	@Column(name = "client_create_at", nullable = false, updatable = false)
	private LocalDateTime clientCreateAt;

	@LastModifiedDate
	@Column(name = "client_update_at")
	private LocalDateTime clientUpdateAt;

	@Column(name = "client_last_login_at")
	private LocalDateTime clientLastLoginAt;

	@Builder.Default
	@Column(name = "client_status", nullable = false)
	private String clientStatus = "active";

	@Builder.Default /* Default 값 지정, create()시 생략 가능 */
	@Column(name = "client_point", nullable = false)
	private Integer clientPoint = 0;

	/* 전체 수정 */
	public void putInfo(String name, String email, String phone, String gender, LocalDate birthday) {
		this.clientName = name;
		this.clientEmail = email;
		this.clientPhone = phone;
		this.clientGender = gender;
		this.clientBirthday = birthday;
	}

	/* 일부만 수정. 수정값이 있는 경우에만 수정되고, 그외 컬럼은 기존 값 동일 */
	public void patchInfo(String name, String email, String phone, String gender, LocalDate birthday) {
		if (name != null)
			this.clientName = name;
		if (email != null)
			this.clientEmail = email;
		if (phone != null)
			this.clientPhone = phone;
		if (gender != null)
			this.clientGender = gender;
		if (birthday != null)
			this.clientBirthday = birthday;
	}

	/* 비밀번호 수정 */
	public void changePw(String pw) {
		this.clientPw = pw;
	}

}// class
