package com.lch.topick.web.filter.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.lch.topick.web.filter.domain.FilterRequestDTO;
import com.lch.topick.web.filter.domain.SearchResponseDTO;
import com.lch.topick.web.filter.service.KakaoSearchService;

import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/api/filter")
@RequiredArgsConstructor
public class FilterController {

	 private final KakaoSearchService kakaoSearchService;

	    // 태그 필터링
	    // POST /api/filter
	    @ResponseBody
	    @PostMapping
	    public SearchResponseDTO filter(@RequestBody FilterRequestDTO req) {
	        return kakaoSearchService.searchByFilter(req);
	    }
	   
}
