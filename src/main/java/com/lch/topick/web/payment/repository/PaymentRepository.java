package com.lch.topick.web.payment.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lch.topick.web.payment.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment,Long> {
	
	

}
