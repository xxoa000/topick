package com.lch.topick.web.myLocationSet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lch.topick.web.myLocationSet.entity.MyLocationSet;

public interface MyLocationSetRepository extends JpaRepository<MyLocationSet, Integer>{

	List<MyLocationSet> findByMemberId(String memberId);
	
}
