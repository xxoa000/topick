package com.lch.topick.web.order.def.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.lch.topick.exception.CustomException;
import com.lch.topick.exception.ErrorCode;
import com.lch.topick.web.menu.def.entity.Menu;
import com.lch.topick.web.menu.def.repository.MenuRepository;
import com.lch.topick.web.order.def.domain.OrderCreateRequestDTO;
import com.lch.topick.web.order.def.domain.OrderDetailRequestDTO;
import com.lch.topick.web.order.def.entity.OrderDetail;
import com.lch.topick.web.order.def.entity.OrderList;
import com.lch.topick.web.order.def.repository.OrderDetailRepository;
import com.lch.topick.web.order.def.repository.OrderListRepository;
import com.lch.topick.web.store.let.entity.FilterStore;
import com.lch.topick.web.store.let.repository.FilterStoreRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
	
	private final OrderListRepository listRepository;
	private final OrderDetailRepository detRepository;
	private final FilterStoreRepository storeRepository;
	private final MenuRepository menuRepository;
	
	// C - Create
	
	// INSERT : 주문하기
	
	// 1.1 새 주문 생성
	private OrderList insert(OrderCreateRequestDTO dto) {
		
		FilterStore store = storeRepository.findById(dto.getStoreNo())
							.orElseThrow(() -> new CustomException(ErrorCode.STORE_NOT_FOUND));
		
		// 주문 빌드
		OrderList list = OrderList.builder()
				.memberId( dto.getMemberId() )
				.storeNo( dto.getStoreNo() )
				.orderStoreName( store.getStoreName() )
				.orderListVisitTime( dto.getOrderListVisitTime() )
				.orderListVisitType( dto.getOrderListVisitType() )
				.orderListRequest( dto.getOrderListRequest() )
				.build();
		// DB 에 저장
		return listRepository.save(list);
	} //insert
	
	
	// 1.2 주문 리스트 > 주문 상세 생성
	@Override
	public void create(OrderCreateRequestDTO creReqDto) {
		// 생성된 주문의 식별자 불러오기
		OrderList newList = insert(creReqDto);
		
		int totalPrice = 0;
		
		// 주문 상세 빌드
		for ( OrderDetailRequestDTO detReqDto : creReqDto.getDetailList() ) {

			Menu menu = menuRepository.findById(detReqDto.getMenuNo())
							.orElseThrow(() -> new CustomException(ErrorCode.MENU_NOT_FOUND));
		
			OrderDetail detail = OrderDetail.builder()
					.orderListNo( newList.getOrderListNo() )
					.menuNo( detReqDto.getMenuNo() )
					.orderDetailMenuName( menu.getMenuName() )
					.orderDetailAmount( detReqDto.getOrderDetailAmount() )
					.orderDetailTodayPrice( menu.getMenuPrice() )
					.build();
			totalPrice += menu.getMenuPrice() * detReqDto.getOrderDetailAmount();
			// DB 에 저장
			detRepository.save(detail);
		} //for
		
		// 총 주문 가격, 최종 주문 가격 계산
		newList.changePrice(totalPrice);
		
	} //create
	
	
	
	
	
	

	// R - Read
	
	// SELECT : 내 주문 내역 보기
	@Override
	public List<OrderList> selectList(String memberId) {
		List<OrderList> listEntity = listRepository.findByMemberId(memberId);
		return listEntity;
	} //selectList

	
	// SELECT : 내 주문 내역 > 주문 상세
	@Override
	public List<OrderDetail> selectOne(Long orderListNo) {
		List<OrderDetail> detEntity = detRepository.findByOrderListNo(orderListNo);
		return detEntity;
	} //selectOne

	
	
	// U - Update

	// D - Delete

} // class
