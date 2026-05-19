package com.lch.topick.web.pick.controller;

import com.lch.topick.web.pick.domain.PickDomain;
import com.lch.topick.web.pick.service.PickService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // JSON 데이터를 주고받는 API 컨트롤러
@RequestMapping("/api/pick") //백앤드
@RequiredArgsConstructor
public class PickController {

    private final PickService pickService;

    @PostMapping("/recommendMenu")
    public List<String> recommendMenu(@RequestBody PickDomain request) { //@RequestBody: JSON 형태의 데이터를 pickDomain으로 변환
        // 서비스에 구현해둔 추천 로직 실행 -> 결과 return
        return pickService.getRecommendedFood(request);
    }
}