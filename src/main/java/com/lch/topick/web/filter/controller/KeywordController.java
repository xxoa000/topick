package com.lch.topick.web.filter.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lch.topick.web.filter.domain.KeywordRequestDTO;
import com.lch.topick.web.filter.domain.SearchResponseDTO;
import com.lch.topick.web.filter.service.KakaoSearchService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/keyword")
@RequiredArgsConstructor
public class KeywordController {

	private final KakaoSearchService kakaoSearchService;

    // 키워드 검색
    // POST /api/keyword
    @PostMapping
    public SearchResponseDTO search(@RequestBody KeywordRequestDTO req) {
        return kakaoSearchService.searchByKeyword(req);
    }
}
