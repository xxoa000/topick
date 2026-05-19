package com.lch.topick.web.filter.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity 
@Table(name = "tag")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Tag {
	
	@Id
	@Column(name = "tag_no")
	private Long tagNo;
	
	@Column(name = "tag_type")
	private String tagType;  
	
	@Column(name = "tag_name")
	private String tagName;
	
	@Column(name = "tag_status")
	private String tagStatus;
}
