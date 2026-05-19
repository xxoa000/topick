package com.lch.topick.web.filter.domain;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class SearchResponseDTO {
    private int total;
    private List<StoreItemDTO> item;
}
