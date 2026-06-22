package com.lch.topick.web.payment.domain;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PaymentRequestDTO {
	
	private Long orderListNo;
	private Integer paymentPrice;
	private String paymentMethod;
	private String paymentTid;

}
