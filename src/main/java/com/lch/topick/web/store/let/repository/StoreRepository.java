package com.lch.topick.web.store.let.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.lch.topick.web.store.let.entity.Store;


public interface StoreRepository extends JpaRepository<Store, Long> {
	Store findByKakaoId(String kakaoId);
} //interface
