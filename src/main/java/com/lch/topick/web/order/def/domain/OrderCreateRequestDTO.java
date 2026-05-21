package com.lch.topick.web.order.def.domain;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class OrderCreateRequestDTO {

	// 주문 1건
	private String memberId;
	private Long storeNo;
	private LocalDateTime orderListVisitTime;
	private String orderListVisitType;
	private String orderListRequest;
	
	// 주문 1건의 상세
	private List<OrderDetailRequestDTO> detailList;
	
} //class
