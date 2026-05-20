package com.lch.topick.web.order.def.service;

import java.util.List;

import com.lch.topick.web.order.def.entity.OrderDetail;
import com.lch.topick.web.order.def.entity.OrderList;

public interface OrderService {

	
	
	// C - Create
	
	// R - Read
	public List<OrderList> selectList(String memberId);
	
	public List<OrderDetail> selectOne(Integer orderListNo);
	
	// U - Update
	
	// D - Delete

	
} //interface
