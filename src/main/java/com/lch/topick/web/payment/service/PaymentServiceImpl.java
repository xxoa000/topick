package com.lch.topick.web.payment.service;

import org.springframework.stereotype.Service;

import com.lch.topick.exception.CustomException;
import com.lch.topick.exception.ErrorCode;
import com.lch.topick.web.order.def.entity.OrderList;
import com.lch.topick.web.order.def.repository.OrderListRepository;
import com.lch.topick.web.payment.domain.PaymentRequestDTO;
import com.lch.topick.web.payment.entity.Payment;
import com.lch.topick.web.payment.repository.PaymentRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

	private final PaymentRepository payRepository;
	private final OrderListRepository listRepository;
	
	// 1. 새 결제 생성 - 준비
	@Override
	public void ready(String memberId, PaymentRequestDTO reqDto) {
		Long orderListNo = reqDto.getOrderListNo();
		OrderList list =  listRepository.findByMemberIdAndOrderListNo(memberId, orderListNo);
		
		// Error : 주문이 없는 경우
		if ( list.getOrderListNo()==null ) 
			throw new CustomException(ErrorCode.ORDER_NOT_FOUND);
		
		Payment newPayment = Payment.builder()
				.orderListNo( list.getOrderListNo() )
				.paymentMethod( reqDto.getPaymentMethod() )
				.paymentStatus( "ready" )
				.paymentPrice( reqDto.getPaymentPrice() )
				.paymentTid( reqDto.getPaymentTid() )
				.build();
		payRepository.save(newPayment);
	} //ready
	
}
