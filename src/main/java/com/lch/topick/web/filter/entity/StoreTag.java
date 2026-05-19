package com.lch.topick.web.filter.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "store_tag")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StoreTag {
	
	@Id
	@Column(name = "store_no")
	private long storeNo;
	
	@Id
	@Column(name = "tag_no")
	private long tagNo;
}
