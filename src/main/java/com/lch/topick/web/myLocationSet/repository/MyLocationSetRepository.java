package com.lch.topick.web.myLocationSet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.lch.topick.web.myLocationSet.entity.MyLocationSet;

public interface MyLocationSetRepository extends JpaRepository<MyLocationSet, Long>{

	List<MyLocationSet> findByMemberIdOrderByAddressDefaultDesc(String memberId);
	
	// 🌟 특정 회원의 모든 기본 배송지 설정을 'N'으로 초기화하는 쿼리
    @Modifying
    @Query("UPDATE MyLocationSet m SET m.addressDefault = 'N' WHERE m.memberId = :memberId")
    void resetDefaultAddress(@Param("memberId") String memberId);
}
