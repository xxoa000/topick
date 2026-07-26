package com.lch.topick.web.store.let.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.lch.topick.web.store.let.entity.FilterStore;


public interface FilterStoreRepository extends JpaRepository<FilterStore, Long> {
	
	FilterStore findByKakaoId(String kakaoId);
	
} //interface
