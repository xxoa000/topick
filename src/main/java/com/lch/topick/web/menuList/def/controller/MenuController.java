package com.lch.topick.web.menuList.def.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lch.topick.web.menuList.def.entity.Menu;
import com.lch.topick.web.menuList.def.service.MenuService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;


@Log4j2
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/menu")
public class MenuController {
	
	private final MenuService menuService;

	@GetMapping("/list")
	public ResponseEntity<?> menuList(Long storeNo) {
		
		//ResponseEntity<?> entity = null;
		List<Menu> list = menuService.selectList(storeNo);
		
		
		if ( !list.isEmpty() && list.size()>0) { return new ResponseEntity<Menu>(list, HttpStatus.OK);
		} else {
			return new ResponseEntity<String>("메뉴가 없습니다.", HttpStatus.BAD_GATEWAY);
		};

	}//menuList
	
	
	
	
	
}//class
