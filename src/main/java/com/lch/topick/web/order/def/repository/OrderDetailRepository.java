package com.lch.topick.web.order.def.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lch.topick.web.order.def.entity.OrderDetail;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer>{

	public List<OrderDetail> findByOrderListNo(Integer orderListNo);
	
} //interface
