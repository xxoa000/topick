package com.lch.topick.web.order.def.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.lch.topick.web.order.def.entity.OrderList;

public interface OrderListRepository extends JpaRepository<OrderList,Integer> {
	
	public List<OrderList> findByMemberId(String memberId);

} //interface
