package com.lch.topick.web.order.def.domain;

import lombok.Data;
import lombok.NoArgsConstructor;

// 주문하기 클릭 시, 클라이언트 -> 서버
@Data
@NoArgsConstructor
public class OrderDetailRequestDTO {

	private Long menuNo;
	private Integer orderDetailAmount;
	//private String orderDetailMenuName;
	//private Integer orderDetailTodayPrice;
	
} //class
