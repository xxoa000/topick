package com.lch.topick.web.filter.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class IndexController {

    @GetMapping("/")
    public Map<String, String> index() {
        return Map.of(
                "service", "topick-backend",
                "hint", "React 화면은 Vite dev 서버에서 여세요 (front 폴더에서 npm run dev)",
                "frontendUrl", "http://localhost:5173",
                "apiTag", "/api/tag");
    }
}
