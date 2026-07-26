package com.lch.topick.web.store.let.service;

import java.util.List;

import com.lch.topick.web.store.let.domain.FilterStoreItemDTO;

public interface FilterStoreService {

	void saveStoresIfAbsent(List<FilterStoreItemDTO> items);

	void enrichStoreNumbers(List<FilterStoreItemDTO> items);

	void linkStoresToTags(List<FilterStoreItemDTO> items, List<String> tagNames);

	List<Long> getTagNosByStoreNo(Long storeNo);

	List<Long> getStoreNosByTagNo(Long tagNo);
}
