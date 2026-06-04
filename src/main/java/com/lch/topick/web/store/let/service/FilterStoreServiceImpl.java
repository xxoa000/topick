package com.lch.topick.web.store.let.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lch.topick.web.filter.entity.Tag;
import com.lch.topick.web.filter.repository.TagRepository;
import com.lch.topick.web.store.let.domain.FilterStoreItemDTO;
import com.lch.topick.web.store.let.entity.FilterStore;
import com.lch.topick.web.store.let.entity.FilterStoreTag;
import com.lch.topick.web.store.let.repository.FilterStoreRepository;
import com.lch.topick.web.store.let.repository.FilterStoreTagRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class FilterStoreServiceImpl implements FilterStoreService {

	private final FilterStoreRepository storeRepository;
	private final FilterStoreTagRepository storeTagRepository;
	private final TagRepository tagRepository;

	@Override
	public void saveStoresIfAbsent(List<FilterStoreItemDTO> items) {
		for (FilterStoreItemDTO item : items) {
			if (item.getId() == null || item.getId().isBlank()) {
				continue;
			}
			String name = item.getPlaceName();
			if (name == null || name.isBlank()) {
				continue;
			}
			if (storeRepository.findByKakaoId(item.getId()) != null) {
				continue;
			}
			FilterStore newStore = new FilterStore();
			newStore.setKakaoId(item.getId());
			newStore.setStoreName(name);
			storeRepository.save(newStore);
		}
	}

	@Override
	public void enrichStoreNumbers(List<FilterStoreItemDTO> items) {
		for (FilterStoreItemDTO item : items) {
			if (item.getId() == null || item.getId().isBlank()) {
				continue;
			}
			FilterStore store = storeRepository.findByKakaoId(item.getId().trim());
			if (store != null) {
				item.setStoreNo(store.getStoreNo());
			}
		}
	}

	@Override
	public void linkStoresToTags(List<FilterStoreItemDTO> items, List<String> tagNames) {
		if (items == null || items.isEmpty() || tagNames == null || tagNames.isEmpty()) {
			return;
		}

		List<String> normalizedNames = tagNames.stream()
				.filter(tag -> tag != null && !tag.isBlank())
				.map(String::trim)
				.distinct()
				.toList();
		if (normalizedNames.isEmpty()) {
			return;
		}

		List<Tag> tags = tagRepository.findByTagNameInAndTagStatus(normalizedNames, "active");
		if (tags.isEmpty()) {
			return;
		}

		for (FilterStoreItemDTO item : items) {
			Long storeNo = item.getStoreNo();
			if (storeNo == null) {
				continue;
			}
			for (Tag tag : tags) {
				storeTagRepository.save(new FilterStoreTag(storeNo, tag.getTagNo()));
			}
		}
	}

	@Override
	@Transactional(readOnly = true)
	public List<Long> getTagNosByStoreNo(Long storeNo) {
		if (storeNo == null) {
			return List.of();
		}
		return storeTagRepository.findByStoreNo(storeNo).stream()
				.map(FilterStoreTag::getTagNo)
				.toList();
	}

	@Override
	@Transactional(readOnly = true)
	public List<Long> getStoreNosByTagNo(Long tagNo) {
		if (tagNo == null) {
			return List.of();
		}
		return storeTagRepository.findByTagNo(tagNo).stream()
				.map(FilterStoreTag::getStoreNo)
				.toList();
	}
}
