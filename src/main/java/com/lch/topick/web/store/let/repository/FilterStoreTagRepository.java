package com.lch.topick.web.store.let.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lch.topick.web.store.let.entity.FilterStoreTag;
import com.lch.topick.web.store.let.entity.FilterStoreTagId;

public interface FilterStoreTagRepository extends JpaRepository<FilterStoreTag, FilterStoreTagId> {

	List<FilterStoreTag> findByStoreNo(Long storeNo);

	List<FilterStoreTag> findByTagNo(Long tagNo);
}
