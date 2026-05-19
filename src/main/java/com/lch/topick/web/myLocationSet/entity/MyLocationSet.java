package com.lch.topick.web.myLocationSet.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="address")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class MyLocationSet {
	
	@Id	//주식별자	
	@GeneratedValue(strategy=GenerationType.IDENTITY )	//Auto_Increment
	private int addressNo;			
	
	private String memberId;		//사용자 고유ID (member table 참조)
	private String addressPostcode;	//우편번호, API: zonecode
	private String addressRoad;		//도로명, API: roadAddress
	
	@Column(length=255, nullable=false)
	private String addressLot;		//지번, API: jibunAddress
	
	@Column(length=255, nullable=false)
	private String addressDetail;	//상세, API: x
	
	@Column(length=50, nullable=false)
	private String addressName;		//별칭, API: buildingName
	
	@Column(length=30, nullable=true)
	private String addressX; //경도, API: longitude,

	@Column(length=30, nullable=true)
	private String addressY; //위도, API: latitude, 
	
	
}
