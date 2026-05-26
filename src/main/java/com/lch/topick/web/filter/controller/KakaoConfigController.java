package com.lch.topick.web.filter.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lch.topick.web.filter.domain.KakaoMapsConfigDTO;

@RestController
@RequestMapping("/api/config")
public class KakaoConfigController {

    @Value("${kakao.maps.js-key:}")
    private String kakaoMapsJsKey;

    @GetMapping("/kakao-maps-js-key")
    public KakaoMapsConfigDTO getKakaoMapsJsKey() {
        return new KakaoMapsConfigDTO(this.kakaoMapsJsKey);
    }
}
