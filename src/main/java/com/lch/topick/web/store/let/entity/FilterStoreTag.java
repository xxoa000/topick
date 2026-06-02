package com.lch.topick.web.store.let.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "store_tag")
@IdClass(FilterStoreTagId.class)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FilterStoreTag {

	@Id
	@Column(name = "store_no")
	private Long storeNo;

	@Id
	@Column(name = "tag_no")
	private Long tagNo;
}
