package com.lch.topick.web.order.def.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lch.topick.web.order.def.entity.OrderList;

public interface OrderListRepository extends JpaRepository<OrderList,Long> {
	
	public List<OrderList> findByMemberId( String memberId );
	
	// 결제에서 사용
	public OrderList findByMemberIdAndOrderListNo(String memberId, Long orderListNo);
	
	

} //interface
