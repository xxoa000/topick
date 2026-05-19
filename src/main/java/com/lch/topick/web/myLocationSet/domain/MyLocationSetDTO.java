package com.lch.topick.web.myLocationSet.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class MyLocationSetDTO {
	
	private int addressNo;			
	private String memberId;		//사용자 고유ID (member table 참조)
	private String addressPostcode;	//우편번호, API: zonecode
	private String addressRoad;		//도로명, API: roadAddress
	private String addressLot;		//지번, API: jibunAddress
	private String addressDetail;	//상세, API: x
	private String addressName;		//별칭, API: buildingName
	private String addressX; 		//경도, API: longitude, 	
	private String addressY; 		//위도, API: latitude, 
}
