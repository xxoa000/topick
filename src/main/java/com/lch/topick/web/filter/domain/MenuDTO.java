package com.lch.topick.web.filter.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MenuDTO {
    private Long menuNo;
    private String menuName;
    private Integer menuPrice;
}
