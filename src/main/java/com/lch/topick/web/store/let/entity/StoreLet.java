package com.lch.topick.web.store.let.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name="store")

@Getter
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class StoreLet {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "store_no", nullable = false)
	private Long storeNo;
	
	@Column(name = "kakao_id", nullable = false)
	private String kakaoId;
	
	@Column(name = "store_name", nullable = false)
	private String storeName;
	
	@CreatedDate
	@Column(name = "store_create_at", nullable = false, updatable = false)
	private LocalDateTime storeCreateAt;

} //class
