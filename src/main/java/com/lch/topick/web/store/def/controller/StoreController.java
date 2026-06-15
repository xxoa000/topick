package com.lch.topick.web.store.def.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lch.topick.web.store.def.service.StoreProxyService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/store")
public class StoreController {
	private final StoreProxyService storeProxyService;

    // React에서 /api/store/1737248239 로 요청을 보냄
    @GetMapping("/{id}")
    public ResponseEntity<String> getRestaurantDetails(@PathVariable("id") String id) {
        String jsonResult = storeProxyService.fetchStoreData(id);
        String jsonResult2 = storeProxyService.fetchMenuData("6907");
        System.out.println(jsonResult2);
        // 가공 없이 그대로 JSON 형식으로 프론트엔드에 반환
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(jsonResult);
    }
}
