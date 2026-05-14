package com.lch.topick.web.client.def.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="client")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Client {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="client_id", nullable=false, length=30)
	private String clientId;
	
	@Column(name="client_pw", nullable=false)
	private String clientPw;
	
	@Column(name="client_name", nullable=false, length=50)
	private String clientName;
	
	@Column(name="client_email", nullable=false, length=100)
	private String clientEmail;
	
	@Column(name="client_gender", nullable=false, length=10)
	private String clientGender;
	
	@Column(name="client_birthday")
	private LocalDate clientBirthday;
	
	@Column(name="client_phone", length=20)
	private String clientPhone;
	
	@Column(name="client_create_at", nullable=false)
	private LocalDateTime clientCreateAt;
	
	@Column(name="client_update_at")
	private LocalDateTime clientUpdateAt;
	
	@Column(name="client_last_login_at")
	private LocalDateTime clientLastLoginAt;
	
	@Column(name="client_status", nullable=false)
	private String clientStatus;
	
	@Column(name="client_point", nullable=false)
	private Integer clientPoint;
	
}//class
