package com.lch.topick.web.filter.domain;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FilterRequestDTO {
	private Double neY;
    private Double neX;
    private Double swY;
    private Double swX;
    
    private List<String> tagName;  // 태그만
    
    private Double x;
    private Double y;
}
