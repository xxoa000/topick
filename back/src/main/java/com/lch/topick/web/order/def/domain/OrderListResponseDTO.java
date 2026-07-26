package com.lch.topick.web.order.def.domain;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderListResponseDTO {

	private LocalDateTime orderListCreateAt;
	private Long orderListNo;
	private Long storeNo;
	private String orderStoreName;
	private LocalDateTime orderListVisitTime;
	private String orderListVisitType;
	private String orderListRequest;
	private Integer orderListTotalPrice;
	private Integer orderListFinalPrice;
	
	// 주문 1건의 상세
	private List<OrderDetailResponseDTO> detailList;
	
} //class
