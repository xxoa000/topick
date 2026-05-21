package com.lch.topick.web.order.def.entity;

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
@Table(name = "order_detail")

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class) // 생성,수정시간 자동감지 리스너
public class OrderDetail {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "order_detail_no", nullable = false)
	private Long orderDetailNo;
	
	@Column(name = "order_list_no", nullable = false)
	private Long orderListNo;
	
	@Column(name = "menu_no", nullable = false)
	private Long menuNo;
	
	@Builder.Default
	@Column(name = "order_detail_amount", nullable = false)
	private Integer orderDetailAmount = 1;
	
	@Column(name = "order_detail_menu_name", nullable = false, length = 100)
	private String orderDetailMenuName;
	
	@Builder.Default
	@Column(name = "order_detail_today_price", nullable = false)
	private Integer orderDetailTodayPrice = 0;

} //class