package com.lch.topick.web.order.def.service;

import java.util.List;

import com.lch.topick.web.order.def.domain.OrderCreateRequestDTO;
import com.lch.topick.web.order.def.entity.OrderDetail;
import com.lch.topick.web.order.def.entity.OrderList;

public interface OrderService {

	
	
	// C - Create
	public void create(OrderCreateRequestDTO reqDto);
	
	// R - Read
	public List<OrderList> selectList(String memberId);
	
	public List<OrderDetail> selectOne(Long orderListNo);
	
	// U - Update
	
	// D - Delete

	
} //interface
