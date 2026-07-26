package com.lch.topick.web.order.def.service;


import java.util.List;

import org.springframework.stereotype.Service;

import com.lch.topick.exception.CustomException;
import com.lch.topick.exception.ErrorCode;
import com.lch.topick.web.member.def.entity.Member;
import com.lch.topick.web.member.def.repository.MemberRepository;
import com.lch.topick.web.menu.def.entity.Menu;
import com.lch.topick.web.menu.def.repository.MenuRepository;
import com.lch.topick.web.order.def.domain.OrderCreateRequestDTO;
import com.lch.topick.web.order.def.domain.OrderDetailRequestDTO;
import com.lch.topick.web.order.def.domain.OrderDetailResponseDTO;
import com.lch.topick.web.order.def.domain.OrderListResponseDTO;
import com.lch.topick.web.order.def.entity.OrderDetail;
import com.lch.topick.web.order.def.entity.OrderList;
import com.lch.topick.web.order.def.repository.OrderDetailRepository;
import com.lch.topick.web.order.def.repository.OrderListRepository;
import com.lch.topick.web.store.let.entity.FilterStore;
import com.lch.topick.web.store.let.repository.OrderStoreRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
	
	private final OrderListRepository listRepository;
	private final OrderDetailRepository detRepository;
	private final OrderStoreRepository storeRepository;
	private final MenuRepository menuRepository;
	private final MemberRepository memberRepository;
	
	// C - Create
	// INSERT : 주문하기
	
	// 1.1 새 주문 생성
	private OrderList insert(String memberId, OrderCreateRequestDTO creReqDto) {
		
		Member member = memberRepository.findById(memberId)
				.orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));
		
		FilterStore store = storeRepository.findByStoreNo(creReqDto.getStoreNo())
				.orElseThrow(() -> new CustomException(ErrorCode.STORE_NOT_FOUND));
		
		// 주문 빌드
		OrderList list = OrderList.builder()
				.memberId( member.getMemberId() )
				.storeNo( store.getStoreNo() )
				.orderStoreName( store.getStoreName() )
				.orderListVisitTime( creReqDto.getOrderListVisitTime() )
				.orderListVisitType( creReqDto.getOrderListVisitType().toLowerCase() )
				.orderListRequest( creReqDto.getOrderListRequest() )
				.build();
		// DB 에 저장
		return listRepository.save(list);
	} //insert
	
	
	// 1.2 주문 리스트 > 주문 상세 생성
	@Override
	public Long create(String memberId, OrderCreateRequestDTO creReqDto) {
		
		// Error : 주문한 게 아무것도 없는 경우
		if ( creReqDto.getDetailList()==null || creReqDto.getDetailList().isEmpty() )
			throw new CustomException(ErrorCode.ORDER_NOT_FOUND);
		
		// 생성된 주문의 식별자 불러오기
		OrderList newList = insert(memberId, creReqDto);
		
		int totalPrice = 0;
		
		// 주문 상세 빌드
		for ( OrderDetailRequestDTO detReqDto : creReqDto.getDetailList() ) {

			Menu menu = menuRepository.findById(detReqDto.getMenuNo())
							.orElseThrow(() -> new CustomException(ErrorCode.MENU_NOT_FOUND));
			
			// Error : 메뉴의 가게no와 주문리스트의 가게no가 불일치하는 경우
			if ( !menu.getStoreNo().equals(newList.getStoreNo()) )
				throw new CustomException(ErrorCode.MENU_STORE_NOT_MATCH);
			
			OrderDetail detail = OrderDetail.builder()
					.orderListNo( newList.getOrderListNo() )
					.menuNo( menu.getMenuNo() )
					.orderDetailMenuName( menu.getMenuName() )
					.orderDetailAmount( detReqDto.getOrderDetailAmount() )
					.orderDetailTodayPrice( menu.getMenuPrice() )
					.build();
			// 총 주문 가격 계산
			totalPrice += menu.getMenuPrice() * detReqDto.getOrderDetailAmount();
			// DB 에 저장
			detRepository.save(detail);
		} //for
		
		// 총 주문 가격, 최종 주문 가격 계산
		newList.changePrice(totalPrice);
		
		// orderListNo 리턴 -> 결제 페이지에서 사용
		log.info("orderListNo: {}", newList.getOrderListNo());
		return newList.getOrderListNo();
		
		
	} //create
	
	
	
	
	
	

	// R - Read
	
	// SELECT : 내 주문 리스트 조회
	@Override
	public List<OrderList> selectList(String memberId) {
		List<OrderList> listEntity = listRepository.findByMemberId(memberId);
		return listEntity;
	} //selectList

	
	// SELECT : 내 주문 리스트 > 주문 상세
	@Override
	public OrderListResponseDTO selectOne(Long orderListNo) {
		OrderList listEntity = listRepository.findById(orderListNo)
				.orElseThrow(() -> new CustomException(ErrorCode.ORDER_NOT_FOUND));
		
		List<OrderDetailResponseDTO> detailList =
				detRepository.findByOrderListNo(orderListNo)
				.stream()
				.map(det -> new OrderDetailResponseDTO(
						det.getOrderDetailNo(),
						det.getOrderDetailMenuName(),
						det.getOrderDetailAmount(),
						det.getOrderDetailTodayPrice()
				))
				.toList();
		
		OrderListResponseDTO resDto = new OrderListResponseDTO(
				listEntity.getOrderListCreateAt(),
				listEntity.getOrderListNo(),
				listEntity.getStoreNo(),				
				listEntity.getOrderStoreName(),
				listEntity.getOrderListVisitTime(),
				listEntity.getOrderListVisitType(),
				listEntity.getOrderListRequest(),
				listEntity.getOrderListTotalPrice(),
				listEntity.getOrderListFinalPrice(),
				detailList
				);
		
		return resDto;
	} //selectOne

	
	
	// U - Update

	// D - Delete

} // class
