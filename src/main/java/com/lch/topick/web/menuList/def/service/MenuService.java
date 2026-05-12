package com.lch.topick.web.menuList.def.service;

import java.util.List;
import com.lch.topick.web.menuList.def.entity.Menu;

public interface MenuService {

	public List<Menu> selectList(Long storeNo);
	
	public List<Menu> selectOptionList(Long menuNo);
	
}//interface
