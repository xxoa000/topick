package com.lch.topick.web.order.def.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lch.topick.web.order.def.domain.OrderCreateRequestDTO;
import com.lch.topick.web.order.def.service.OrderService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/order")
public class OrderController {
	
	private final OrderService orderService;
	
	// C - Create
	// 새 주문하기 -> OrderList insert -> OrderDetail insert -> OrderOption insert 
	@PostMapping("/create")
	public ResponseEntity<?> create(@AuthenticationPrincipal String memberId, 
									@RequestBody OrderCreateRequestDTO creReqDto) {
		log.info("memberId: {}", memberId);
		log.info("creReqDto: {}", creReqDto);
		orderService.create(memberId, creReqDto);
		return ResponseEntity.status(HttpStatus.CREATED)
							.body("메뉴 선택 완료, 결제 창으로 이동합니다.");
	}
	
	
	// R - Read
	
	// 내 주문 리스트 조회
	@GetMapping("/list")
	public ResponseEntity<?> selectList(@AuthenticationPrincipal String memberId) {
		return ResponseEntity.ok(orderService.selectList(memberId));
	}
	
	// 내 주문 상세 조회
	@GetMapping("/detail/{orderListNo}")
	public ResponseEntity<?> selectOne(@PathVariable("orderListNo") Long orderListNo) {
		return ResponseEntity.ok( orderService.selectOne(orderListNo) );
	}
	
	
	
	// U - Update
	// 내 주문 내역 수정
	
	// D - Delete
	// 내 주문 삭제
	
	
	
	

} //class
