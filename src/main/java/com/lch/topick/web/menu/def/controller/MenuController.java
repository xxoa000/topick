package com.lch.topick.web.menu.def.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lch.topick.web.menu.def.entity.Menu;
import com.lch.topick.web.menu.def.service.MenuService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class MenuController {

	private final MenuService menuService;
	//cummit test
	/* (SELECT) 식당 상세 > 메뉴 리스트 */
	@GetMapping("/store/{storeNo}/menu")
	public ResponseEntity<?> menuList(@PathVariable("storeNo") Long storeNo) {
		List<Menu> list = menuService.selectList(storeNo);

		if (!list.isEmpty() && list.size() > 0) {
			return ResponseEntity.status(HttpStatus.OK).body(list);
		} else {
			return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body("메뉴가 없습니다.");
		}
	}//menuList
	
	/* (SELECT) 메뉴 리스트 > 메뉴 상세 */
	@GetMapping("/menu/{menuNo}")
	public ResponseEntity<?> menuDetail(@PathVariable Long MenuNo) {
		List<Menu> list = menuService.selectOne(MenuNo);
		
		if (!list.isEmpty() && list.size() > 0) {
			return ResponseEntity.status(HttpStatus.OK).body(list);
		} else {
			return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body("메뉴가 없습니다.");
		}
	}//menuDetail

}// class
