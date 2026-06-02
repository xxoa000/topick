package com.lch.topick.web.store.let.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FilterStoreRequestDTO {

    private Long storeNo;

    private String kakaoId;

    private String storeName;

}