package com.lch.topick.web.store.let.entity;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FilterStoreTagId implements Serializable {

	private Long storeNo;
	private Long tagNo;
}
