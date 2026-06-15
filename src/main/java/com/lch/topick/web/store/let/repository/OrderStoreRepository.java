package com.lch.topick.web.store.let.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lch.topick.web.store.let.entity.FilterStore;

public interface OrderStoreRepository extends JpaRepository<FilterStore, Long> {
	
	public Optional<FilterStore> findByKakaoId(String kakaoId);
	
	public Optional<FilterStore> findByStoreNo( Long storeNo );

}
