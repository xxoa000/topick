package com.lch.topick.web.filter.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class KeywordRequestDTO {
	private Double neY;
    private Double neX;
    private Double swY;
    private Double swX;
    private String keyword;   // 검색어만
}
