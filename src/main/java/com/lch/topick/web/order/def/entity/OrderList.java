package com.lch.topick.web.order.def.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "order_list")

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class) // 생성,수정시간 자동감지 리스너
public class OrderList {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "order_list_no", nullable = false)
	private Long orderListNo;

	@Column(name = "member_id", nullable = false, length = 30)
	private String memberId;

	@Column(name = "store_no", nullable = false)
	private Long storeNo;

	@Column(name = "order_store_name", nullable = false, length = 100)
	private String orderStoreName;

	// 주문 상태 (create, pay, cancel, complete)
	@Builder.Default
	@Column(name = "order_list_status", nullable = false, length = 20)
	private String orderListStatus = "create";

	// 총 주문 가격
	@Builder.Default
	@Column(name = "order_list_total_price", nullable = false)
	private Integer orderListTotalPrice = 0;

	// 실제 주문 가격
	@Builder.Default
	@Column(name = "order_list_final_price", nullable = false)
	private Integer orderListFanalPrice = 0;

	// 주문 생성 시간
	@CreatedDate
	@Column(name = "order_list_create_at", nullable = false, updatable = false)
	private LocalDateTime orderListCreateAt;

	// 방문 시간
	@Column(name = "order_list_visit_time")
	private LocalDateTime orderListVisitTime;

	// 방문 타입 (visit, takeout)
	@Builder.Default
	@Column(name = "order_list_visit_type", nullable = false, length = 20)
	private String orderListVisitType = "visit";

	// 주문시 요청사항
	@Column(name = "order_list_request", length = 255)
	private String orderListRequest;
	
	
	// 총 금액 계산
	// 추후 finalPrice 할인금액 계산 메서드 추가
	public void changePrice(int totalPrice) {
		this.orderListTotalPrice = totalPrice;
		this.orderListFanalPrice = totalPrice;
	}

}// class
