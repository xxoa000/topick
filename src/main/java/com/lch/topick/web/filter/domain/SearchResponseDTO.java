package com.lch.topick.web.filter.domain;

import java.util.List;

import com.lch.topick.web.store.let.domain.FilterStoreItemDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class SearchResponseDTO {
    private int total;
    private List<FilterStoreItemDTO> item;
}
