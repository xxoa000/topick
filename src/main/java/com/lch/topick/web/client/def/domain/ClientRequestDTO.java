package com.lch.topick.web.client.def.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientRequestDTO {
	
	/* 클라이언트 -> 서버로 요청할때 전송하는 데이터 */
	private String clientId;
	//private String clientPw;
	private String clientName;
	//private String clientEmail;
	private String clientPhone;

}//class
