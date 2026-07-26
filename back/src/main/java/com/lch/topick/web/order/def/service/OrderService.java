package com.lch.topick.web.order.def.service;

import java.util.List;

import com.lch.topick.web.order.def.domain.OrderCreateRequestDTO;
import com.lch.topick.web.order.def.domain.OrderListResponseDTO;
import com.lch.topick.web.order.def.entity.OrderList;

public interface OrderService {

	
	
	// C - Create
	// INSERT : 주문 리스트 > 주문 상세 생성
	public Long create(String memberId, OrderCreateRequestDTO reqDto);
	
	// R - Read
	// SELECT : 내 주문 리스트 조회
	public List<OrderList> selectList(String memberId);
	
	// SELECT : 내 주문 리스트 > 주문 상세
	public OrderListResponseDTO selectOne(Long orderListNo);
	
	// U - Update
	
	// D - Delete

	
} //interface
