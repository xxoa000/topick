package com.lch.topick.web.client.def.domain;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientDTO {

	/* 로그인시 필요한 정보 */
	private String token;
	private String clientId;
	private String clientName;
	private String clientEmail;
	private Integer clientPoint;
	
	/* 인증인가 권한설정 */
	private List<?> roleList = new ArrayList();
	
}//class