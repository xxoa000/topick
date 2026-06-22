package com.lch.topick.web.payment.service;

import com.lch.topick.web.payment.domain.PaymentRequestDTO;

public interface PaymentService {
	
	public void ready(String memberId, PaymentRequestDTO reqDto);

}
