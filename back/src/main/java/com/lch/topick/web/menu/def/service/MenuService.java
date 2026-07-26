package com.lch.topick.web.menu.def.service;

import java.util.List;

import com.lch.topick.web.menu.def.entity.Menu;

public interface MenuService {

	/* 식당 상세 > 메뉴 리스트 */
	public List<Menu> selectList(Long storeNo);
	
	/* 메뉴 리스트 > 메뉴 상세 */
	public Menu selectOne(Long menuNo);

	/* 식당 상세 > 메뉴 추가, 수정 */
	public Long save (Menu entity);
	
	/* 메뉴 리스트 > 메뉴 삭제 */
	public void delete(Long menuNo) throws Exception;
	
	
}//interface
