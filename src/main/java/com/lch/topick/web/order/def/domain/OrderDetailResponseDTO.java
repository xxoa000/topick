package com.lch.topick.web.order.def.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

// 클라이언트 <- 서버
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderDetailResponseDTO {

	//private Long orderListNo;
	//private Long menuNo;
	private Long orderDetailNo;
	private String orderDetailMenuName;
	private Integer orderDetailAmount;
	private Integer orderDetailTodayPrice;
	
} //class
