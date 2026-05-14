package com.lch.topick.web.client.def.domain;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientResponseDTO {

	/* 로그인시 필요한 정보 */
	private String token;
	private String clientId;
	private String clientName;
	private String clientEmail;
	private String clientphone;
	private Integer clientPoint;
	
	/* 인증인가 권한설정 */
	//private List<?> roleList = new ArrayList();
	
}//class