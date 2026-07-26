package com.lch.topick.web.payment.entity;

import java.time.LocalDateTime;

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

@Table(name = "payment")
@Entity

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Payment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "payment_no", nullable = false)
	private Long paymentNo;
	
	@Column(name = "order_list_no", nullable = false)
	private Long orderListNo;
	
	@Column(name = "payment_method", nullable = false, length = 30)
	private String paymentMethod;
	
	@Builder.Default
	@Column(name = "payment_status", nullable = false, length = 20)
	private String paymentStatus ="ready";
	
	@Builder.Default
	@Column(name = "payment_price", nullable = false)
	private Integer paymentPrice = 0;
	
	@Column(name = "payment_tid", length = 100)
	private String paymentTid;
	
	// 결제 승인 시간
	@Column(name = "payment_approve_at")
	private LocalDateTime paymentApproveAt;
	
	
	
	
	
	
	
}
