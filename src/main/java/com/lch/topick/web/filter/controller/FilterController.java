package com.lch.topick.web.filter.controller;

import java.util.List;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import com.lch.topick.web.filter.domain.FilterRequestDTO;
import com.lch.topick.web.filter.domain.SearchResponseDTO;
import com.lch.topick.web.filter.service.KakaoSearchService;
import com.lch.topick.web.store.let.domain.StoreRequestDTO;

import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/api/filter")
@RequiredArgsConstructor
public class FilterController {

    private final KakaoSearchService kakaoSearchService;

    // 태그 필터링
    @ResponseBody
    @PostMapping
    public SearchResponseDTO filter(@RequestBody FilterRequestDTO req) {
        return kakaoSearchService.searchByFilter(req);
    }

    // 마커 클릭 시 가게 저장 및 메뉴 조회
    @ResponseBody
    @PostMapping("/menu/store")
    public List<MenuDTO> menuList(@RequestBody StoreRequestDTO req) {
        return kakaoSearchService.menuList(req);
    }
}