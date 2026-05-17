package com.lch.topick.web.pick.domain;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

/**
 * 사용자가 선택한 6가지 답변 저장
 */

@Getter
@Setter
public class PickDomain {
    private String foodTemp;       		// 온도에 대한 사용자 답변
    private List<String> foodExcludeCategory;	// 제외 카테고리에 대한 사용자 답변
    private String foodIsSoup;        	// 국물 유무에 대한 사용자 답변
    private List<String> foodMainIngredient; 	// 메인 재료에 대한 사용자 답변
    private List<String> foodFlavor;         	// 맛에 대한 사용자 답변
    private String foodFullness;       	// 포만감에 대한 사용자 답변
}