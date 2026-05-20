package com.lch.topick.web.order.def.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lch.topick.web.order.def.entity.OrderList;
import com.lch.topick.web.order.def.service.OrderService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/order")
public class OrderController {
	
	private final OrderService orderListService;
	
	// C - Create
	@PostMapping
	public ResponseEntity<?> createOne(@RequestBody OrderList entity) {
		return null;
	}
	
	
	// R - Read
	@GetMapping("/list/{memberId}")
	public ResponseEntity<?> selectList(@PathVariable("memberId") String memberId) {
		return ResponseEntity.ok(orderListService.selectList(memberId));
	}
	
	@GetMapping("/detail/{orderListNo}")
	public ResponseEntity<?> selectOne(@PathVariable("orderListNo") Integer orderListNo) {
		return ResponseEntity.ok(orderListService.selectOne(orderListNo));
	}
	
	
	
	// U - Update
	
	// D - Delete
	
	
	
	

} //class
