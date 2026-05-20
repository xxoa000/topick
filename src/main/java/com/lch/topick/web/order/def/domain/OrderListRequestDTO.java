package com.lch.topick.web.order.def.domain;

import java.time.LocalDateTime;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class OrderListRequestDTO {
	
	private String memberId;
	private Long storeNo;
	private String orderStoreName;
	private Long MenuNo;
	private Integer orderListTotalPrice;
	private LocalDateTime orderListVisitTime;
	private String orderListVisitType;
	private String orderListRequest;

} //class
