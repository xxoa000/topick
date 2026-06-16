package com.lch.topick.web.menu.def.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="menu")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Menu {

	@Id
	@Column(name="menu_no", nullable=false)
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long menuNo;
	
	@Column(name="store_no", nullable=false)
	private Long storeNo;
	
	@Column(name="menu_name", nullable=false, length=100)
	private String menuName;
	
	@Column(name="menu_image", nullable=false, length=500)
	private String menuImage;
	
	@Column(name="menu_price", nullable=false)
	private Integer menuPrice;
	
	@Column(name="menu_stock", nullable=false)
	private Integer menuStock;
	
	@Column(name="menu_content", length=255)
	private String menuContent;
	
	@Column(name="menu_warning", length=255)
	private String menuWarning;
	
	@Column(name="menu_status", nullable=false, length=100)
	private String menuStatus;

}//class
