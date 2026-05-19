package com.lch.topick.web.filter.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "store")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Store {
	
	@Id
	@Column(name = "store_no")
	private long storeNo;
	
	@Column(name = "kakao_id")
	private String kakaoId;
	
	@Column(name = "store_name")
	private String storeName;
	
}
