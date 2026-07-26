package com.lch.topick.web.pick.service;

import com.lch.topick.web.pick.domain.PickDomain;
import java.util.List;

public interface PickService {
    
	//사용자 기호 기반 메뉴 추천 메서드
    List<String> getRecommendedFood(PickDomain request);
}