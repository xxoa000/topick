package com.lch.topick.web.store.let.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.lch.topick.web.store.let.entity.AStore;


public interface AStoreRepository extends JpaRepository<AStore, Long> {
	AStore findByKakaoId(String kakaoId);
} //interface
