package com.lch.topick.web.menuList.def.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

	@GetMapping("/list/{storeNo}")
	public ResponseEntity<?> menuList(@PathVariable("storeNo") Long storeNo) {
		
		//ResponseEntity<?> entity = null;
		List<Menu> list = menuService.selectList(storeNo);
		
		
		if ( !list.isEmpty() && list.size()>0) { return ResponseEntity.ok(list);
		} else {
			return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body("메뉴가 없습니다.");
		}

	}//menuList
	
	
	
	
	
}//class
