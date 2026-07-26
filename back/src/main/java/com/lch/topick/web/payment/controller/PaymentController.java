package com.lch.topick.web.payment.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lch.topick.web.payment.domain.PaymentRequestDTO;
import com.lch.topick.web.payment.service.PaymentService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payment")
public class PaymentController {
	
	private final PaymentService payService;
	
	// 결제 준비
	@PostMapping("/ready")
	public ResponseEntity<?> ready(@AuthenticationPrincipal String memberId, @RequestBody PaymentRequestDTO reqDto) {
		payService.ready(memberId, reqDto);
		return null;
	}
	

}
