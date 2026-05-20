package com.lch.topick.web.order.def.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.lch.topick.web.order.def.entity.OrderDetail;
import com.lch.topick.web.order.def.entity.OrderList;
import com.lch.topick.web.order.def.repository.OrderDetailRepository;
import com.lch.topick.web.order.def.repository.OrderListRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
	
	private final OrderListRepository orderListRepository;
	private final OrderDetailRepository orderDetailRepository;
	
	// C - Create
	
	// R - Read
	@Override
	public List<OrderList> selectList(String memberId) {
		List<OrderList> listEntity = orderListRepository.findByMemberId(memberId);
		return listEntity;
	}
	
	@Override
	public List<OrderDetail> selectOne(Integer orderListNo) {
		List<OrderDetail> detailEntity = orderDetailRepository.findByOrderListNo(orderListNo);
		return detailEntity;
	}
	
	// U - Update
	
	// D - Delete
	

} //class
