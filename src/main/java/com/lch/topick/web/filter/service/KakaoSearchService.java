package com.lch.topick.web.filter.service;

import java.util.List;

import com.lch.topick.web.filter.domain.FilterRequestDTO;
import com.lch.topick.web.filter.domain.KeywordRequestDTO;
import com.lch.topick.web.filter.domain.MenuDTO;
import com.lch.topick.web.filter.domain.SearchResponseDTO;
import com.lch.topick.web.store.let.domain.StoreRequestDTO;


public interface KakaoSearchService {

    // 키워드 검색
    SearchResponseDTO searchByKeyword(KeywordRequestDTO req);

    // 태그 필터링
    SearchResponseDTO searchByFilter(FilterRequestDTO req);

    List<MenuDTO> menuList(StoreRequestDTO req);
}