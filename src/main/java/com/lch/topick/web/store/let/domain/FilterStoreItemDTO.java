package com.lch.topick.web.store.let.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FilterStoreItemDTO {
	
	
	private String id;
    private String placeName;    // 카카오 "place_name"
    private String placeUrl;     // 카카오 "place_url"
    private String categoryName;     // 카카오 "category_name"
    private Double x;       // 카카오 "x" (경도)
    private Double y;       // 카카오 "y" (위도)
    private String addressName;      // 카카오 "road_address_name"
}
